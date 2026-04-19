import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import { useBookings } from "../../../../context/BookingsContext.jsx";
import MyBookingCard from "./MyBookingCard";
import MyBookingDetail from "./MyBookingDetail";
import MyBookingEmpty from "./MyBookingEmpty";

const MyBookings = ({ userEmail }) => {
  const { getCustomerBookings } = useBookings();
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState(null);

  const userBookings = getCustomerBookings(userEmail);
  const selectedBooking = userBookings.find((b) => b.id === selectedId) || null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="p-8 sm:p-10 h-full flex flex-col"
    >
      {!selectedBooking && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-1">My Bookings</h2>
          <p className="text-slate-500 text-sm">
            View and manage all your tour bookings.
          </p>
        </div>
      )}

      <AnimatePresence mode="wait">
        {userBookings.length === 0 ? (
          <MyBookingEmpty key="empty" navigate={navigate} />
        ) : selectedBooking ? (
          <MyBookingDetail
            key={selectedBooking.id}
            booking={selectedBooking}
            onBack={() => setSelectedId(null)}
          />
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 space-y-4 overflow-y-auto"
          >
            {userBookings.map((booking) => (
              <MyBookingCard
                key={booking.id}
                booking={booking}
                onClick={() => setSelectedId(booking.id)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MyBookings;
