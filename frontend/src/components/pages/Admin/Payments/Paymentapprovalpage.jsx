import React, { useState, useEffect, useCallback } from "react";
import PaymentStatsBar from "./Paymentstatsbar";
import PaymentFilters from "./Paymentfilters";
import PaymentTable from "./Paymenttable";
import PaymentDetailPanel from "./Paymentdetailpanel";

const MOCK_PAYMENTS = [
  { id: "PAY001", bookingId: "BK001", tourType: "P2P Tour", customerName: "Kolitha", customerPhone: "+94 701510733", type: "Deposit", typePercent: "50%", amount: "LKR 25,000.00", method: "Bank Transfer", date: "2026-05-27", time: "10:20 AM", status: "pending" },
  { id: "PAY002", bookingId: "BK002", tourType: "P2P Tour", customerName: "Nimal Perera", customerPhone: "+94 712345678", type: "Final", typePercent: "50%", amount: "LKR 25,000.00", method: "Bank Transfer", date: "2026-05-27", time: "09:15 AM", status: "pending" },
  { id: "PAY003", bookingId: "BK003", tourType: "Package Tour", customerName: "Sanduni", customerPhone: "+94 778887766", type: "Full Payment", typePercent: "100%", amount: "LKR 80,000.00", method: "Cash", date: "2026-05-26", time: "04:45 PM", status: "approved" },
  { id: "PAY004", bookingId: "BK004", tourType: "Customized", customerName: "Ruwan Jayasekara", customerPhone: "+94 702223344", type: "Deposit", typePercent: "50%", amount: "LKR 30,000.00", method: "Bank Transfer", date: "2026-05-26", time: "11:30 AM", status: "rejected" },
  { id: "PAY005", bookingId: "BK005", tourType: "P2P Tour", customerName: "Tharindu", customerPhone: "+94 761112223", type: "Final", typePercent: "50%", amount: "LKR 30,000.00", method: "Bank Transfer", date: "2026-05-25", time: "02:10 PM", status: "approved" },
];

const MOCK_DETAIL = {
  PAY001: {
    id: "PAY001", status: "pending", receivedAt: "2026-05-27 at 10:20 AM", bookingId: "BK001", tourType: "Point-to-Point", route: "Colombo → Kandy", tourDates: "2026-05-28 to 2026-05-30", vehicle: "Sedan Car", paymentType: "Deposit (50%)", amountPaid: "LKR 25,000.00", totalAmount: "LKR 50,000.00", remainingAmount: "LKR 25,000.00", paymentMethod: "Bank Transfer", bankName: "Commercial Bank", referenceNumber: "REF12345678", paymentDate: "2026-05-27", slip: { filename: "payment_slip.jpg", size: "158 KB", uploadedAt: "2026-05-27 10:20 AM", previewUrl: null }
  }
};

export default function PaymentApprovalsPage() {
  const [payments, setPayments] = useState(MOCK_PAYMENTS);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [detailData, setDetailData] = useState(null);
  const [panelLoading, setPanelLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [activeTab, setActiveTab] = useState("all");
  const [filters, setFilters] = useState({ search: "", type: "", status: "", dateRange: "this_month" });
  const [currentPage, setCurrentPage] = useState(1);
  const PER_PAGE = 5;

  const filteredPayments = payments.filter((p) => {
    if (activeTab !== "all" && p.status !== activeTab) return false;
    if (filters.type && p.type.toLowerCase() !== filters.type) return false;
    if (filters.status && p.status !== filters.status) return false;
    if (filters.search && ![p.id, p.bookingId, p.customerName, p.customerPhone].some((v) => v.toLowerCase().includes(filters.search.toLowerCase()))) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredPayments.length / PER_PAGE));
  const paginated = filteredPayments.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const counts = { all: payments.length, pending: payments.filter((p) => p.status === "pending").length, approved: payments.filter((p) => p.status === "approved").length, rejected: payments.filter((p) => p.status === "rejected").length };

  const stats = { pendingCount: counts.pending, approvedCount: counts.approved, rejectedCount: counts.rejected, totalReceivedLabel: "LKR 1,250,000", totalPaymentsCount: counts.approved };

  const handleFilterChange = useCallback((key, value) => { setFilters((prev) => ({ ...prev, [key]: value })); setCurrentPage(1); }, []);
  const handleTabChange = useCallback((tab) => { setActiveTab(tab); setCurrentPage(1); }, []);

  const handleSelectPayment = useCallback(async (payment) => {
    setSelectedPayment(payment);
    setPanelLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const detail = MOCK_DETAIL[payment.id] ?? {
      ...payment,
      receivedAt: `${payment.date} at ${payment.time}`,
      bookingId: payment.bookingId,
      tourType: payment.tourType,
      route: "–",
      tourDates: "–",
      vehicle: "–",
      paymentType: `${payment.type} (${payment.typePercent})`,
      amountPaid: payment.amount,
      totalAmount: payment.amount,
      remainingAmount: "–",
      paymentMethod: payment.method,
      bankName: null,
      referenceNumber: null,
      paymentDate: payment.date,
      slip: null,
    };
    setDetailData(detail);
    setPanelLoading(false);
  }, []);

  const handleClosePanel = useCallback(() => { setSelectedPayment(null); setDetailData(null); }, []);

  const handleApprove = useCallback(async (paymentId, notes) => {
    setActionLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setPayments((prev) => prev.map((p) => (p.id === paymentId ? { ...p, status: "approved" } : p)));
    if (detailData?.id === paymentId) { setDetailData((prev) => ({ ...prev, status: "approved" })); }
    setActionLoading(false);
  }, [detailData]);

  const handleReject = useCallback(async (paymentId, notes) => {
    setActionLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setPayments((prev) => prev.map((p) => (p.id === paymentId ? { ...p, status: "rejected" } : p)));
    if (detailData?.id === paymentId) { setDetailData((prev) => ({ ...prev, status: "rejected" })); }
    setActionLoading(false);
  }, [detailData]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      

      <div className="px-6 py-6 max-w-screen-xl mx-auto">
        <div className="mb-6"><h2 className="text-xl font-bold text-gray-900">Payment Approvals</h2><p className="text-sm text-gray-500 mt-0.5">Review and approve customer payments</p></div>

        <PaymentStatsBar stats={stats} />

        <PaymentFilters counts={counts} filters={filters} onFilterChange={handleFilterChange} activeTab={activeTab} onTabChange={handleTabChange} />

        <PaymentTable payments={paginated} selectedId={selectedPayment?.id ?? null} onSelect={handleSelectPayment} pagination={{ current: currentPage, total: totalPages, totalItems: filteredPayments.length, perPage: PER_PAGE }} onPageChange={setCurrentPage} loading={false} />
      </div>

      {selectedPayment && (
        <PaymentDetailPanel payment={panelLoading ? { ...selectedPayment, status: selectedPayment.status } : detailData} onClose={handleClosePanel} onApprove={handleApprove} onReject={handleReject} loading={actionLoading || panelLoading} />
      )}
    </div>
  );
}
