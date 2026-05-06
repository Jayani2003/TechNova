// components/pages/Admin/ApproveBookings/BookingTable.jsx
import { Eye } from "lucide-react";
import { StatusChip, TourTypeChip } from "./BookingChips";
import { VEHICLE_LABELS, formatPhone, getRoute } from "./BookingConstants";

// Column header component
function ColHeader({ label, style = {} }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 800,
      textTransform: "uppercase", letterSpacing: ".07em",
      ...style,
    }}>
      {label}
    </div>
  );
}

// Route cell — adapts to tour type
function RouteCell({ booking, tm, ts }) {
  const route = getRoute(booking);
  if (route.type === "p2p") {
    return (
      <div>
        <p style={{ margin: 0, fontSize: 12, color: tm }}>
          <span style={{ color: "#00b0a5", fontWeight: 700 }}>↑ </span>{route.from}
        </p>
        <p style={{ margin: "3px 0 0", fontSize: 12, color: ts }}>
          <span style={{ color: "#f59e0b", fontWeight: 700 }}>↓ </span>{route.to}
        </p>
      </div>
    );
  }
  return <p style={{ margin: 0, fontSize: 12, color: tm, fontStyle: "italic" }}>{route.label}</p>;
}

export default function BookingTable({ bookings, dark, onView }) {
  const border = dark ? "rgba(255,255,255,0.08)" : "#e2e8f0";
  const cardBg = dark ? "rgba(255,255,255,0.04)" : "#ffffff";
  const hdrBg  = dark ? "rgba(255,255,255,0.03)" : "#f8fafc";
  const tm     = dark ? "#f1f5f9" : "#0f172a";
  const ts     = dark ? "#64748b" : "#94a3b8";
  const rowHov = dark ? "rgba(255,255,255,0.03)" : "#f8fafc";

  if (bookings.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "80px 0", color: ts }}>
        <p style={{ fontSize: 44, margin: "0 0 10px" }}>📭</p>
        <p style={{ fontSize: 16, fontWeight: 700, color: tm, margin: "0 0 4px" }}>No bookings found</p>
        <p style={{ fontSize: 13, margin: 0 }}>Try a different filter or search term</p>
      </div>
    );
  }

  // Column definitions — flex ratios control width, no fixed px so nothing overflows
  const cols = [
    { key: "id",       label: "ID",       flex: "0 0 150px"  },
    { key: "type",     label: "Type",     flex: "0 0 110px"  },
    { key: "customer", label: "Customer", flex: "1 1 130px"  },
    { key: "route",    label: "Route",    flex: "2 1 140px"  },
    { key: "dates",    label: "Dates",    flex: "0 0 100px"  },
    { key: "category", label: "Category", flex: "0 0 90px"   },
    { key: "vehicle",  label: "Vehicle",  flex: "0 0 110px"  },
    { key: "quoted",   label: "Quoted",   flex: "0 0 70px"   },
    { key: "status",   label: "Status",   flex: "0 0 110px"  },
    { key: "action",   label: "",         flex: "0 0 70px"   },
  ];

  const rowStyle = (hovered) => ({
    display: "flex", alignItems: "center",
    padding: "14px 20px", gap: 0,
    borderBottom: `1px solid ${border}`,
    background: hovered ? rowHov : "transparent",
    transition: "background .1s",
    cursor: "default",
  });

  return (
    <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 20, overflow: "hidden" }}>

      {/* ── Column headers ── */}
      <div style={{ display: "flex", alignItems: "center", padding: "10px 20px", background: hdrBg, borderBottom: `1px solid ${border}`, gap: 0 }}>
        {cols.map(col => (
          <div key={col.key} style={{ flex: col.flex, color: ts }}>
            <ColHeader label={col.label} />
          </div>
        ))}
      </div>

      {/* ── Rows ── */}
      {bookings.map((b, i) => (
        <BookingRow
          key={b.id}
          booking={b}
          cols={cols}
          dark={dark}
          tm={tm} ts={ts}
          isLast={i === bookings.length - 1}
          border={border}
          rowHov={rowHov}
          onView={onView}
        />
      ))}
    </div>
  );
}

function BookingRow({ booking: b, cols, tm, ts, isLast, border, rowHov, onView }) {
  const [hovered, setHovered] = [false, () => {}]; // simple hover via onMouse

  const cellStyle = (flex) => ({ flex, overflow: "hidden" });

  return (
    <div
      style={{
        display: "flex", alignItems: "center",
        padding: "14px 20px", gap: 0,
        borderBottom: isLast ? "none" : `1px solid ${border}`,
        transition: "background .1s",
      }}
      onMouseEnter={e => e.currentTarget.style.background = rowHov}
      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
    >
      {/* ID */}
      <div style={cellStyle(cols[0].flex)}>
        <p style={{ margin: 0, fontSize: 11, fontFamily: "monospace", fontWeight: 700, color: "#00b0a5", wordBreak: "break-all" }}>
          {b.id}
        </p>
      </div>

      {/* Tour Type */}
      <div style={cellStyle(cols[1].flex)}>
        <TourTypeChip tourType={b.tourType} short />
      </div>

      {/* Customer */}
      <div style={cellStyle(cols[2].flex)}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: tm, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {b.customerName || "—"}
        </p>
        <p style={{ margin: "2px 0 0", fontSize: 11, color: ts }}>{formatPhone(b.customerPhone)}</p>
      </div>

      {/* Route */}
      <div style={cellStyle(cols[3].flex)}>
        <RouteCell booking={b} tm={tm} ts={ts} />
      </div>

      {/* Dates */}
      <div style={cellStyle(cols[4].flex)}>
        <p style={{ margin: 0, fontSize: 12, color: tm }}>{b.startDate || "—"}</p>
        {b.endDate && b.endDate !== b.startDate && (
          <p style={{ margin: "2px 0 0", fontSize: 11, color: ts }}>→ {b.endDate}</p>
        )}
      </div>

      {/* Category */}
      <div style={cellStyle(cols[5].flex)}>
        <p style={{ margin: 0, fontSize: 12, color: ts }}>
          {VEHICLE_LABELS[b.categoryId] || b.categoryId || "—"}
        </p>
      </div>

      {/* Vehicle */}
      <div style={cellStyle(cols[6].flex)}>
        {b.assignedVehicle ? (
          <>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "#6366f1", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {b.assignedVehicle.name}
            </p>
            <p style={{ margin: 0, fontSize: 10, color: ts, fontFamily: "monospace" }}>
              {b.assignedVehicle.plateNumber}
            </p>
          </>
        ) : <p style={{ margin: 0, fontSize: 12, color: ts }}>—</p>}
      </div>

      {/* Quoted */}
      <div style={cellStyle(cols[7].flex)}>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 800, fontFamily: "monospace", color: b.quotedPrice ? "#6366f1" : ts }}>
          {b.quotedPrice ? `$${b.quotedPrice}` : "—"}
        </p>
      </div>

      {/* Status */}
      <div style={cellStyle(cols[8].flex)}>
        <StatusChip status={b.status} />
      </div>

      {/* Action */}
      <div style={cellStyle(cols[9].flex)}>
        <button
          onClick={() => onView(b)}
          style={{
            display: "flex", alignItems: "center", gap: 5,
            background: "rgba(0,176,165,0.1)", color: "#00b0a5",
            border: "1px solid rgba(0,176,165,0.25)", borderRadius: 8,
            padding: "6px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer",
          }}
        >
          <Eye size={13} /> View
        </button>
      </div>
    </div>
  );
}
