import React from 'react';

const GalleryTable = ({ items, onEdit, onDelete }) => {
  return (
    <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mt-10">
      <div className="p-7 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-900 tracking-tight">Active Gallery Items</h3>
        <span className="text-sm font-medium text-slate-500">{items.length} total photos</span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-7 py-5 font-semibold">Photo</th>
              <th className="px-7 py-5 font-semibold">Category</th>
              <th className="px-7 py-5 font-semibold">Description</th>
              <th className="px-7 py-5 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item, index) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-all duration-150">
                <td className="px-7 py-5">
                  <div className="w-24 h-16 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 shadow-inner">
                    <img src={item.url || 'https://via.placeholder.com/150'} alt={item.category} className="w-full h-full object-cover" />
                  </div>
                </td>
                <td className="px-7 py-5">
                  <span className={`inline-block text-xs font-semibold px-3 py-1.5 rounded-full ${item.category === 'VEHICLE' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
                    {item.category}
                  </span>
                </td>
                <td className="px-7 py-5 text-slate-600 text-sm leading-relaxed max-w-sm">
                  {item.description.length > 80 ? item.description.substring(0, 80) + '...' : item.description}
                </td>
                <td className="px-7 py-5">
                  <div className="flex justify-end gap-2.5">
                    <button 
                      onClick={() => onEdit(item)}
                      className="text-slate-500 hover:text-blue-700 bg-slate-100 hover:bg-blue-50 p-2.5 rounded-lg text-sm transition-all"
                      title="Edit item"
                    >
                      ✎ {/* Using a symbol, replace with an icon if needed */}
                    </button>
                    <button 
                      onClick={() => onDelete(item.id)}
                      className="text-slate-500 hover:text-red-700 bg-slate-100 hover:bg-red-50 p-2.5 rounded-lg text-sm transition-all"
                      title="Delete item"
                    >
                      ✕ {/* Using a symbol, replace with an icon if needed */}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && (
            <div className="text-center py-16 text-slate-500 bg-slate-50/50">
                <p className="font-semibold text-2xl mb-2">¯\_(ツ)_/¯</p>
                <p>No gallery items found. Try adding one above.</p>
            </div>
        )}
      </div>
    </section>
  );
};

export default GalleryTable;