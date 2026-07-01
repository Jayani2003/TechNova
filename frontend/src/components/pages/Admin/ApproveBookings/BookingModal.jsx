// components/pages/Admin/ApproveBookings/BookingModal.jsx
import { useState } from "react";
import {
  X, MapPin, Calendar, Users, Car, Phone, FileText, Clock,
  Banknote, CheckCircle2, XCircle, Truck, Flag,
  Archive, Hash, Package, Compass, AlertTriangle, Briefcase,
} from "lucide-react";
import { StatusChip, TourTypeChip } from "./BookingChips";
import { VEHICLE_LABELS, TOUR_TYPE_CFG, formatPhone } from "./BookingConstants";

export default function BookingModal({ booking, dark, onClose, onSetQuote, onUpdateStatus }) {
  const [price,  setPrice]  = useState(booking.quotedPrice ?? "");
  const [vName,  setVName]  = useState(booking.assignedVehicle?.name ?? "");
  const [vPlate, setVPlate] = useState(booking.assignedVehicle?.plateNumber ?? "");
  const [vType,  setVType]  = useState(booking.assignedVehicle?.type ?? (booking.categoryName || VEHICLE_LABELS[booking.categoryId] || ""));
  const [err,    setErr]    = useState("");

  const bg     = dark ? "#0f172a" : "#f8fafc";
  const card   = dark ? "#1e293b" : "#ffffff";
  const border = dark ? "rgba(255,255,255,0.08)" : "#e2e8f0";
  const tm     = dark ? "#f1f5f9" : "#0f172a";
  const ts     = dark ? "#64748b" : "#94a3b8";

  const tourCfg = TOUR_TYPE_CFG[booking.tourType] || {};

  const handleSendQuote = () => {
    const p = parseFloat(price);
    if (!price || isNaN(p) || p <= 0) { setErr("Enter a valid price"); return; }
    if (!vName.trim())  { setErr("Enter vehicle name"); return; }
    if (!vPlate.trim()) { setErr("Enter plate number"); return; }
    onSetQuote(booking.id, p, { name: vName.trim(), plateNumber: vPlate.trim(), type: vType.trim() });
    setErr("");
  };

  // Shared detail row
  const Row = ({ icon: Icon, label, value }) => !value ? null : (
    <div style={{ display: "flex", gap: 12, padding: "9px 0", borderBottom: `1px solid ${border}` }}>
      {Icon && <Icon size={15} color="#00b0a5" style={{ flexShrink: 0, marginTop: 2 }} />}
      <div>
        <p style={{ margin: 0, fontSize: 10, color: ts, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em" }}>{label}</p>
        <p style={{ margin: "2px 0 0", fontSize: 13, color: tm, fontWeight: 500 }}>{value}</p>
      </div>
    </div>
  );

  const SectionTitle = ({ children, color = "#00b0a5" }) => (
    <p style={{ margin: "0 0 6px", fontSize: 11, fontWeight: 800, color, textTransform: "uppercase", letterSpacing: ".08em" }}>
      {children}
    </p>
  );

  const inputStyle = {
    width: "100%", boxSizing: "border-box",
    border: `1px solid ${border}`, borderRadius: 10,
    padding: "9px 12px", fontSize: 13,
    color: tm, background: card, outline: "none",
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
      onClick={onClose}
    >
      <div
        style={{ background: bg, borderRadius: 24, width: "100%", maxWidth: 680, maxHeight: "92vh", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 40px 100px rgba(0,0,0,0.4)" }}
        onClick={e => e.stopPropagation()}
      >

        {/* ── Header ── */}
        <div style={{ padding: "18px 24px", background: "linear-gradient(120deg,#009e94,#0891b2)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.65)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em" }}>Booking</p>
            <h2 style={{ margin: "2px 0 6px", color: "white", fontWeight: 900, fontSize: 20 }}>{booking.id}</h2>
            <TourTypeChip tourType={booking.tourType} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <StatusChip status={booking.status} />
            <button
              onClick={onClose}
              style={{ background: "white", border: "none", borderRadius: 10, width: 36, height: 36, cursor: "pointer", color: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.15)", flexShrink: 0 }}
            >
              <X size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* ── Scrollable body ── */}
        <div style={{ overflowY: "auto", padding: "20px 24px", flex: 1 }}>

          {/* Tour type banner */}
          {tourCfg.label && (
            <div style={{ background: tourCfg.bg || "rgba(0,176,165,0.08)", border: `1px solid ${tourCfg.color || "#00b0a5"}40`, borderRadius: 12, padding: "10px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
              <div>
                <p style={{ margin: 0, fontSize: 11, color: ts, fontWeight: 600 }}>Booking Type</p>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: tourCfg.color }}>{tourCfg.label}</p>
              </div>
            </div>
          )}

          {/* Trip details */}
          <SectionTitle>Trip Details</SectionTitle>
          <div style={{ background: card, borderRadius: 14, padding: "4px 16px", border: `1px solid ${border}`, marginBottom: 16 }}>
            {booking.tourType === "P2P" && (
              <>
                <Row icon={MapPin} label="Pickup Location"   value={booking.pickupLocation || booking.startLocation} />
                <Row icon={MapPin} label="Drop-off Location" value={booking.dropoffLocation || booking.endLocation} />
              </>
            )}
            {booking.tourType === "PACKAGE" && (
              <Row icon={Package} label="Package" value={booking.packageName || booking.tourPackage || "Package Tour"} />
            )}
            {booking.tourType === "CUSTOM" && (
              <Row icon={Compass} label="Destination / Details" value={booking.destination || booking.customDestination || booking.notes || "See notes"} />
            )}
            <Row icon={Calendar} label="Start Date" value={booking.startDate} />
            <Row icon={Calendar} label="End Date"   value={booking.endDate} />
            <Row icon={Clock}    label="Pickup Time" value={booking.pickupTime || null} />
            <Row icon={Calendar} label="Total Days" value={booking.totalDays ? `${booking.totalDays} day(s)` : null} />
          </div>

          {/* Passengers */}
          <SectionTitle>Passengers & Vehicle</SectionTitle>
          <div style={{ background: card, borderRadius: 14, padding: "4px 16px", border: `1px solid ${border}`, marginBottom: 16 }}>
            <Row icon={Users}    label="Adults"   value={booking.noOfAdults} />
            {booking.noOfChildren > 0 && <Row icon={Users} label="Children" value={`${booking.noOfChildren} (Ages: ${booking.agesOfChildren || "—"})`} />}
            {booking.babySeatNeeded && <Row icon={Users} label="Baby Seat" value="Required" />}
            <Row icon={Car} label="Requested Category" value={booking.categoryName || VEHICLE_LABELS[booking.categoryId] || booking.categoryId} />
            {(booking.luggage10kg > 0 || booking.luggage25kg > 0 || booking.luggage35kg > 0 || booking.luggageCustomCount > 0) ? (
              <>
                {booking.luggage10kg  > 0 && <Row icon={Briefcase} label="10 kg Bags"    value={`${booking.luggage10kg} piece(s)`} />}
                {booking.luggage25kg  > 0 && <Row icon={Briefcase} label="25 kg Bags"    value={`${booking.luggage25kg} piece(s)`} />}
                {booking.luggage35kg  > 0 && <Row icon={Briefcase} label="35 kg Bags"    value={`${booking.luggage35kg} piece(s)`} />}
                {booking.luggageCustomCount > 0 && (
                  <Row icon={Briefcase} label="Custom Luggage"
                    value={booking.luggageCustomDesc || `${booking.luggageCustomCount} item(s)`} />
                )}
              </>
            ) : (
              <Row icon={Briefcase} label="Luggage" value="No luggage specified" />
            )}
          </div>

          {/* Customer */}
          <SectionTitle>Customer</SectionTitle>
          <div style={{ background: card, borderRadius: 14, padding: "4px 16px", border: `1px solid ${border}`, marginBottom: 16 }}>
            <Row icon={Phone}    label="Full Name" value={booking.customerName} />
            <Row icon={Phone}    label="Phone"     value={formatPhone(booking.customerPhone)} />
            <Row icon={FileText} label="Email"     value={booking.customerEmail} />
            {booking.notes        && <Row icon={FileText} label="Notes"         value={booking.notes} />}
            {booking.tourThoughts && <Row icon={FileText} label="Tour Thoughts" value={booking.tourThoughts} />}
          </div>

          {/* Emergency Contact */}
          {(booking.emergencyName || booking.emergencyPhone) && (
            <>
              <SectionTitle color="#f59e0b">Emergency Contact</SectionTitle>
              <div style={{ background: card, borderRadius: 14, padding: "4px 16px", border: `1px solid ${border}`, marginBottom: 16 }}>
                <Row icon={AlertTriangle} label="Name"         value={booking.emergencyName} />
                <Row icon={AlertTriangle} label="Relationship" value={booking.emergencyRelationship} />
                <Row icon={Phone}         label="Phone"        value={formatPhone(booking.emergencyPhone)} />
              </div>
            </>
          )}

          {/* Already assigned vehicle */}
          {booking.assignedVehicle && (
            <>
              <SectionTitle color="#6366f1">Assigned Vehicle</SectionTitle>
              <div style={{ background: dark ? "rgba(99,102,241,0.08)" : "rgba(99,102,241,0.05)", borderRadius: 14, padding: "4px 16px", border: "1px solid rgba(99,102,241,0.2)", marginBottom: 16 }}>
                <Row icon={Car}  label="Vehicle Name"  value={booking.assignedVehicle.name} />
                <Row icon={Hash} label="Plate Number"  value={booking.assignedVehicle.plateNumber} />
                <Row icon={Car}  label="Vehicle Type"  value={booking.assignedVehicle.type} />
              </div>
            </>
          )}

          {/* ── Quote + vehicle assignment (PENDING or QUOTED) ── */}
          {(booking.status === "PENDING" || booking.status === "QUOTED") && (
            <div style={{ background: dark ? "rgba(99,102,241,0.07)" : "rgba(99,102,241,0.04)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 16, padding: 20, marginBottom: 16 }}>
              <p style={{ margin: "0 0 14px", fontSize: 13, fontWeight: 800, color: "#6366f1" }}>💰 Set Price & Assign Vehicle</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: ts, textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 4 }}>Price (LKR) *</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, background: card, border: `1px solid ${border}`, borderRadius: 10, padding: "9px 12px" }}>
                    <Banknote size={14} color="#00b0a5" />
                    <input type="number" value={price} onChange={e => { setPrice(e.target.value); setErr(""); }} placeholder="0.00"
                      style={{ border: "none", outline: "none", background: "transparent", fontSize: 13, color: tm, width: "100%", fontWeight: 600 }} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: ts, textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 4 }}>Vehicle Type *</label>
                  <input value={vType} onChange={e => { setVType(e.target.value); setErr(""); }} placeholder="e.g. SUV, Van" style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: ts, textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 4 }}>Vehicle Name *</label>
                  <input value={vName} onChange={e => { setVName(e.target.value); setErr(""); }} placeholder="e.g. Toyota Hiace" style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: ts, textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 4 }}>Plate Number *</label>
                  <input value={vPlate} onChange={e => { setVPlate(e.target.value); setErr(""); }} placeholder="e.g. CAB-1234" style={{ ...inputStyle, textTransform: "uppercase" }} />
                </div>
              </div>
              {err && <p style={{ margin: "0 0 10px", fontSize: 12, color: "#ef4444", fontWeight: 600 }}>{err}</p>}
              <button onClick={handleSendQuote} style={{ width: "100%", background: "#6366f1", color: "white", border: "none", borderRadius: 12, padding: 12, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                📨 Send Quote to Customer
              </button>
              {booking.quotedPrice && (
                <p style={{ margin: "8px 0 0", fontSize: 12, color: ts, textAlign: "center" }}>
                  Current quote: <strong style={{ color: "#6366f1" }}>${booking.quotedPrice}</strong>
                  {booking.assignedVehicle && ` · ${booking.assignedVehicle.name} (${booking.assignedVehicle.plateNumber})`}
                </p>
              )}
            </div>
          )}

          {/* ACCEPTED → confirm */}
          {booking.status === "ACCEPTED" && (
            <div style={{ background: dark ? "rgba(16,185,129,0.07)" : "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 16, padding: 20, marginBottom: 16 }}>
              <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 800, color: "#10b981" }}>
                ✅ Customer accepted — ${booking.quotedPrice}
              </p>
              <p style={{ margin: "0 0 14px", fontSize: 12, color: ts }}>
                Confirm to lock this booking.{booking.assignedVehicle ? ` Vehicle: ${booking.assignedVehicle.name} (${booking.assignedVehicle.plateNumber})` : ""}
              </p>
              <button onClick={() => onUpdateStatus(booking.id, "CONFIRMED")}
                style={{ background: "#10b981", color: "white", border: "none", borderRadius: 12, padding: "10px 28px", fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                <CheckCircle2 size={15} /> Confirm Booking
              </button>
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {booking.status === "CONFIRMED" && (
              <button onClick={() => onUpdateStatus(booking.id, "TOUR_STARTED")}
                style={{ background: "#0891b2", color: "white", border: "none", borderRadius: 12, padding: "10px 20px", fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                <Truck size={14} /> Mark Tour Started
              </button>
            )}
            {booking.status === "TOUR_STARTED" && (
              <button onClick={() => onUpdateStatus(booking.id, "COMPLETED")}
                style={{ background: "#64748b", color: "white", border: "none", borderRadius: 12, padding: "10px 20px", fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                <Flag size={14} /> Mark Completed
              </button>
            )}
            {booking.status === "COMPLETED" && (
              <button onClick={() => onUpdateStatus(booking.id, "CLOSED")}
                style={{ background: "rgba(148,163,184,0.15)", color: "#64748b", border: "1px solid rgba(148,163,184,0.3)", borderRadius: 12, padding: "10px 20px", fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                <Archive size={14} /> Archive (Close)
              </button>
            )}
            {["ACCEPTED", "CONFIRMED"].includes(booking.status) && (
              <button onClick={() => onUpdateStatus(booking.id, "CANCELLED")}
                style={{ background: "rgba(239,68,68,0.08)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 12, padding: "10px 20px", fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                <XCircle size={14} /> Cancel Booking
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
