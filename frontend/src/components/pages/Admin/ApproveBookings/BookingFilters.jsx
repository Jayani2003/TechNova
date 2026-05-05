// components/pages/Admin/ApproveBookings/BookingFilters.jsx
import { Search, ChevronDown } from "lucide-react";
import { STATUS_CFG, STATUS_PILLS } from "./BookingConstants";

export default function BookingFilters({
  dark, search, onSearch,
  statusFilter, onStatus,
  typeFilter, onType,
  counts, total,
}) {
  const border = dark ? "rgba(255,255,255,0.08)" : "#e2e8f0";
  const cardBg = dark ? "rgba(255,255,255,0.04)" : "#ffffff";
  const tm     = dark ? "#f1f5f9" : "#0f172a";
  const ts     = dark ? "#64748b" : "#94a3b8";

  const dropdownStyle = {
    appearance: "none",
    background: cardBg,
    border: `1px solid ${border}`,
    borderRadius: 12,
    padding: "10px 36px 10px 14px",
    fontSize: 13, fontWeight: 600,
    color: tm, cursor: "pointer", outline: "none",
  };

  return (
    <>
      {/* Search + dropdowns */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        {/* Search */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 200, background: cardBg, border: `1px solid ${border}`, borderRadius: 12, padding: "10px 16px" }}>
          <Search size={15} color={ts} />
          <input
            value={search}
            onChange={e => onSearch(e.target.value)}
            placeholder="Search ID, name, location…"
            style={{ border: "none", outline: "none", background: "transparent", fontSize: 13, color: tm, width: "100%" }}
          />
        </div>

        {/* Tour type */}
        <div style={{ position: "relative" }}>
          <select value={typeFilter} onChange={e => onType(e.target.value)} style={dropdownStyle}>
            <option value="ALL">All Types</option>
            <option value="P2P">Point-to-Point</option>
            <option value="PACKAGE">Package Tour</option>
            <option value="CUSTOM">Customized</option>
          </select>
          <ChevronDown size={13} color={ts} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
        </div>

        {/* Status */}
        <div style={{ position: "relative" }}>
          <select value={statusFilter} onChange={e => onStatus(e.target.value)} style={dropdownStyle}>
            <option value="ALL">All Statuses ({total})</option>
            {Object.entries(STATUS_CFG).map(([k, v]) => (
              <option key={k} value={k}>{v.label} ({counts[k] || 0})</option>
            ))}
          </select>
          <ChevronDown size={13} color={ts} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
        </div>
      </div>

      {/* Status pills */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {STATUS_PILLS.map(s => {
          const cfg = STATUS_CFG[s];
          const isActive = statusFilter === s;
          const count = s === "ALL" ? total : (counts[s] || 0);
          return (
            <button key={s} onClick={() => onStatus(s)} style={{
              padding: "5px 14px", borderRadius: 20, border: "none", cursor: "pointer",
              fontSize: 12, fontWeight: 700, transition: "all .15s",
              background: isActive ? (cfg?.color ?? "#00b0a5") : (dark ? "rgba(255,255,255,0.06)" : "#f1f5f9"),
              color: isActive ? "white" : ts,
            }}>
              {s === "ALL" ? "All" : STATUS_CFG[s].label} · {count}
            </button>
          );
        })}
      </div>
    </>
  );
}
