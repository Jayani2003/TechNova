// components/pages/Admin/ApproveBookings/ApproveBookings.jsx
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useBookings } from "../../../../context/BookingsContext";
import { STATUS_CFG } from "./BookingConstants";
import BookingFilters from "./BookingFilters";
import BookingTable   from "./BookingTable";
import BookingModal   from "./BookingModal";

export default function ApproveBookings() {
  const context = useOutletContext();
  const dark = context?.dark ?? false;

  const { getAllBookings, setQuotedPrice, updateBookingStatus } = useBookings();
  const bookings = getAllBookings();

  const [search,       setSearch]      = useState("");
  const [statusFilter, setStatus]      = useState("ALL");
  const [typeFilter,   setTypeFilter]  = useState("ALL");
  const [selected,     setSelected]    = useState(null);

  const tm = dark ? "#f1f5f9" : "#0f172a";
  const ts = dark ? "#64748b" : "#94a3b8";

  // Status counts for filter badges
  const counts = Object.keys(STATUS_CFG).reduce((acc, s) => {
    acc[s] = bookings.filter(b => b.status === s).length;
    return acc;
  }, {});

  // Apply filters
  const filtered = bookings.filter(b => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      b.id?.toLowerCase().includes(q) ||
      b.customerName?.toLowerCase().includes(q) ||
      (b.pickupLocation || b.startLocation || "").toLowerCase().includes(q) ||
      (b.dropoffLocation || b.endLocation || "").toLowerCase().includes(q) ||
      (b.packageName || "").toLowerCase().includes(q) ||
      (b.destination || "").toLowerCase().includes(q);
    const matchStatus = statusFilter === "ALL" || b.status === statusFilter;
    const matchType   = typeFilter   === "ALL" || b.tourType === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  // Modal handlers — re-sync selected booking after mutations
  const handleSetQuote = (id, price, vehicleInfo) => {
    setQuotedPrice(id, price, vehicleInfo);
    const updated = getAllBookings().find(b => b.id === id);
    if (updated) setSelected({ ...updated, status: "QUOTED", quotedPrice: price, assignedVehicle: vehicleInfo });
  };

  const handleUpdateStatus = (id, status) => {
    updateBookingStatus(id, status);
    const updated = getAllBookings().find(b => b.id === id);
    if (updated) setSelected({ ...updated, status });
    else setSelected(null);
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>

      {/* Page header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: tm, letterSpacing: "-.4px" }}>
          Manage Bookings
        </h1>
        <p style={{ margin: "4px 0 0", fontSize: 14, color: ts }}>
          {bookings.length} total · {counts.PENDING || 0} pending · {counts.ACCEPTED || 0} awaiting confirmation
        </p>
      </div>

      {/* Filters */}
      <BookingFilters
        dark={dark}
        search={search}       onSearch={setSearch}
        statusFilter={statusFilter} onStatus={setStatus}
        typeFilter={typeFilter}     onType={setTypeFilter}
        counts={counts}
        total={bookings.length}
      />

      {/* Table */}
      <BookingTable
        bookings={filtered}
        dark={dark}
        onView={setSelected}
      />

      {/* Detail modal */}
      {selected && (
        <BookingModal
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
