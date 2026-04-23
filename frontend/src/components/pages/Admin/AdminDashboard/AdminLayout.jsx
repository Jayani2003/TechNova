// components/pages/Admin/AdminDashboard/AdminLayout.jsx
import { useState, useEffect, useContext } from "react";
import { NavLink, Link, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../context/AuthContext";
import { Sun, Moon, Home, User, LogIn } from "lucide-react";

const NAV_ITEMS = [
  { label: "Overview",  path: "/admin/admin-dashboard",  id: "overview", badge: 0  },
  { label: "Bookings",  path: "/admin/approve-bookings", id: "bookings", badge: 34 },
  { label: "Payments",  path: "/admin/seasonal-pricing", id: "payments", badge: 0  },
  { label: "Fleet",     path: "/admin/fleet-management", id: "fleet",    badge: 0  },
  { label: "Packages",  path: "/admin/tour-packages",    id: "packages", badge: 0  },
  { label: "Gallery",   path: "/admin/add-gallery",      id: "gallery",  badge: 0  },
  { label: "Messages",  path: "/admin/messages",         id: "messages", badge: 8  },
  { label: "Reports",   path: "/admin/report",           id: "reports",  badge: 0  },
];

function tabClass(isActive, dark) {
  const base = "relative flex items-center gap-1.5 px-6 py-4 whitespace-nowrap transition-all duration-200 border-b-2 -mb-px";
  if (isActive) return base + " text-[#00b0a5] border-[#00b0a5] font-extrabold";
  if (dark)     return base + " text-slate-400 border-transparent hover:text-[#00b0a5] font-bold";
  return              base + " text-slate-500 border-transparent hover:text-[#00b0a5] font-bold";
}

export default function AdminLayout() {
  const [dark, setDark] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/"); };

  // body/root CSS that conflicts with admin full-width layout
  useEffect(() => {
    const body = document.body;
    const root = document.getElementById("root");
    const prev = {
      bodyDisplay:  body.style.display,
      bodyPlace:    body.style.placeItems,
      bodyBg:       body.style.backgroundColor,
      rootWidth:    root ? root.style.width    : "",
      rootMaxWidth: root ? root.style.maxWidth : "",
      rootMargin:   root ? root.style.margin   : "",
    };
    body.style.display         = "block";
    body.style.placeItems      = "unset";
    body.style.backgroundColor = "transparent";
    if (root) {
      root.style.width    = "100%";
      root.style.maxWidth = "100%";
      root.style.margin   = "0";
    }
    return () => {
      body.style.display         = prev.bodyDisplay;
      body.style.placeItems      = prev.bodyPlace;
      body.style.backgroundColor = prev.bodyBg;
      if (root) {
        root.style.width    = prev.rootWidth;
        root.style.maxWidth = prev.rootMaxWidth;
        root.style.margin   = prev.rootMargin;
      }
    };
  }, []);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  // ── Icon button style (shared) ────────────────────────────────────────────
  const railBtn = {
    width: 40, height: 40,
    display: "flex", alignItems: "center", justifyContent: "center",
    borderRadius: 10, border: "none",
    background: "rgba(255,255,255,0.12)",
    color: "white",
    cursor: "pointer",
    transition: "background 0.2s",
  };

  return (
    <div style={{
      display: "block",
      minHeight: "100vh",
      width: "100%",
      color: "#0f172a",
      textAlign: "left",
      background: dark ? "#020617" : "#f8fafc",
    }}>

      <style>{`
        @keyframes pulse-badge { 0%,100%{transform:scale(1)} 50%{transform:scale(1.2)} }
        @keyframes gradShift {
          0%  { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100%{ background-position: 0% 50%; }
        }
        .rail-btn:hover { background: rgba(255,255,255,0.25) !important; }
      `}</style>

      {/* ══════ STICKY HEADER ══════ */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, boxShadow: "0 2px 12px rgba(0,0,0,0.15)", width: "100%" }}>

        {/* ── BANNER ── */}
        <div style={{
          position: "relative",
          width: "100%",
          display: "flex",
          alignItems: "center",
          height: 145,
          padding: "0 28px",
          background: "linear-gradient(120deg,#009e94,#00b0a5,#0891b2,#0e7490)",
          backgroundSize: "300% 300%",
          animation: "gradShift 10s ease infinite",
        }}>

          {/* Left — logo + text, padded away from rail */}
          <div style={{ display: "flex", alignItems: "center", gap: 20, width: "100%", paddingRight: 72 }}>
            <div style={{ width: 1, height: 40, background: "rgba(255,255,255,0.3)", flexShrink: 0 }} />
            <div>
              <p style={{
                margin: 0,
                color: "rgba(255,255,255,0.7)",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}>
                {today}
              </p>
              {/* ── Bigger, bolder welcome text ── */}
              <h1 style={{
                margin: "2px 0 0",
                color: "white",
                fontWeight: 900,
                fontSize: 32,
                lineHeight: 1.15,
                letterSpacing: "-0.5px",
              }}>
                Welcome back,{" "}
                <span style={{ color: "rgba(255,255,255,0.85)" }}>
                  {user?.name ?? "Admin"}
                </span>{" "}
                👋
              </h1>
            </div>
          </div>

          {/* ── Icon rail — absolute right, taller, clearly visible ── */}
          <div style={{
            position: "absolute", top: 0, right: 0, height: "100%",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            gap: 6, padding: "0 14px",
            background: "rgba(0,0,0,0.25)",
            borderLeft: "1px solid rgba(255,255,255,0.15)",
          }}>

            {/* Back to Website */}
            <button
              className="rail-btn"
              onClick={() => navigate("/")}
              title="Back to Website"
              style={railBtn}
            >
              <Home size={18} strokeWidth={2} />
            </button>

            {/* Dark / Light */}
            <button
              className="rail-btn"
              onClick={() => setDark(d => !d)}
              title={dark ? "Light mode" : "Dark mode"}
              style={{ ...railBtn, color: dark ? "#fcd34d" : "white" }}
            >
              {dark ? <Sun size={18} strokeWidth={2} /> : <Moon size={18} strokeWidth={2} />}
            </button>

            {user ? (
              <div className="group" style={{ position: "relative" }}>
                <button
                  className="rail-btn"
                  title={user.name}
                  style={railBtn}
                >
                  <User size={18} strokeWidth={2} />
                </button>

                {/* Dropdown — opens LEFT */}
                <div className="
                  absolute top-0 right-[calc(100%+10px)] w-52
                  bg-white border border-gray-100 rounded-2xl py-2
                  shadow-[0_20px_50px_rgba(0,0,0,0.18)]
                  opacity-0 invisible translate-x-2 scale-95
                  group-hover:opacity-100 group-hover:visible group-hover:translate-x-0 group-hover:scale-100
                  transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] z-50
                ">
                  {/* User info */}
                  <div style={{ padding: "12px 20px", borderBottom: "1px solid #f1f5f9" }}>
                    <p style={{ margin: 0, fontSize: 10, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      Signed in as
                    </p>
                    <p style={{ margin: "2px 0 0", fontSize: 14, fontWeight: 800, color: "#0f172a" }}>
                      {user.name}
                    </p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", paddingTop: 4 }}>
                    <Link
                      to="/admin/profile"
                      className="hover:bg-[#00b0a5]/10 hover:text-[#00b0a5] transition-colors"
                      style={{ padding: "10px 20px", fontSize: 14, fontWeight: 600, color: "#334155", borderRadius: 8, margin: "0 8px" }}
                    >
                      My Profile
                    </Link>
                    <div style={{ height: 1, background: "#f1f5f9", margin: "4px 12px" }} />
                    <button
                      onClick={handleLogout}
                      style={{
                        textAlign: "left", padding: "10px 20px",
                        fontSize: 14, fontWeight: 700,
                        display: "flex", alignItems: "center", gap: 8,
                        color: "#f87171", background: "#0f172a",
                        border: "none", cursor: "pointer",
                        borderRadius: "0 0 16px 16px",
                      }}
                      className="hover:bg-slate-800 transition-colors"
                    >
                      <LogIn size={15} style={{ transform: "rotate(180deg)" }} />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                className="rail-btn"
                onClick={() => navigate("/login")}
                title="Login"
                style={railBtn}
              >
                <LogIn size={18} strokeWidth={2} />
              </button>
            )}

          </div>
        </div>
        {/* ── End banner ── */}

        {/* ── TAB SUB-NAV ── */}
        <div style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          borderBottom: dark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #e2e8f0",
          background: dark ? "#0f172a" : "#ffffff",
          overflowX: "auto",
          fontSize: 14,            
        }}>
          {NAV_ITEMS.map(({ label, path, id, badge }) => (
            <NavLink
              key={id}
              to={path}
              className={({ isActive }) => tabClass(isActive, dark)}
            >
              {label}
              {badge > 0 && (
                <span
                  className={id === "messages" ? "bg-indigo-500" : "bg-amber-400"}
                  style={{
                    minWidth: 18, height: 16, padding: "0 5px",
                    fontSize: 9, fontWeight: 900, color: "white",
                    borderRadius: 9999,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    lineHeight: 1,
                    animation: "pulse-badge 2s infinite",
                  }}
                >
                  {badge}
                </span>
              )}
            </NavLink>
          ))}
        </div>

      </div>
      {/* ══════ END STICKY HEADER ══════ */}

      {/* Page content */}
      <main style={{ width: "100%" }}>
        <Outlet context={{ dark }} />
      </main>

    </div>
  );
}
