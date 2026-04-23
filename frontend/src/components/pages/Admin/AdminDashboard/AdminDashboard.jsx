// components/pages/Admin/AdminDashboard/AdminDashboard.jsx
import { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { CalendarCheck, Clock, CheckCircle2, MessageSquare } from "lucide-react";

const STATS = [
  { label: "Total Bookings",  value: 248, delta: "+12 this week", color: "#00b0a5", icon: CalendarCheck },
  { label: "Pending",         value: 34,  delta: "Needs review",  color: "#f59e0b", icon: Clock         },
  { label: "Confirmed",       value: 189, delta: "76.2% rate",    color: "#10b981", icon: CheckCircle2  },
  { label: "Unread Messages", value: 8,   delta: "3 urgent",      color: "#6366f1", icon: MessageSquare },
];

const BOOKINGS = [
  { id: "BK-001", guest: "Arjun Perera",   tour: "Sigiriya Rock Safari",     date: "Apr 24, 2026", amount: "$340", status: "confirmed" },
  { id: "BK-002", guest: "Sophie Martin",  tour: "Whale Watching Mirissa",   date: "Apr 25, 2026", amount: "$210", status: "pending"   },
  { id: "BK-003", guest: "Yuki Tanaka",    tour: "Ella Train & Tea Estate",  date: "Apr 26, 2026", amount: "$155", status: "confirmed" },
  { id: "BK-004", guest: "Carlos Romero",  tour: "Kandy Cultural Triangle",  date: "Apr 27, 2026", amount: "$280", status: "pending"   },
  { id: "BK-005", guest: "Aisha Rahman",   tour: "Yala Safari Adventure",    date: "Apr 28, 2026", amount: "$420", status: "cancelled" },
  { id: "BK-006", guest: "James O'Brien",  tour: "Galle Fort Heritage Walk", date: "Apr 29, 2026", amount: "$95",  status: "confirmed" },
];

const STATUS_BARS = [
  { label: "Confirmed", pct: 76, color: "#10b981" },
  { label: "Pending",   pct: 14, color: "#f59e0b" },
  { label: "Cancelled", pct: 6,  color: "#ef4444" },
  { label: "Completed", pct: 4,  color: "#00b0a5" },
];

function StatCard({ label, value, delta, color, icon: Icon, dark, index }) {
  const [visible, setVisible] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), index * 80);
    return () => clearTimeout(t);
  }, [index]);

  useEffect(() => {
    if (!visible) return;
    let n = 0;
    const step = Math.ceil(value / 40);
    const iv = setInterval(() => {
      n += step;
      if (n >= value) { setCount(value); clearInterval(iv); }
      else setCount(n);
    }, 18);
    return () => clearInterval(iv);
  }, [visible, value]);

  return (
    <div
      className={[
        "relative rounded-2xl border p-6 overflow-hidden cursor-default",
        "transition-all duration-300 hover:-translate-y-1",
        dark
          ? "bg-slate-800/60 border-white/8 hover:shadow-[0_12px_32px_rgba(0,0,0,.4)]"
          : "bg-white border-slate-100 shadow-sm hover:shadow-[0_12px_32px_rgba(0,176,165,.1)]",
      ].join(" ")}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(14px)",
        transition: "opacity .4s ease, transform .4s ease",
      }}
    >
      <div className="absolute -top-5 -right-5 w-20 h-20 rounded-full opacity-10" style={{ background: color }} />
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-[11px] font-semibold uppercase tracking-widest mb-2 ${dark ? "text-slate-500" : "text-slate-400"}`}>
            {label}
          </p>
          <p className="text-4xl font-extrabold leading-none mb-1 tabular-nums" style={{ color: dark ? "#f1f5f9" : "#0f172a" }}>
            {count}
          </p>
          <p className={`text-[12px] ${dark ? "text-slate-600" : "text-slate-400"}`}>{delta}</p>
        </div>
        <div className="rounded-xl p-2.5" style={{ background: `${color}18`, color }}>
          <Icon size={22} strokeWidth={1.8} />
        </div>
      </div>
    </div>
  );
}

function ProgressBar({ label, pct, color, dark, delay }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 500 + delay);
    return () => clearTimeout(t);
  }, [pct, delay]);

  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1.5">
        <span className={`text-[13px] font-medium ${dark ? "text-slate-400" : "text-slate-600"}`}>{label}</span>
        <span className="text-[13px] font-extrabold" style={{ color }}>{pct}%</span>
      </div>
      <div className={`h-2 rounded-full overflow-hidden ${dark ? "bg-white/8" : "bg-slate-100"}`}>
        <div
          className="h-full rounded-full"
          style={{ width: `${width}%`, background: color, boxShadow: `0 0 8px ${color}55`, transition: "width 1.1s cubic-bezier(.4,0,.2,1)" }}
        />
      </div>
    </div>
  );
}

function StatusChip({ status }) {
  const map = {
    confirmed: "bg-emerald-500/10 text-emerald-600",
    pending:   "bg-amber-400/10 text-amber-600",
    cancelled: "bg-red-500/10 text-red-500",
  };
  return (
    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${map[status] ?? map.pending}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default function AdminDashboard() {
  const context = useOutletContext();
  const dark = context?.dark ?? false;
  const navigate = useNavigate();

  return (
    <div className="max-w-[1320px] mx-auto px-6 py-8">

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS.map((s, i) => (
          <StatCard key={s.label} {...s} dark={dark} index={i} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5">

        {/* Bookings table */}
        <div className={`rounded-2xl border overflow-hidden ${dark ? "bg-slate-800/60 border-white/8" : "bg-white border-slate-100 shadow-sm"}`}>
          <div className={`flex items-center justify-between px-6 py-4 border-b ${dark ? "border-white/8" : "border-slate-100"}`}>
            <div>
              <h2 className={`font-extrabold text-[15px] ${dark ? "text-slate-100" : "text-slate-800"}`}>Recent Bookings</h2>
              <p className={`text-[12px] mt-0.5 ${dark ? "text-slate-500" : "text-slate-400"}`}>Latest 6 reservations</p>
            </div>
            <button
              onClick={() => navigate("/admin/approve-bookings")}
              className={`px-4 py-1.5 rounded-lg border text-[12px] font-bold text-[#00b0a5] transition-all duration-200 ${dark ? "border-white/10 hover:bg-white/5" : "border-slate-200 hover:bg-[#00b0a5]/5"}`}
            >
              View All →
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className={dark ? "bg-white/3" : "bg-slate-50"}>
                  {["ID", "Guest", "Tour", "Date", "Amount", "Status"].map(h => (
                    <th key={h} className={`px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider border-b ${dark ? "text-slate-500 border-white/8" : "text-slate-400 border-slate-100"}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {BOOKINGS.map((b, i) => (
                  <tr
                    key={b.id}
                    className={[
                      "transition-colors duration-100",
                      i < BOOKINGS.length - 1 ? (dark ? "border-b border-white/5" : "border-b border-slate-50") : "",
                      dark ? "hover:bg-white/3" : "hover:bg-slate-50/80",
                    ].join(" ")}
                  >
                    <td className="px-5 py-3.5 text-[12px] font-mono font-medium text-[#00b0a5]">{b.id}</td>
                    <td className={`px-5 py-3.5 text-[13px] font-semibold ${dark ? "text-slate-200" : "text-slate-800"}`}>{b.guest}</td>
                    <td className={`px-5 py-3.5 text-[13px] max-w-[180px] truncate ${dark ? "text-slate-400" : "text-slate-500"}`}>{b.tour}</td>
                    <td className={`px-5 py-3.5 text-[12px] whitespace-nowrap ${dark ? "text-slate-400" : "text-slate-500"}`}>{b.date}</td>
                    <td className={`px-5 py-3.5 text-[13px] font-bold font-mono ${dark ? "text-slate-200" : "text-slate-800"}`}>{b.amount}</td>
                    <td className="px-5 py-3.5"><StatusChip status={b.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Status breakdown */}
        <div className={`rounded-2xl border p-6 ${dark ? "bg-slate-800/60 border-white/8" : "bg-white border-slate-100 shadow-sm"}`}>
          <h2 className={`font-extrabold text-[15px] mb-0.5 ${dark ? "text-slate-100" : "text-slate-800"}`}>Booking Status</h2>
          <p className={`text-[12px] mb-6 ${dark ? "text-slate-500" : "text-slate-400"}`}>Current distribution</p>
          {STATUS_BARS.map((s, i) => (
            <ProgressBar key={s.label} label={s.label} pct={s.pct} color={s.color} dark={dark} delay={i * 150} />
          ))}
          <div className={`mt-5 p-4 rounded-xl border ${dark ? "bg-[#00b0a5]/8 border-[#00b0a5]/20" : "bg-[#00b0a5]/5 border-[#00b0a5]/15"}`}>
            <p className="text-[#00b0a5] text-[11px] font-extrabold uppercase tracking-wider mb-3">Quick Actions</p>
            {["Review Pending (34)", "Export Report", "Send Reminders"].map(action => (
              <button
                key={action}
                className={[
                  "w-full text-left px-3 py-2 rounded-lg border text-[13px] font-medium mb-2 last:mb-0 transition-all duration-150",
                  dark ? "border-white/8 text-slate-300 hover:border-[#00b0a5] hover:text-[#00b0a5]"
                       : "border-slate-200 text-slate-600 hover:border-[#00b0a5] hover:text-[#00b0a5]",
                ].join(" ")}
              >
                {action}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
