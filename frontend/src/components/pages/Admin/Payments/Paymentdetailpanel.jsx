import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const STATUS_CONFIG = {
  pending: { label: "PENDING VERIFICATION", className: "bg-amber-100 text-amber-700 border border-amber-300" },
  approved: { label: "APPROVED", className: "bg-green-100 text-green-700 border border-green-300" },
  rejected: { label: "REJECTED", className: "bg-red-100 text-red-700 border border-red-300" },
};

function SectionHeader({ title }) {
  return (
    <h3 className="text-sm font-bold text-gray-800 mb-3 mt-5 first:mt-0">{title}</h3>
  );
}

function InfoRow({ label, value, highlight, linkLabel, onLink }) {
  return (
    <div className="flex items-start justify-between gap-3 py-1.5 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-500 shrink-0 w-36">{label}</span>
      <div className="flex items-center gap-2 text-right">
        <span className={`text-xs font-medium ${highlight ? "text-teal-600 font-semibold" : "text-gray-800"}`}>
          {value}
        </span>
        {linkLabel && (
          <button onClick={onLink} className="text-xs text-blue-500 hover:underline font-medium">{linkLabel}</button>
        )}
      </div>
    </div>
  );
}

function SlipPreview({ slip }) {
  if (!slip) return null;

  const handleDownload = async () => {
    try {
      const response = await fetch(slip.previewUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = slip.filename || 'payment-slip';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download file directly:", err);
      window.open(slip.previewUrl, '_blank');
    }
  };

  return (
    <div className="mt-2 border border-gray-200 rounded-xl overflow-hidden">
      <div className="bg-gray-50 h-28 flex items-center justify-center border-b border-gray-100">
        {slip.previewUrl ? (
          <img src={slip.previewUrl} alt="Payment slip" className="h-full w-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-1 text-gray-300">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
            <span className="text-xs">No preview</span>
          </div>
        )}
      </div>

      <div className="p-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-gray-700 truncate">{slip.filename}</p>
          <p className="text-xs text-gray-400 mt-0.5">{slip.size}</p>
          <p className="text-xs text-gray-400">Uploaded on {slip.uploadedAt}</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button onClick={() => window.open(slip.previewUrl, '_blank')} className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">View Full Size</button>
          <button onClick={handleDownload} className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs bg-teal-50 border border-teal-200 rounded-lg text-teal-700 hover:bg-teal-100 transition-colors">Download</button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentDetailPanel({ payment = null, onClose = () => {}, onApprove = () => {}, onReject = () => {}, loading = false }) {
  const [notes, setNotes] = useState("");
  const navigate = useNavigate();

  if (!payment) return null;

  const statusCfg = STATUS_CONFIG[payment.status] || STATUS_CONFIG.pending;
  const isPending = payment.status === "pending";

  const handleApprove = () => onApprove(payment.id, notes);
  const handleReject = () => onReject(payment.id, notes);

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={onClose} />

      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col border-l border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-gray-900">Payment Details</h2>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-md tracking-wide ${statusCfg.className}`}>{statusCfg.label}</span>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">×</button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="mb-4">
            <p className="text-xs text-gray-400 mb-0.5">Payment ID</p>
            <p className="font-mono font-bold text-gray-900 text-base">{payment.id}</p>
            <p className="text-xs text-gray-400 mt-0.5">Received on {payment.receivedAt}</p>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <SectionHeader title="Booking Information" />
            <div className="bg-gray-50/60 rounded-xl p-3">
              <InfoRow label="Booking ID" value={payment.bookingId} linkLabel="View Booking" onLink={() => navigate('/admin/approve-bookings', { state: { bookingId: payment.bookingId } })} />
              <InfoRow label="Tour Type" value={payment.tourType} />
              <InfoRow label="Route" value={payment.route} />
              <InfoRow label="Tour Dates" value={payment.tourDates} />
              <InfoRow label="Vehicle" value={payment.vehicle} />
            </div>

            <SectionHeader title="Payment Information" />
            <div className="bg-gray-50/60 rounded-xl p-3">
              <InfoRow label="Payment Type" value={payment.paymentType} />
              <InfoRow label="Amount Paid" value={payment.amountPaid} highlight />
              <InfoRow label="Total Amount" value={payment.totalAmount} />
              <InfoRow label="Remaining Amount" value={payment.remainingAmount} highlight />
              <InfoRow label="Payment Method" value={payment.paymentMethod} />
              {payment.bankName && <InfoRow label="Bank Name" value={payment.bankName} />}
              {payment.referenceNumber && <InfoRow label="Reference Number" value={payment.referenceNumber} />}
              <InfoRow label="Payment Date" value={payment.paymentDate} />
            </div>

            <SectionHeader title="Payment Slip" />
            {payment.slip ? <SlipPreview slip={payment.slip} /> : <p className="text-xs text-gray-400 italic">No payment slip uploaded.</p>}

            <SectionHeader title="Admin Notes" />
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add notes about this payment (optional)..." rows={4} className="w-full text-sm px-3 py-2.5 border border-gray-200 rounded-xl bg-white resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder-gray-300" />
          </div>
        </div>

        {isPending && (
          <div className="flex gap-3 px-5 py-4 border-t border-gray-100 shrink-0 bg-white">
            <button onClick={handleReject} disabled={loading} className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Reject Payment</button>
            <button onClick={handleApprove} disabled={loading} className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Approve Payment</button>
          </div>
        )}
      </div>
    </>
  );
}
