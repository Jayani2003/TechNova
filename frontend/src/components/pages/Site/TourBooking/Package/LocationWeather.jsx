import React, { useState, useEffect } from "react";
import { CloudRain, Wind, Calendar, RefreshCw, AlertTriangle } from "lucide-react";
import WeatherModal, { getWeatherInfo } from "./WeatherModal";

// ─── Geocode a location name → { latitude, longitude } ────────────────────────
// Tries the exact name first, then with ", Sri Lanka" appended for local context.
const geocodeLocation = async (name) => {
  const trySearch = async (query) => {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=3&language=en&format=json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Geocoding API returned ${res.status}`);
    const data = await res.json();
    return data.results && data.results.length > 0 ? data.results[0] : null;
  };

  // 1st attempt: exact name
  let result = await trySearch(name);
  if (result) return result;

  // 2nd attempt: add "Sri Lanka" as context hint
  result = await trySearch(`${name}, Sri Lanka`);
  if (result) return result;

  return null;
};

// ─── Fetch weather forecast for coords ────────────────────────────────────────
const fetchForecast = async (latitude, longitude) => {
  const url = [
    `https://api.open-meteo.com/v1/forecast`,
    `?latitude=${latitude}`,
    `&longitude=${longitude}`,
    `&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m`,
    `&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,weather_code,wind_speed_10m`,
    `&timezone=auto`,
    `&forecast_days=7`,
  ].join('');

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Weather API returned ${res.status}`);
  const data = await res.json();
  if (!data.current) throw new Error("Unexpected weather response format");
  return data;
};

// ─── Component ────────────────────────────────────────────────────────────────
const LocationWeather = ({ locationName }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resolvedName, setResolvedName] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    let active = true;
    if (!locationName) {
      setError("No location name provided.");
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);
      setError(null);
      setWeatherData(null);
      setResolvedName(null);

      try {
        // Step 1 – Geocode
        const geo = await geocodeLocation(locationName);
        if (!geo) {
          throw new Error(`Location "${locationName}" not found. Please check the place name.`);
        }

        const { latitude, longitude, name, country } = geo;
        const displayName = [name, country].filter(Boolean).join(", ");

        // Step 2 – Weather
        const data = await fetchForecast(latitude, longitude);

        if (active) {
          setResolvedName(displayName);
          setWeatherData(data);
          setLoading(false);
        }
      } catch (err) {
        console.error("[LocationWeather] Error for", locationName, err);
        if (active) {
          setError(err.message || "Failed to load weather.");
          setLoading(false);
        }
      }
    };

    load();
    return () => { active = false; };
  }, [locationName, refreshTrigger]);

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="mt-3 px-3 py-3 border border-slate-100 bg-slate-50/50 rounded-xl flex items-center gap-2">
        <RefreshCw className="w-3.5 h-3.5 text-[#00b0a5] animate-spin flex-shrink-0" />
        <span className="text-[11px] text-slate-400 font-semibold">Fetching live weather…</span>
      </div>
    );
  }

  // ── Error ───────────────────────────────────────────────────────────────────
  if (error || !weatherData) {
    return (
      <div className="mt-3 px-3 py-3 border border-amber-100 bg-amber-50/30 rounded-xl">
        <div className="flex items-start gap-2 mb-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] font-bold text-amber-700 leading-snug">
            Weather unavailable
          </p>
        </div>
        <p className="text-[10px] text-slate-500 mb-2 pl-5">{error}</p>
        <button
          onClick={() => setRefreshTrigger(v => v + 1)}
          className="ml-5 inline-flex items-center gap-1 text-[10px] font-bold text-[#00b0a5] hover:text-[#008c83] bg-white border border-slate-200 px-2 py-1 rounded-lg transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3 h-3" /> Retry
        </button>
      </div>
    );
  }

  // ── Success ─────────────────────────────────────────────────────────────────
  const current = weatherData.current;
  const wInfo = getWeatherInfo(current.weather_code);

  return (
    <div className="mt-3 p-3 border border-slate-100 bg-gradient-to-br from-slate-50/80 to-white rounded-xl relative transition-all duration-300 hover:shadow-sm">

      {/* Resolved city label */}
      {resolvedName && (
        <p className="text-[9px] font-bold text-[#00b0a5] uppercase tracking-widest mb-2 flex items-center gap-1">
          <span>🌐</span> {resolvedName}
        </p>
      )}

      {/* Main weather section */}
      <div className="flex flex-col items-start gap-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{wInfo.icon}</span>
          <div>
            <span className="text-lg font-black text-slate-800 tracking-tight">
              {Math.round(current.temperature_2m)}°C
            </span>
            <p className="text-[10px] font-bold text-slate-500 leading-tight">
              {wInfo.label} · Feels {Math.round(current.apparent_temperature)}°C
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-0.5 bg-[#00b0a5] hover:bg-[#009b91] text-white px-1 py-0 rounded text-[7px] font-semibold cursor-pointer"
        >
          <Calendar className="w-1.5 h-1.5" />
          Forecast
        </button>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 mt-2 pt-2 border-t border-slate-100">
        <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-500">
          <CloudRain className="w-3 h-3 text-sky-400" />
          Humidity {current.relative_humidity_2m}%
        </span>
        <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-500">
          <Wind className="w-3 h-3 text-slate-400" />
          Wind {current.wind_speed_10m} km/h
        </span>
        <button
          onClick={() => setRefreshTrigger(v => v + 1)}
          className="ml-auto p-1 text-slate-300 hover:text-[#00b0a5] rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          title="Refresh weather"
        >
          <RefreshCw className="w-3 h-3" />
        </button>
      </div>

      {/* Forecast modal */}
      {showModal && (
        <WeatherModal
          locationName={resolvedName || locationName}
          forecastHourly={weatherData.hourly}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default LocationWeather;
