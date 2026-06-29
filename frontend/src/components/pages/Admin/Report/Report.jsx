import { useState } from 'react';
import { Download, BarChart3, Wallet, ClipboardList, CarFront, Users } from 'lucide-react';
import { downloadReportPdf, reportItems } from '../../../../services/reportService';

const ICONS = {
  businessOverview: BarChart3,
  earnings: Wallet,
  bookingAnalysis: ClipboardList,
  vehicleAnalysis: CarFront,
  customerReviewAnalysis: Users,
};

function Report() {
  const [loadingKey, setLoadingKey] = useState(null);
  const [error, setError] = useState('');

  const handleDownload = async (key) => {
    try {
      setLoadingKey(key);
      setError('');
      await downloadReportPdf(key);
    } catch (err) {
      setError(err.message || 'Failed to download report.');
    } finally {
      setLoadingKey(null);
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {reportItems.map((item) => {
          const Icon = ICONS[item.key] || Download;
          const busy = loadingKey === item.key;

          return (
            <div key={item.key} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#00b0a5]/10 text-[#008f86]">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-slate-900">{item.label}</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Download the PDF export for this section only.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleDownload(item.key)}
                disabled={busy}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#00b0a5] px-4 py-3 text-sm font-bold text-white transition-all hover:bg-[#008f86] disabled:cursor-wait disabled:opacity-70"
              >
                <Download className="h-4 w-4" />
                {busy ? 'Preparing PDF...' : 'Download PDF'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Report;