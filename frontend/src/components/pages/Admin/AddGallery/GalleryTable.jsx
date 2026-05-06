import React from 'react';
import { Trash2, Edit3 } from 'lucide-react';

const GalleryTable = ({ items, onEdit, onDelete, dark = false }) => {
  return (
    <div className={`rounded-3xl overflow-hidden border transition-all ${dark ? 'bg-gradient-to-br from-slate-800/80 to-slate-900/60 border-white/10 shadow-2xl' : 'bg-gradient-to-br from-white to-slate-50 border-slate-200 shadow-2xl'}`}>
      <div className={`p-8 border-b ${dark ? 'border-white/10 bg-gradient-to-r from-slate-800/60 to-slate-800/30' : 'border-slate-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/30'}`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-2xl">📸</span>
              <h3 className={`text-2xl font-black ${dark ? 'text-slate-100' : 'text-slate-900'}`}>Active Gallery Items</h3>
            </div>
            <p className={`text-sm font-medium ml-11 ${dark ? 'text-slate-400' : 'text-slate-600'}`}>{items.length} {items.length === 1 ? 'item' : 'items'} in gallery</p>
          </div>
        </div>
      </div>
      
      {items.length === 0 ? (
        <div className={`p-16 text-center ${dark ? 'bg-slate-900/50' : 'bg-slate-50/50'}`}>
          <div className="text-6xl mb-4">📭</div>
          <p className={`text-lg font-bold ${dark ? 'text-slate-400' : 'text-slate-500'}`}>No gallery items yet</p>
          <p className={`text-sm ${dark ? 'text-slate-500' : 'text-slate-400'}`}>Add your first image to get started!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className={`text-xs font-black uppercase tracking-widest border-b ${dark ? 'text-slate-400 border-white/10 bg-slate-900/50' : 'text-slate-500 border-slate-100 bg-slate-100/50'}`}>
              <tr>
                <th className="px-8 py-4">Image</th>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={dark ? 'divide-y divide-white/8' : 'divide-y divide-slate-100'}>
              {items.map((item, index) => (
                <tr key={item.id} className={`transition-all duration-300 hover:shadow-lg ${dark ? 'hover:bg-white/5' : 'hover:bg-blue-50/30'}`}>
                  <td className="px-8 py-5">
                    <div className={`w-16 h-16 rounded-xl overflow-hidden border-2 shadow-lg transition-transform hover:scale-110 ${dark ? 'border-white/10' : 'border-slate-100'}`}>
                      <img src={item.url} alt="" className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className={`px-6 py-5 text-sm font-bold leading-tight max-w-xs ${dark ? 'text-slate-200' : 'text-slate-700'}`}>
                    {item.title?.trim() || '—'}
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide border inline-flex items-center gap-1 ${
                      item.category === 'Vehicles'
                        ? dark ? 'bg-indigo-500/20 text-indigo-200 border-indigo-400/40' : 'bg-indigo-100 text-indigo-700 border-indigo-300'
                        : item.category === 'Traveler Photos'
                        ? dark ? 'bg-purple-500/20 text-purple-200 border-purple-400/40' : 'bg-purple-100 text-purple-700 border-purple-300'
                        : dark ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40' : 'bg-emerald-100 text-emerald-700 border-emerald-300'
                    }`}>
                      {item.category === 'Vehicles' && '🚗'}
                      {item.category === 'Traveler Photos' && '📸'}
                      {item.category === 'Packages Photos' && '✈️'}
                      {item.category}
                    </span>
                  </td>
                  <td className={`px-6 py-5 text-sm font-medium leading-relaxed max-w-md ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {item.description ? item.description.substring(0, 50) + (item.description.length > 50 ? '...' : '') : '—'}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => onEdit(item)} 
                        className={`p-2.5 rounded-lg font-bold text-xs transition-all duration-300 flex items-center gap-1.5 ${dark ? 'bg-slate-700/60 text-slate-300 hover:bg-slate-600 hover:text-[#00b0a5]' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                        title="Edit this item"
                      >
                        <Edit3 size={14} />
                        <span className="hidden sm:inline">Edit</span>
                      </button>
                      <button 
                        onClick={() => onDelete(item.id)} 
                        className={`p-2.5 rounded-lg font-bold text-xs transition-all duration-300 flex items-center gap-1.5 ${dark ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                        title="Delete this item"
                      >
                        <Trash2 size={14} />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GalleryTable;