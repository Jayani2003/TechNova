import { Search } from "lucide-react";

const FilterBar = ({ active, setActive, setSearch, categories }) => (
  <div className="sticky top-6 z-30 max-w-5xl mx-auto px-6 -mt-12">
    <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-4 md:p-6">
      <div className="flex flex-col lg:flex-row items-center gap-6">
        <div className="relative w-full lg:w-1/3 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#00b0a5]" size={20} />
          <input
            type="text"
            placeholder="Search your destination..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#00b0a5]/20 focus:border-[#00b0a5] gap-3"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active === cat ? "bg-slate-900 text-white shadow-lg scale-105" : "bg-transparent text-slate-500 hover:bg-slate-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default FilterBar;