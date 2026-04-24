import React, { useState, useEffect, useRef } from 'react';
import { Upload } from 'lucide-react';

const GalleryForm = ({ editingItem, onSubmit, onCancel, dark = false }) => {
  const initialState = { category: 'VEHICLE', description: '', url: '' };
  const [formData, setFormData] = useState(initialState);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (editingItem) {
      setFormData({ 
        category: editingItem.category, 
        description: editingItem.description, 
        url: editingItem.url 
      });
    } else {
      setFormData(initialState);
    }
  }, [editingItem]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, url: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const localHandleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);

    if (!editingItem) {
      setFormData(initialState);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className={`p-8 rounded-3xl h-full border ${dark ? 'bg-slate-800/60 border-white/8' : 'bg-white border-transparent shadow-xl'}`}>
      <h3 className={`text-xl font-black mb-6 ${dark ? 'text-slate-100' : 'text-slate-900'}`}>
        {editingItem ? 'Update Gallery Image' : 'Add New Gallery Image'}
      </h3>
      
      <form onSubmit={localHandleSubmit} className="space-y-6">
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />

        <div className="grid grid-cols-2 gap-4">
          <div 
            onClick={handleUploadClick}
            className={`border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${dark ? 'border-slate-600 bg-slate-900/50 hover:border-[#00b0a5]' : 'border-blue-100 bg-blue-50/50 hover:border-blue-400'}`}
          >
            <div className="bg-blue-600 p-1.5 rounded-md mb-2">
              <Upload size={14} className="text-white" />
            </div>
            <p className={`text-[10px] font-bold underline ${dark ? 'text-[#00b0a5]' : 'text-blue-600'}`}>Choose Image</p>
            <p className={`text-[10px] mt-1 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>Click to upload</p>
          </div>

          <div className={`relative aspect-video rounded-2xl overflow-hidden border flex items-center justify-center ${dark ? 'border-white/10 bg-slate-900/70' : 'border-slate-100 bg-slate-50'}`}>
            {formData.url ? (
              <img src={formData.url} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <Upload size={32} className={dark ? 'text-slate-600' : 'text-slate-200'} />
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className={`text-sm font-bold ${dark ? 'text-slate-300' : 'text-slate-800'}`}>Category</label>
            <select 
              className={`w-full border-2 rounded-xl px-4 py-2.5 text-sm font-medium outline-none ${dark ? 'border-slate-700 bg-slate-900 text-slate-100 focus:border-[#00b0a5]' : 'border-slate-100 focus:border-blue-400'}`}
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              <option value="VEHICLE">VEHICLE</option>
              <option value="TRAVEL PHOTOS">TRAVEL PHOTOS</option>
              <option value="PACKAGE PHOTOS">PACKAGE PHOTOS</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className={`text-sm font-bold ${dark ? 'text-slate-300' : 'text-slate-800'}`}>Description</label>
            <textarea 
              className={`w-full border-2 rounded-xl px-4 py-2.5 text-sm font-medium outline-none min-h-[100px] ${dark ? 'border-slate-700 bg-slate-900 text-slate-100 placeholder:text-slate-500 focus:border-[#00b0a5]' : 'border-slate-100 focus:border-blue-400'}`}
              placeholder="Enter image description..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            type="submit" 
            disabled={!formData.url || !formData.description}
            className={`flex-1 md:flex-none px-8 py-3 rounded-xl font-bold text-sm shadow-lg transition-all ${
              formData.url && formData.description 
              ? dark ? 'bg-[#00b0a5] text-white shadow-[#00b0a5]/30' : 'bg-[#2563eb] text-white shadow-blue-200'
              : dark ? 'bg-slate-700 text-slate-400 cursor-not-allowed shadow-none' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {editingItem ? 'Save Changes' : 'Publish Image'}
          </button>
          
          {editingItem && (
            <button 
              type="button" 
              onClick={onCancel} 
              className={`px-6 py-3 rounded-xl font-bold text-sm ${dark ? 'bg-slate-700 text-slate-200 hover:bg-slate-600' : 'bg-slate-100 text-slate-600'}`}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default GalleryForm;