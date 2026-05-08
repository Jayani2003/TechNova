import { createContext, useContext, useState, useCallback } from "react";
import { api } from "../config/api";

const BookingsContext = createContext();

export const BookingsProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);

  // ── Fetch customer's own bookings ──────────────────────────────────────────
  const getCustomerBookings = useCallback(async () => {
    const data = await api.get("/bookings/my");
    setBookings(data.bookings);
    return data.bookings;
  }, []);

  // ── Fetch ALL bookings (admin) ─────────────────────────────────────────────
  const getAllBookings = useCallback(async () => {
    const data = await api.get("/bookings");
    setBookings(data.bookings);
    return data.bookings;
  }, []);

  // ── Admin: set quoted price + vehicle ──────────────────────────────────────
  const setQuotedPrice = useCallback(async (bookingId, price, vehicleInfo = null) => {
    await api.patch(`/bookings/${bookingId}/quote`, {
      quotedPrice: price,
      vehicleId: vehicleInfo?.id || null,
    });
    await getAllBookings();
  }, [getAllBookings]);

  // ── Update booking status ──────────────────────────────────────────────────
  const updateBookingStatus = useCallback(async (bookingId, status) => {
    await api.patch(`/bookings/${bookingId}/status`, { status });
    // Refresh whichever list is loaded
    try { await getAllBookings(); } catch { await getCustomerBookings(); }
  }, [getAllBookings, getCustomerBookings]);

  // ── Customer: accept / reject / cancel ────────────────────────────────────
  const acceptQuote    = (id) => updateBookingStatus(id, "ACCEPTED");
  const rejectQuote    = (id) => updateBookingStatus(id, "REJECTED");
  const cancelBooking  = (id) => updateBookingStatus(id, "CANCELLED");

  // ── Pending count for admin badge ─────────────────────────────────────────
  const getPendingCount = () => bookings.filter((b) => b.status === "PENDING").length;

  return (
    <BookingsContext.Provider
      value={{
        bookings,
        getCustomerBookings,
        getAllBookings,
        setQuotedPrice,
        updateBookingStatus,
        acceptQuote,
        rejectQuote,
        cancelBooking,
        getPendingCount,
      }}
    >
      {children}
    </BookingsContext.Provider>
  );
};

export const useBookings = () => {
  const context = useContext(BookingsContext);
  if (!context) throw new Error("useBookings must be used within a BookingsProvider");
  return context;
};
