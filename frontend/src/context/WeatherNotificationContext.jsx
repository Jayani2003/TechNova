import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { AuthContext } from "./AuthContext";
import { api } from "../config/api";
import {
  fetchActiveTourNotifications,
  getReadNotificationIds,
  markNotificationsRead,
} from "../utils/tourWeatherNotifications";

const WeatherNotificationContext = createContext(null);

export const WeatherNotificationProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const intervalRef = useRef(null);

  const isCustomer = Boolean(
    user && (!user.role || String(user.role).toUpperCase() === "CUSTOMER")
  );

  const syncUnreadCount = useCallback((items) => {
    const read = getReadNotificationIds();
    const count = items.filter((n) => !read[n.id]).length;
    setUnreadCount(count);
  }, []);

  const refreshNotifications = useCallback(async () => {
    if (!isCustomer) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    setLoading(true);
    try {
      const data = await api.get("/bookings/my");
      const items = await fetchActiveTourNotifications(data.bookings || []);
      setNotifications(items);
      syncUnreadCount(items);
    } catch (err) {
      console.error("[WeatherNotifications]", err);
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  }, [isCustomer, syncUnreadCount]);

  useEffect(() => {
    if (!isCustomer) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    refreshNotifications();

    intervalRef.current = setInterval(refreshNotifications, 60 * 60 * 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isCustomer, refreshNotifications]);

  const markAllRead = useCallback(() => {
    if (!notifications.length) return;
    markNotificationsRead(notifications.map((n) => n.id));
    setUnreadCount(0);
  }, [notifications]);

  return (
    <WeatherNotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        refreshNotifications,
        markAllRead,
        isCustomer,
      }}
    >
      {children}
    </WeatherNotificationContext.Provider>
  );
};

export const useWeatherNotifications = () => {
  const ctx = useContext(WeatherNotificationContext);
  if (!ctx) {
    throw new Error("useWeatherNotifications must be used within WeatherNotificationProvider");
  }
  return ctx;
};
