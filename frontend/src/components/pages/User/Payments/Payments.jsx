import React, { useState } from "react";
import { useNavigate } from 'react-router';
import { useBookings } from '../../../../context/BookingsContext.jsx';
// Sidebar navigation component is provided in the UserProfile view.
// Use a lightweight placeholder here to avoid importing a missing file.
import BookingHeader from "./BookingHeader";
import PaymentSummary from "./PaymentSummary";
import PaymentBreakdown from "./PaymentBreakdown";
import PaymentProof from "./PaymentProof";
import PaymentReminders from "./PaymentReminders";
import PaymentInformation from "./PaymentInformation";
import PaymentHistory from "./PaymentHistory";

// ─── Sample Data ──────────────────────────────────────────────────────────────
const INSTALLMENTS = [
  {
    id: 1,
    number: 1,
    type: "Deposit",
    typeLabel: "50% of total",
    amount: "LKR 25,000.00",
    dueDate: "2026-05-22",
    dueDateNote: "Within 2 days of tour start",
    status: "PAID",
    statusNote: "Paid on 2026-05-20",
  },
  {
    id: 2,
    number: 2,
    type: "Final Payment",
    typeLabel: "Remaining 50%",
    amount: "LKR 25,000.00",
    dueDate: "2026-05-29",
    dueDateNote: "Before the last day of tour",
    status: "PENDING",
    statusNote: "Payment pending",
  },
];

const REMINDERS = [
  {
    type: "warning",
    message:
      "Final payment of LKR 25,000.00 is due on 2026-05-29 before the last day of the tour.",
  },
  {
    type: "info",
    message: "Make sure to complete your payment on time to avoid cancellation.",
  },
];

const TRANSACTIONS = [
  {
    id: "tx1",
    date: "2026-05-20  10:30 AM",
    type: "Deposit",
    amount: "LKR 25,000.00",
    method: "Bank Transfer",
    status: "PENDING VERIFICATION",
    reference: "REF12345678",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
const PaymentPage = ({ bookingId = null, onRequestOpenTab }) => {
  const [activeNav, setActiveNav] = useState("payments");
  const { bookings } = useBookings();

  const booking = bookings?.find(b => b.id === bookingId || b.booking_id === bookingId || String(b.id) === String(bookingId)) || null;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex gap-8">
          <div className="flex-1 min-w-0">
            {/* Header */}
            <BookingHeader
              bookingId={bookingId || (booking?.id || 'BK001')}
              tourName={booking?.packageTitle || booking?.tourType || 'Point-to-Point Tour'}
              tourStatus={booking?.status || 'TOUR STARTED'}
              onBack={() => {
                if (typeof onRequestOpenTab === 'function') {
                  onRequestOpenTab('bookings', bookingId || booking?.id);
                } else {
                  navigate('/user/profile', { state: { activeTab: 'bookings' } });
                }
              }}
            />

            {/* Payment Summary */}
            <PaymentSummary
              totalAmount={booking?.quotedPrice ? `LKR ${Number(booking.quotedPrice).toFixed(2)}` : 'LKR 0.00'}
              paidAmount={booking?.paidAmount ? `LKR ${Number(booking.paidAmount).toFixed(2)}` : 'LKR 0.00'}
              remainingAmount={booking?.quotedPrice && booking?.paidAmount ? `LKR ${Number(booking.quotedPrice - booking.paidAmount).toFixed(2)}` : 'LKR 0.00'}
              paymentStatus={booking?.paidAmount ? 'PARTIALLY PAID' : 'PENDING PAYMENT'}
              paidSubtext={booking?.paidAmount ? `${Math.round((booking.paidAmount / booking.quotedPrice) * 100)}% of total` : ''}
              remainingSubtext={booking?.quotedPrice ? `${Math.round(((booking.quotedPrice - (booking.paidAmount||0)) / booking.quotedPrice) * 100)}% remaining` : ''}
              nextPaymentNote={booking?.nextPaymentNote || ''}
            />

            {/* Breakdown */}
            <PaymentBreakdown
              installments={INSTALLMENTS}
              onViewDetails={(item) => console.log("View details:", item)}
              onPayNow={(item) => console.log("Pay now:", item)}
            />

            {/* Two-column section */}
            <div className="grid grid-cols-3 gap-5">
              {/* Left: Proof upload */}
              <div className="col-span-2">
                <PaymentProof
                  uploadedMessage="Deposit payment uploaded"
                  uploadedSubtext="Your payment proof is under verification by admin."
                  uploadLabel="Upload Payment Slip"
                  uploadSublabel="(For Final Payment)"
                  onUpload={(data) => console.log("Uploading:", data)}
                />
              </div>

              {/* Right: Reminders + Info */}
              <div className="col-span-1 flex flex-col gap-4">
                <PaymentReminders reminders={REMINDERS} />
                <PaymentInformation
                  paymentMethod="Bank Transfer"
                  bankName="Commercial Bank"
                  accountNumber="1234 5678 9012"
                  accountName="TechNova (Pvt) Ltd"
                  onDownloadInvoice={() => console.log("Downloading invoice")}
                />
              </div>
            </div>

            {/* History */}
            <div className="mt-5">
              <PaymentHistory
                transactions={TRANSACTIONS}
                onViewSlip={(tx) => console.log("View slip:", tx)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;