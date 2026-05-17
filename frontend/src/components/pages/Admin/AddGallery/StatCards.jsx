import React from "react";
import { CheckCircle2, EyeOff, Users, Eye } from "lucide-react";

export default function StatCards({ photos }) {
  const publishedCount = photos.filter((p) => p.status === "published").length;
  const draftCount = photos.filter((p) => p.status === "draft").length;
  const customerCount = photos.filter((p) => p.withTourists).length;
  const totalViews = "4.8k";

  const stats = [
    { label: "Published Tours", val: publishedCount, delta: `${photos.length} Total items`, icon: <CheckCircle2 className="w-5 h-5 text-teal-600" />, accent: true },
    { label: "Active Drafts", val: draftCount, delta: "Awaiting approval", icon: <EyeOff className="w-5 h-5 text-amber-500" />, accent: false },
    { label: "Our Customers", val: customerCount, delta: "Photos with tourists", icon: <Users className="w-5 h-5 text-purple-500" />, accent: false },
    { label: "Tour Gallery Views", val: totalViews, delta: "+24% organic visits", icon: <Eye className="w-5 h-5 text-sky-500" />, accent: false },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 mb-6 sm:mb-8">
      {stats.map((s, i) => (
        <div
          key={i}
          className={`rounded-2xl p-4 sm:p-5 border transition-all hover:shadow-md ${
            s.accent ? "bg-[#00b0a5] border-[#0d9488] text-white" : "bg-white border-stone-200 text-stone-800"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className={`text-[9px] sm:text-[10px] font-bold tracking-wider uppercase ${s.accent ? "text-teal-200" : "text-stone-400"}`}>
              {s.label}
            </span>
            <div className={`p-1.5 sm:p-2 rounded-xl ${s.accent ? "bg-[#0f766e]" : "bg-stone-50"}`}>{s.icon}</div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight font-serif-display mb-1">{s.val}</div>
          <p className={`text-[10px] sm:text-[11px] font-medium ${s.accent ? "text-teal-100" : "text-stone-500"}`}>{s.delta}</p>
        </div>
      ))}
    </div>
  );
}