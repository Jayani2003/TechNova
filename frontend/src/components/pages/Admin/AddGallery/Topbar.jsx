import React from "react";
import { Search } from "lucide-react";

export default function Topbar({ title, searchTerm, onSearchChange }) {
  return (
    <header className="sticky top-0 z-40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 px-4 sm:px-6 lg:px-8 py-4 sm:py-4 bg-white border-b border-stone-200">
      <div className="flex items-center gap-2.5 py-1 sm:py-1.5">
        <h1 className="text-lg sm:text-xl font-black tracking-tight font-serif-display text-stone-900 truncate leading-tight py-1 sm:py-1.5">
          {title}
        </h1>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-2 px-3 py-2 sm:py-1.5 rounded-xl text-xs bg-stone-100 border border-stone-200/80 focus-within:border-teal-600 focus-within:bg-white transition-all w-full sm:w-64">
          <Search className="w-4 h-4 text-stone-400 flex-shrink-0" />
          <input
            type="text"
            className="bg-transparent outline-none text-xs w-full text-stone-800 font-medium"
            placeholder="Search photos, locations..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs bg-teal-50 border border-teal-100/80 text-teal-800 font-semibold whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 flex-shrink-0" />
          <span>Live Site Connected</span>
        </div>
      </div>
    </header>
  );
}