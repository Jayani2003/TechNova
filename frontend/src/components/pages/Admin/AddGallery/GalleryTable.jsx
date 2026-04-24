import React from 'react';

const GalleryTable = ({ items, onEdit, onDelete, dark = false }) => {
  return (
    <div className={`rounded-3xl overflow-hidden h-full border ${dark ? 'bg-slate-800/60 border-white/8' : 'bg-white border-transparent shadow-xl'}`}>
      <div className={`p-8 border-b ${dark ? 'border-white/8' : 'border-slate-50'}`}>
        <h3 className={`text-xl font-black ${dark ? 'text-slate-100' : 'text-slate-900'}`}>Active Gallery Items</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className={`text-[10px] font-black uppercase tracking-widest border-b ${dark ? 'text-slate-500 border-white/8' : 'text-slate-400 border-slate-50'}`}>
            <tr>
              <th className="px-8 py-4">Thumbnail</th>
              <th className="px-4 py-4">Title</th>
              <th className="px-4 py-4">Category</th>
              <th className="px-4 py-4">Description</th>
              <th className="px-8 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className={dark ? 'divide-y divide-white/8' : 'divide-y divide-slate-50'}>
            {items.map((item) => (
              <tr key={item.id} className={`transition-colors ${dark ? 'hover:bg-white/5' : 'hover:bg-slate-50/50'}`}>
                <td className="px-8 py-4">
                  <div className={`w-12 h-12 rounded-lg overflow-hidden border ${dark ? 'border-white/10' : 'border-slate-100'}`}>
                    <img src={item.url} alt="" className="w-full h-full object-cover" />
                  </div>
                </td>
                <td className={`px-4 py-4 text-[11px] font-bold leading-tight max-w-[140px] ${dark ? 'text-slate-200' : 'text-slate-700'}`}>
                  {item.title?.trim() || 'Untitled'}
                </td>
                <td className="px-4 py-4">
                  <span className={`px-2 py-1 rounded text-[9px] font-black tracking-tight border ${
                    item.category === 'VEHICLE'
                      ? dark ? 'bg-indigo-500/20 text-indigo-200 border-indigo-400/40' : 'bg-indigo-100 text-indigo-700 border-indigo-200'
                      : dark ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40' : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                  }`}>
                    {item.category}
                  </span>
                </td>
                <td className={`px-4 py-4 text-[11px] font-bold leading-tight max-w-[150px] ${dark ? 'text-slate-300' : 'text-slate-500'}`}>
                  {item.description}
                </td>
                <td className="px-8 py-4 text-right">
                  <div className="flex justify-end gap-3 font-bold text-[11px]">
                    <button onClick={() => onEdit(item)} className={dark ? 'text-[#00b0a5] hover:underline' : 'text-blue-600 hover:underline'}>Edit</button>
                    <button onClick={() => onDelete(item.id)} className={dark ? 'text-red-400 hover:underline' : 'text-red-500 hover:underline'}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GalleryTable;