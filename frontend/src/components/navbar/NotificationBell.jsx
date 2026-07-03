import { useState, useRef, useEffect } from "react";
import { Bell, CloudSun, RefreshCw, MapPin } from "lucide-react";
import { useWeatherNotifications } from "../../context/WeatherNotificationContext";

const NotificationCard = ({ notification }) => (
  <div className="p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50/80 transition-colors">
    <p className="text-sm font-black text-slate-800 mb-3">Good Morning!</p>

    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
      Today&apos;s Destinations
    </p>
    <ul className="mb-3 space-y-0.5">
      {notification.destinations.map((name) => (
        <li key={name} className="text-sm text-slate-700 flex items-center gap-1.5">
          <span className="text-[#00b0a5]">•</span> {name}
        </li>
      ))}
    </ul>

    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
      Weather Forecast
    </p>
    <ul className="mb-3 space-y-0.5">
      {notification.forecasts.map((f) => (
        <li key={f.name} className="text-sm text-slate-700 flex items-start gap-1.5">
          <span className="text-[#00b0a5] mt-0.5">•</span>
          <span>
            <span className="font-semibold">{f.name}</span>
            {" — "}
            {f.summary}
          </span>
        </li>
      ))}
    </ul>

    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
      Recommendation
    </p>
    <p className="text-sm text-slate-700 leading-relaxed">{notification.recommendation}</p>

    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[10px] text-slate-400 font-semibold">
      <MapPin className="w-3 h-3" />
      {notification.packageName} · Day {notification.tourDay}
    </div>
  </div>
);

const NotificationBell = () => {
  const { notifications, unreadCount, loading, refreshNotifications, markAllRead, isCustomer } =
    useWeatherNotifications();
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  if (!isCustomer) return null;

  const handleToggle = () => {
    const next = !open;
    setOpen(next);
    if (next) {
      markAllRead();
      if (!notifications.length && !loading) refreshNotifications();
    }
  };

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={handleToggle}
        className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-50 transition-colors cursor-pointer"
        aria-label="Weather notifications"
        title="Tour weather notifications"
      >
        <Bell className="w-5 h-5 text-slate-600" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 bg-[#00b0a5] text-white text-[9px] font-black rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute top-[120%] right-0 w-[min(100vw-2rem,380px)] bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.12)] rounded-2xl overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CloudSun className="w-4 h-4 text-[#00b0a5]" />
              <div>
                <p className="text-sm font-bold text-slate-800">Weather Alerts</p>
                <p className="text-[10px] text-slate-400 font-medium">Daily tour forecasts</p>
              </div>
            </div>
            <button
              onClick={refreshNotifications}
              disabled={loading}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-[#00b0a5] disabled:opacity-50 cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>

          <div className="max-h-[420px] overflow-y-auto">
            {loading && notifications.length === 0 && (
              <div className="flex items-center justify-center gap-2 py-10 text-slate-400">
                <RefreshCw className="w-4 h-4 animate-spin text-[#00b0a5]" />
                <span className="text-sm font-semibold">Loading forecasts…</span>
              </div>
            )}

            {!loading && notifications.length === 0 && (
              <div className="py-10 px-6 text-center">
                <CloudSun className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                <p className="text-sm font-bold text-slate-600">No weather alerts</p>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Daily weather updates appear here when your package tour has started.
                </p>
              </div>
            )}

            {notifications.map((n) => (
              <NotificationCard key={n.id} notification={n} />
            ))}
          </div>

          {notifications.length > 0 && (
            <div className="px-4 py-2 bg-slate-50 border-t border-slate-100">
              <p className="text-[10px] text-slate-400 text-center font-medium">
                Powered by Open-Meteo · Refreshes hourly
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
