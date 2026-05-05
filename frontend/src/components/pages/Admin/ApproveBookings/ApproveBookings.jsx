// components/pages/Admin/ApproveBookings/ApproveBookings.jsx
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useBookings } from "../../../../context/BookingsContext";
import {
  Search, Eye, X, ChevronDown,
  MapPin, Calendar, Users, Car, Phone,
  FileText, DollarSign, CheckCircle2,
  XCircle, Truck, Flag, Archive, Hash,
} from "lucide-react";

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_CFG = {
  PENDING:      { label: "Pending",      color: "#f59e0b", bg: "rgba(245,158,11,0.12)"  },
  QUOTED:       { label: "Quoted",       color: "#6366f1", bg: "rgba(99,102,241,0.12)"  },
  ACCEPTED:     { label: "Accepted",     color: "#10b981", bg: "rgba(16,185,129,0.12)"  },
  REJECTED:     { label: "Rejected",     color: "#ef4444", bg: "rgba(239,68,68,0.12)"   },
  CONFIRMED:    { label: "Confirmed",    color: "#00b0a5", bg: "rgba(0,176,165,0.12)"   },
  TOUR_STARTED: { label: "Tour Started", color: "#0891b2", bg: "rgba(8,145,178,0.12)"   },
  COMPLETED:    { label: "Completed",    color: "#64748b", bg: "rgba(100,116,139,0.12)" },
  CANCELLED:    { label: "Cancelled",    color: "#ef4444", bg: "rgba(239,68,68,0.12)"   },
  CLOSED:       { label: "Closed",       color: "#94a3b8", bg: "rgba(148,163,184,0.12)" },
};

const VEHICLE_LABELS = {
  mini_car: "Mini Car", normal_car: "Normal Car", sedan_car: "Sedan Car",
  mpv: "MPV", suv: "SUV", mini_van: "Mini Van", van: "Van", large_van: "Large Van",
};

