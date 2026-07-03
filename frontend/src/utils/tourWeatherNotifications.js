import { buildApiUrl } from "../config/api";
import {
  loadLocationWeather,
  summarizeLocationWeather,
  buildWeatherRecommendation,
} from "../services/weatherService";

const READ_STORAGE_KEY = "cbt_weather_notifications_read";

export const getTodayDateStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export const parseDateOnly = (dateStr) => {
  if (!dateStr) return null;
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export const isDateInTourRange = (startDate, endDate, today = new Date()) => {
  const start = parseDateOnly(startDate);
  const end = parseDateOnly(endDate);
  if (!start || !end) return false;
  const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return t >= start && t <= end;
};

export const getTourDayNumber = (startDate, today = new Date()) => {
  const start = parseDateOnly(startDate);
  if (!start) return 1;
  const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const diff = Math.floor((t - start) / (1000 * 60 * 60 * 24));
  return Math.max(1, diff + 1);
};

export const getNotificationId = (bookingId, dateStr = getTodayDateStr()) =>
  `${bookingId}-${dateStr}`;

export const getReadNotificationIds = () => {
  try {
    return JSON.parse(localStorage.getItem(READ_STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
};

export const markNotificationRead = (notificationId) => {
  const read = getReadNotificationIds();
  read[notificationId] = Date.now();
  localStorage.setItem(READ_STORAGE_KEY, JSON.stringify(read));
};

export const markNotificationsRead = (notificationIds) => {
  const read = getReadNotificationIds();
  const now = Date.now();
  notificationIds.forEach((id) => { read[id] = now; });
  localStorage.setItem(READ_STORAGE_KEY, JSON.stringify(read));
};

export const isActivePackageTour = (booking) =>
  booking?.tourType === "PACKAGE"
  && booking?.status === "TOUR_STARTED"
  && booking?.packageId
  && isDateInTourRange(booking.startDate, booking.endDate);

export const buildDailyWeatherNotification = async (booking) => {
  const dateStr = getTodayDateStr();
  const tourDay = getTourDayNumber(booking.startDate);
  const notificationId = getNotificationId(booking.id, dateStr);

  const res = await fetch(buildApiUrl(`/packages/${booking.packageId}`));
  const pkg = await res.json();
  if (!res.ok) throw new Error(pkg.error || "Failed to load package.");

  const todayPlaces = (pkg.destinations || []).filter(
    (p) => Number(p.dayNumber) === tourDay
  );

  if (todayPlaces.length === 0) return null;

  const weatherResults = await Promise.all(
    todayPlaces.map(async (place) => {
      try {
        const { weatherData } = await loadLocationWeather(place.name);
        const forecast = summarizeLocationWeather(weatherData);
        return {
          name: place.name,
          ...forecast,
          error: null,
        };
      } catch (err) {
        return {
          name: place.name,
          summary: "Weather unavailable",
          isRainy: false,
          maxTemp: null,
          error: err.message,
        };
      }
    })
  );

  const recommendation = buildWeatherRecommendation(weatherResults);

  return {
    id: notificationId,
    bookingId: booking.id,
    packageName: booking.packageName || pkg.title || "Package Tour",
    tourDay,
    dateStr,
    destinations: todayPlaces.map((p) => p.name),
    forecasts: weatherResults,
    recommendation,
    createdAt: Date.now(),
  };
};

export const fetchActiveTourNotifications = async (bookings) => {
  const active = (bookings || []).filter(isActivePackageTour);
  if (!active.length) return [];

  const results = await Promise.all(
    active.map((b) => buildDailyWeatherNotification(b).catch(() => null))
  );

  return results.filter(Boolean);
};
