// context/BookingsContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const BookingsContext = createContext();
const STORAGE_KEY = "ceylon_bookings";

const loadBookings = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error("Failed to load bookings from localStorage:", e);
  }
  return [];
};

export const BookingsProvider = ({ children }) => {
  const [bookings, setBookings] = useState(loadBookings);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    } catch (e) {
      console.error("Failed to save bookings:", e);
    }
  }, [bookings]);

  // ── Add a new booking ──────────────────────────────────────────────────────
  const addBooking = (bookingData) => {
    const newBooking = {
      id: `BK${Date.now()}`,
      status: "PENDING",
      quotedPrice: null,
      assignedVehicle: null,   // added: admin assigns vehicle when quoting
      vehicleId: null,
      createdAt: new Date().toISOString().split("T")[0],
      ...bookingData,
    };
    setBookings((prev) => [newBooking, ...prev]);
    return newBooking;
  };

  // ── Customer: accept quoted price ──────────────────────────────────────────
  const acceptQuote = (bookingId) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId ? { ...b, status: "ACCEPTED" } : b
      )
    );
  };

  // ── Customer: reject quoted price ──────────────────────────────────────────
  const rejectQuote = (bookingId) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId ? { ...b, status: "REJECTED" } : b
      )
    );
  };

  // ── Customer or Admin: cancel booking ─────────────────────────────────────
  const cancelBooking = (bookingId) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId ? { ...b, status: "CANCELLED" } : b
      )
    );
  };

  // ── Admin: set quoted price AND assign vehicle ─────────────────────────────
  const setQuotedPrice = (bookingId, price, vehicleInfo = null) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              status: "QUOTED",
              quotedPrice: price,
              assignedVehicle: vehicleInfo,  // { name, plateNumber, type }
            }
          : b
      )
    );
  };

  // ── Admin: update booking status ───────────────────────────────────────────
  const updateBookingStatus = (bookingId, status) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId ? { ...b, status } : b
      )
    );
  };

  // ── Get bookings for a specific customer ───────────────────────────────────
  const getCustomerBookings = (customerEmail) =>
    bookings.filter((b) => b.customerEmail === customerEmail);

  // ── Get all bookings (admin) ───────────────────────────────────────────────
  const getAllBookings = () => bookings;

  // ── Get pending count (for admin badge) ────────────────────────────────────
  const getPendingCount = () =>
    bookings.filter((b) => b.status === "PENDING").length;

  return (
    <BookingsContext.Provider
      value={{
        bookings,
        addBooking,
        acceptQuote,
        rejectQuote,
        cancelBooking,
        setQuotedPrice,
        updateBookingStatus,
        getCustomerBookings,
        getAllBookings,
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
