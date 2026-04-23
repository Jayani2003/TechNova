import React, { useState, useEffect } from 'react';

const GalleryForm = ({ editingItem, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    category: 'VEHICLE',
    description: ''
  });

  // Sync form data when editingItem changes
  useEffect(() => {
    if (editingItem) {
      setFormData({
        category: editingItem.category,
        description: editingItem.description
      });
    } else {
      setFormData({ category: 'VEHICLE', description: '' });
    }
  }, [editingItem]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <section className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold text-slate-900 tracking-tight">
          {editingItem ? 'Update Existing Item' : 'Add New Gallery Image'}
        </h3>
        {editingItem && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            Edit Mode
          </span>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr,2fr] gap-8">
          
          {/* Upload Box & Preview */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-slate-800">1. Select Photo</label>
            {editingItem ? (
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 group">
                    <img src={editingItem.url || 'https://via.placeholder.com/150'} alt="Preview" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button type="button" className="text-white text-xs bg-black/60 px-3 py-1 rounded-full font-medium">Change Image</button>
                    </div>
                </div>
            ) : (
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 flex flex-col items-center justify-center text-center aspect-[4/3] bg-slate-50 hover:bg-slate-100/70 hover:border-blue-300 transition-all cursor-pointer group">
                  <div className="bg-blue-600 text-white px-5 py-2.5 rounded-xl shadow font-semibold text-sm mb-3 group-hover:bg-blue-700 transition-all">Choose Image</div>
                  <p className="text-xs text-slate-500 max-w-[150px]">Drag and drop or click to upload JPEG, PNG</p>
                </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <label className="block text-sm font-semibold text-slate-800">2. Define Details</label>
            
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">Category</label>
                <select 
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none text-slate-800 transition-all text-sm font-medium"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="VEHICLE">Vehicle Photos</option>
                  <option value="TRAVEL PHOTOS">Travel Photos</option>
                  <option value="PACKAGE PHOTOS">Package Photos</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">Description</label>
                <textarea 
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl h-36 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none resize-none text-slate-800 transition-all text-sm leading-relaxed"
                  placeholder="E.g., A candid shot of the red classic sports car at sunset..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-6 border-t border-slate-100">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg text-sm">
            {editingItem ? 'Save Changes' : 'Publish Image'}
          </button>
          {editingItem && (
            <button type="button" onClick={onCancel} className="text-slate-500 hover:text-slate-800 hover:bg-slate-100 font-medium px-5 py-3 rounded-xl text-sm transition-all">
              Cancel Edit
            </button>
          )}
        </div>
      </form>
    </section>
  );
};

export default GalleryForm;