function Chip({ status }) {
  const c = STATUS_CFG[status] ?? STATUS_CFG.PENDING;
  return (
    <span style={{ background: c.bg, color: c.color, padding: "3px 11px", borderRadius: 20, fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>
      {c.label}
    </span>
  );
}

// ── Detail Modal ──────────────────────────────────────────────────────────────
function Modal({ booking, dark, onClose, onSetQuote, onUpdateStatus }) {
  const [price, setPrice]       = useState(booking.quotedPrice ?? "");
  const [vName, setVName]       = useState(booking.assignedVehicle?.name ?? "");
  const [vPlate, setVPlate]     = useState(booking.assignedVehicle?.plateNumber ?? "");
  const [vType, setVType]       = useState(booking.assignedVehicle?.type ?? booking.categoryId ?? "");
  const [err, setErr]           = useState("");

  const bg     = dark ? "#0f172a" : "#f8fafc";
  const card   = dark ? "#1e293b" : "#ffffff";
  const border = dark ? "rgba(255,255,255,0.08)" : "#e2e8f0";
  const tm     = dark ? "#f1f5f9" : "#0f172a";
  const ts     = dark ? "#64748b" : "#94a3b8";

  const handleSendQuote = () => {
    const p = parseFloat(price);
    if (!price || isNaN(p) || p <= 0) { setErr("Enter a valid price"); return; }
    if (!vName.trim()) { setErr("Enter vehicle name"); return; }
    if (!vPlate.trim()) { setErr("Enter plate number"); return; }
    onSetQuote(booking.id, p, { name: vName.trim(), plateNumber: vPlate.trim(), type: vType.trim() });
    setErr("");
  };

  const Row = ({ icon: Icon, label, value }) => !value ? null : (
    <div style={{ display: "flex", gap: 12, padding: "9px 0", borderBottom: `1px solid ${border}` }}>
      {Icon && <Icon size={15} color="#00b0a5" style={{ flexShrink: 0, marginTop: 2 }} />}
      <div>
        <p style={{ margin: 0, fontSize: 10, color: ts, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em" }}>{label}</p>
        <p style={{ margin: "2px 0 0", fontSize: 13, color: tm, fontWeight: 500 }}>{value}</p>
      </div>
    </div>
  );

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={onClose}>
      <div style={{ background: bg, borderRadius: 24, width: "100%", maxWidth: 700, maxHeight: "92vh", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 40px 100px rgba(0,0,0,0.4)" }} onClick={e => e.stopPropagation()}>

        {/* Modal header */}
        <div style={{ padding: "18px 28px", background: "linear-gradient(120deg,#009e94,#0891b2)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.65)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em" }}>Booking</p>
            <h2 style={{ margin: "2px 0 0", color: "white", fontWeight: 900, fontSize: 20 }}>{booking.id}</h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Chip status={booking.status} />
            <button onClick={onClose} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 10, width: 34, height: 34, cursor: "pointer", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div style={{ overflowY: "auto", padding: "22px 28px", flex: 1 }}>

          {/* Trip */}
          <p style={{ margin: "0 0 6px", fontSize: 11, fontWeight: 800, color: "#00b0a5", textTransform: "uppercase", letterSpacing: ".08em" }}>Trip Details</p>
          <div style={{ background: card, borderRadius: 14, padding: "4px 16px", border: `1px solid ${border}`, marginBottom: 18 }}>
            <Row icon={MapPin}   label="Pickup"     value={booking.pickupLocation || booking.startLocation} />
            <Row icon={MapPin}   label="Drop-off"   value={booking.dropoffLocation || booking.endLocation} />
            <Row icon={Calendar} label="Start Date" value={booking.startDate} />
            <Row icon={Calendar} label="End Date"   value={booking.endDate} />
          </div>

          {/* Passengers */}
          <p style={{ margin: "0 0 6px", fontSize: 11, fontWeight: 800, color: "#00b0a5", textTransform: "uppercase", letterSpacing: ".08em" }}>Passengers & Vehicle</p>
          <div style={{ background: card, borderRadius: 14, padding: "4px 16px", border: `1px solid ${border}`, marginBottom: 18 }}>
            <Row icon={Users} label="Adults"           value={booking.noOfAdults} />
            <Row icon={Users} label="Children"         value={booking.noOfChildren > 0 ? `${booking.noOfChildren} (Ages: ${booking.agesOfChildren || "—"})` : null} />
            <Row icon={Car}   label="Requested Category" value={VEHICLE_LABELS[booking.categoryId] || booking.categoryId} />
            <Row icon={FileText} label="Luggage"       value={`${booking.smallLuggages || 0} small, ${booking.largeLuggages || 0} large`} />
            {booking.babySeatNeeded && <Row icon={Users} label="Baby Seat" value="Required" />}
          </div>

          {/* Customer */}
          <p style={{ margin: "0 0 6px", fontSize: 11, fontWeight: 800, color: "#00b0a5", textTransform: "uppercase", letterSpacing: ".08em" }}>Customer</p>
          <div style={{ background: card, borderRadius: 14, padding: "4px 16px", border: `1px solid ${border}`, marginBottom: 18 }}>
            <Row icon={Phone}    label="Name"  value={booking.customerName} />
            <Row icon={Phone}    label="Phone" value={booking.customerPhone} />
            <Row icon={FileText} label="Email" value={booking.customerEmail} />
            <Row icon={FileText} label="Notes" value={booking.notes} />
          </div>

          {/* Assigned vehicle (when already quoted/confirmed) */}
          {booking.assignedVehicle && (
            <>
              <p style={{ margin: "0 0 6px", fontSize: 11, fontWeight: 800, color: "#6366f1", textTransform: "uppercase", letterSpacing: ".08em" }}>Assigned Vehicle</p>
              <div style={{ background: dark ? "rgba(99,102,241,0.08)" : "rgba(99,102,241,0.05)", borderRadius: 14, padding: "4px 16px", border: "1px solid rgba(99,102,241,0.2)", marginBottom: 18 }}>
                <Row icon={Car}  label="Vehicle Name"  value={booking.assignedVehicle.name} />
                <Row icon={Hash} label="Plate Number"  value={booking.assignedVehicle.plateNumber} />
                <Row icon={Car}  label="Vehicle Type"  value={booking.assignedVehicle.type} />
              </div>
            </>
          )}

          {/* ── QUOTE SECTION (PENDING or QUOTED) ── */}
          {(booking.status === "PENDING" || booking.status === "QUOTED") && (
            <div style={{ background: dark ? "rgba(99,102,241,0.07)" : "rgba(99,102,241,0.04)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 16, padding: 20, marginBottom: 18 }}>
              <p style={{ margin: "0 0 14px", fontSize: 13, fontWeight: 800, color: "#6366f1" }}>
                💰 Set Price & Assign Vehicle
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                {/* Price */}
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: ts, textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 4 }}>Price (USD) *</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, background: card, border: `1px solid ${border}`, borderRadius: 10, padding: "9px 12px" }}>
                    <DollarSign size={14} color="#00b0a5" />
                    <input type="number" value={price} onChange={e => { setPrice(e.target.value); setErr(""); }} placeholder="0.00"
                      style={{ border: "none", outline: "none", background: "transparent", fontSize: 13, color: tm, width: "100%", fontWeight: 600 }} />
                  </div>
                </div>

                {/* Vehicle type */}
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: ts, textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 4 }}>Vehicle Type *</label>
                  <input value={vType} onChange={e => { setVType(e.target.value); setErr(""); }} placeholder="e.g. SUV, Van"
                    style={{ width: "100%", border: `1px solid ${border}`, borderRadius: 10, padding: "9px 12px", fontSize: 13, color: tm, background: card, outline: "none", fontWeight: 500 }} />
                </div>

                {/* Vehicle name */}
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: ts, textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 4 }}>Vehicle Name *</label>
                  <input value={vName} onChange={e => { setVName(e.target.value); setErr(""); }} placeholder="e.g. Toyota Hiace"
                    style={{ width: "100%", border: `1px solid ${border}`, borderRadius: 10, padding: "9px 12px", fontSize: 13, color: tm, background: card, outline: "none", fontWeight: 500 }} />
                </div>

                {/* Plate number */}
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: ts, textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 4 }}>Plate Number *</label>
                  <input value={vPlate} onChange={e => { setVPlate(e.target.value); setErr(""); }} placeholder="e.g. CAB-1234"
                    style={{ width: "100%", border: `1px solid ${border}`, borderRadius: 10, padding: "9px 12px", fontSize: 13, color: tm, background: card, outline: "none", fontWeight: 500, textTransform: "uppercase" }} />
                </div>
              </div>

              {err && <p style={{ margin: "0 0 10px", fontSize: 12, color: "#ef4444", fontWeight: 600 }}>{err}</p>}

              <button onClick={handleSendQuote} style={{ width: "100%", background: "#6366f1", color: "white", border: "none", borderRadius: 12, padding: "11px", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                📨 Send Quote to Customer
              </button>

              {booking.quotedPrice && (
                <p style={{ margin: "8px 0 0", fontSize: 12, color: ts, textAlign: "center" }}>
                  Last quote: <strong style={{ color: "#6366f1" }}>${booking.quotedPrice}</strong>
                  {booking.assignedVehicle && ` · ${booking.assignedVehicle.name} (${booking.assignedVehicle.plateNumber})`}
                </p>
              )}
            </div>
          )}

          {/* ── ACCEPTED — admin confirms ── */}
          {booking.status === "ACCEPTED" && (
            <div style={{ background: dark ? "rgba(16,185,129,0.07)" : "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 16, padding: 20, marginBottom: 18 }}>
              <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 800, color: "#10b981" }}>
                ✅ Customer accepted — ${booking.quotedPrice}
              </p>
              <p style={{ margin: "0 0 14px", fontSize: 12, color: ts }}>
                Confirm to lock the booking. Vehicle {booking.assignedVehicle?.name} ({booking.assignedVehicle?.plateNumber}) will be assigned.
              </p>
              <button onClick={() => onUpdateStatus(booking.id, "CONFIRMED")} style={{ background: "#10b981", color: "white", border: "none", borderRadius: 12, padding: "10px 28px", fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                <CheckCircle2 size={15} /> Confirm Booking
              </button>
            </div>
          )}

          {/* ── Action buttons ── */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {booking.status === "CONFIRMED" && (
              <button onClick={() => onUpdateStatus(booking.id, "TOUR_STARTED")} style={{ background: "#0891b2", color: "white", border: "none", borderRadius: 12, padding: "10px 20px", fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                <Truck size={14} /> Mark Tour Started
              </button>
            )}
            {booking.status === "TOUR_STARTED" && (
              <button onClick={() => onUpdateStatus(booking.id, "COMPLETED")} style={{ background: "#64748b", color: "white", border: "none", borderRadius: 12, padding: "10px 20px", fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                <Flag size={14} /> Mark Completed
              </button>
            )}
            {booking.status === "COMPLETED" && (
              <button onClick={() => onUpdateStatus(booking.id, "CLOSED")} style={{ background: "rgba(148,163,184,0.15)", color: "#64748b", border: "1px solid rgba(148,163,184,0.3)", borderRadius: 12, padding: "10px 20px", fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                <Archive size={14} /> Archive (Close)
              </button>
            )}
            {/* CANCEL — available from ACCEPTED or CONFIRMED (admin side) */}
            {["ACCEPTED", "CONFIRMED"].includes(booking.status) && (
              <button onClick={() => onUpdateStatus(booking.id, "CANCELLED")} style={{ background: "rgba(239,68,68,0.08)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 12, padding: "10px 20px", fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                <XCircle size={14} /> Cancel Booking
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function ApproveBookings() {
  const context = useOutletContext();
  const dark = context?.dark ?? false;

  const { getAllBookings, setQuotedPrice, updateBookingStatus } = useBookings();
  const bookings = getAllBookings();

  const [search, setSearch]       = useState("");
  const [statusFilter, setStatus] = useState("ALL");
  const [selected, setSelected]   = useState(null);

  const border  = dark ? "rgba(255,255,255,0.08)" : "#e2e8f0";
  const cardBg  = dark ? "rgba(255,255,255,0.04)" : "#ffffff";
  const tm      = dark ? "#f1f5f9" : "#0f172a";
  const ts      = dark ? "#64748b" : "#94a3b8";

  const filtered = bookings.filter(b => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      b.id?.toLowerCase().includes(q) ||
      b.customerName?.toLowerCase().includes(q) ||
      (b.pickupLocation || b.startLocation || "").toLowerCase().includes(q) ||
      (b.dropoffLocation || b.endLocation || "").toLowerCase().includes(q);
    return matchSearch && (statusFilter === "ALL" || b.status === statusFilter);
  });

  const counts = Object.keys(STATUS_CFG).reduce((acc, s) => {
    acc[s] = bookings.filter(b => b.status === s).length;
    return acc;
  }, {});

  const handleSetQuote = (id, price, vehicleInfo) => {
    setQuotedPrice(id, price, vehicleInfo);
    // re-open with updated data
    const updated = getAllBookings().find(b => b.id === id);
    if (updated) setSelected({ ...updated, status: "QUOTED", quotedPrice: price, assignedVehicle: vehicleInfo });
  };

  const handleUpdateStatus = (id, status) => {
    updateBookingStatus(id, status);
    const updated = getAllBookings().find(b => b.id === id);
    if (updated) setSelected({ ...updated, status });
    else setSelected(null);
  };

  const FILTER_PILLS = ["ALL", "PENDING", "QUOTED", "ACCEPTED", "CONFIRMED", "TOUR_STARTED", "COMPLETED", "CANCELLED"];

  return (
    <div style={{ maxWidth: 1320, margin: "0 auto", padding: "32px 24px" }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: tm, letterSpacing: "-.4px" }}>Manage Bookings</h1>
        <p style={{ margin: "4px 0 0", fontSize: 14, color: ts }}>
          {bookings.length} total · {counts.PENDING || 0} pending · {counts.ACCEPTED || 0} awaiting confirmation
        </p>
      </div>

      {/* Search + dropdown filter */}
      <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 220, background: cardBg, border: `1px solid ${border}`, borderRadius: 12, padding: "10px 16px" }}>
          <Search size={15} color={ts} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search ID, name, location…"
            style={{ border: "none", outline: "none", background: "transparent", fontSize: 13, color: tm, width: "100%" }} />
        </div>
        <div style={{ position: "relative" }}>
          <select value={statusFilter} onChange={e => setStatus(e.target.value)}
            style={{ appearance: "none", background: cardBg, border: `1px solid ${border}`, borderRadius: 12, padding: "10px 38px 10px 16px", fontSize: 13, fontWeight: 600, color: tm, cursor: "pointer", outline: "none" }}>
            <option value="ALL">All ({bookings.length})</option>
            {Object.entries(STATUS_CFG).map(([k, v]) => (
              <option key={k} value={k}>{v.label} ({counts[k] || 0})</option>
            ))}
          </select>
          <ChevronDown size={13} color={ts} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
        </div>
      </div>

      {/* Status pill filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {FILTER_PILLS.map(s => {
          const cfg = STATUS_CFG[s];
          const isActive = statusFilter === s;
          const count = s === "ALL" ? bookings.length : (counts[s] || 0);
          return (
            <button key={s} onClick={() => setStatus(s)} style={{
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

      {/* Table */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 0", color: ts }}>
          <p style={{ fontSize: 44, margin: "0 0 10px" }}>📭</p>
          <p style={{ fontSize: 16, fontWeight: 700, color: tm, margin: "0 0 4px" }}>No bookings found</p>
          <p style={{ fontSize: 13, margin: 0 }}>Try a different filter or search term</p>
        </div>
      ) : (
        <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 20, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: dark ? "rgba(255,255,255,0.03)" : "#f8fafc" }}>
                  {["ID", "Customer", "Route", "Dates", "Category", "Vehicle", "Quoted", "Status", ""].map(h => (
                    <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".07em", color: ts, borderBottom: `1px solid ${border}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((b, i) => (
                  <tr key={b.id}
                    style={{ borderBottom: i < filtered.length - 1 ? `1px solid ${border}` : "none", cursor: "pointer", transition: "background .1s" }}
                    onMouseEnter={e => e.currentTarget.style.background = dark ? "rgba(255,255,255,0.03)" : "#f8fafc"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ padding: "13px 16px", fontSize: 12, fontFamily: "monospace", fontWeight: 700, color: "#00b0a5" }}>{b.id}</td>
                    <td style={{ padding: "13px 16px" }}>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: tm }}>{b.customerName || "—"}</p>
                      <p style={{ margin: "1px 0 0", fontSize: 11, color: ts }}>{b.customerPhone || b.customerEmail || ""}</p>
                    </td>
                    <td style={{ padding: "13px 16px", maxWidth: 180 }}>
                      <p style={{ margin: 0, fontSize: 12, color: tm }}>
                        <span style={{ color: "#00b0a5", fontWeight: 700 }}>↑</span> {b.pickupLocation || b.startLocation || "—"}
                      </p>
                      <p style={{ margin: "2px 0 0", fontSize: 12, color: ts }}>
                        <span style={{ color: "#f59e0b", fontWeight: 700 }}>↓</span> {b.dropoffLocation || b.endLocation || "—"}
                      </p>
                    </td>
                    <td style={{ padding: "13px 16px" }}>
                      <p style={{ margin: 0, fontSize: 12, color: tm }}>{b.startDate || "—"}</p>
                      <p style={{ margin: "1px 0 0", fontSize: 11, color: ts }}>{b.endDate || ""}</p>
                    </td>
                    <td style={{ padding: "13px 16px", fontSize: 12, color: ts, textTransform: "capitalize" }}>
                      {VEHICLE_LABELS[b.categoryId] || b.categoryId || "—"}
                    </td>
                    <td style={{ padding: "13px 16px" }}>
                      {b.assignedVehicle ? (
                        <div>
                          <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "#6366f1" }}>{b.assignedVehicle.name}</p>
                          <p style={{ margin: "1px 0 0", fontSize: 10, color: ts, fontFamily: "monospace" }}>{b.assignedVehicle.plateNumber}</p>
                        </div>
                      ) : <span style={{ fontSize: 12, color: ts }}>—</span>}
                    </td>
                    <td style={{ padding: "13px 16px", fontSize: 13, fontWeight: 700, fontFamily: "monospace", color: b.quotedPrice ? "#6366f1" : ts }}>
                      {b.quotedPrice ? `$${b.quotedPrice}` : "—"}
                    </td>
                    <td style={{ padding: "13px 16px" }}><Chip status={b.status} /></td>
                    <td style={{ padding: "13px 16px" }}>
                      <button onClick={() => setSelected(b)} style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(0,176,165,0.1)", color: "#00b0a5", border: "1px solid rgba(0,176,165,0.2)", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                        <Eye size={12} /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {selected && (
        <Modal
          booking={selected}
          dark={dark}
          onClose={() => setSelected(null)}
          onSetQuote={handleSetQuote}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
}
