import React, { useState, useEffect, useRef } from 'react';
import { Upload } from 'lucide-react';

const GalleryForm = ({ editingItem, onSubmit, onCancel, dark = false }) => {
  const initialState = { title: '', category: '', description: '', url: '', file: null };
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  // Validation rules
  const validateField = (name, value) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case 'title':
        if (!value.trim()) {
          newErrors.title = 'Title is required';
        } else if (value.trim().length < 3) {
          newErrors.title = 'Title must be at least 3 characters';
        } else if (value.trim().length > 50) {
          newErrors.title = 'Title must not exceed 50 characters';
        } else {
          delete newErrors.title;
        }
        break;
      
      case 'category':
        if (!value) {
          newErrors.category = 'Category is required';
        } else {
          delete newErrors.category;
        }
        break;
      
      case 'description':
        if (!value.trim()) {
          newErrors.description = 'Description is required';
        } else if (value.trim().length < 10) {
          newErrors.description = 'Description must be at least 10 characters';
        } else if (value.trim().length > 500) {
          newErrors.description = 'Description must not exceed 500 characters';
        } else {
          delete newErrors.description;
        }
        break;
      
      case 'url':
        if (!value) {
          newErrors.url = 'Image is required. Please upload a file';
        } else {
          delete newErrors.url;
        }
        break;
      
      default:
        break;
    }
    
    setErrors(newErrors);
    return newErrors;
  };

  const validateForm = () => {
    let newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else if (formData.title.trim().length > 50) {
      newErrors.title = 'Title must not exceed 50 characters';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    } else if (formData.description.trim().length > 500) {
      newErrors.description = 'Description must not exceed 500 characters';
    }
    
    if (!formData.url) {
      newErrors.url = 'Image is required. Please upload a file';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (editingItem) {
      setFormData({ 
        title: editingItem.title || '',
        category: editingItem.category || 'Vehicles', 
        description: editingItem.description, 
        url: editingItem.url || editingItem.image_url || '',
        file: null 
      });
    } else {
      setFormData(initialState);
    }
    setErrors({});
  }, [editingItem]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setErrors({ ...errors, url: 'Please upload a valid image (PNG, JPG, or WebP)' });
        return;
      }
      
      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        setErrors({ ...errors, url: 'Image size must be less than 5MB' });
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((current) => ({ ...current, url: reader.result, file }));
        // Clear image error if file is loaded
        const newErrors = { ...errors };
        delete newErrors.url;
        setErrors(newErrors);
      };
      reader.readAsDataURL(file);
    }
  };

  const localHandleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    onSubmit(formData);

    if (!editingItem) {
      setFormData(initialState);
      setErrors({});
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className={`p-10 rounded-3xl border ${dark ? 'bg-gradient-to-br from-slate-800/80 to-slate-900/60 border-white/10 shadow-2xl' : 'bg-gradient-to-br from-white to-slate-50 border-slate-200 shadow-2xl'}`}>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-1 h-8 rounded-full ${dark ? 'bg-gradient-to-b from-[#00b0a5] to-[#0d9488]' : 'bg-gradient-to-b from-blue-600 to-blue-400'}`}></div>
          <h3 className={`text-2xl font-black ${dark ? 'text-slate-100' : 'text-slate-900'}`}>
            {editingItem ? '✏️ Update Gallery Image' : '🖼️ Add New Gallery Image'}
          </h3>
        </div>
        <p className={`text-sm font-medium ml-4 ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
          {editingItem ? 'Modify the selected gallery item' : 'Upload a new image to the gallery'}
        </p>
      </div>
      
      <form onSubmit={localHandleSubmit} className="space-y-8">
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />

        <div className="grid grid-cols-2 gap-6">
          <div>
            <div 
              onClick={handleUploadClick}
              className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                errors.url
                  ? 'border-red-500 bg-red-50/30'
                  : dark 
                  ? 'border-[#00b0a5]/50 bg-gradient-to-br from-slate-900/50 to-slate-950/70 hover:border-[#00b0a5] hover:bg-slate-900/70' 
                  : 'border-blue-200 bg-gradient-to-br from-blue-50/80 to-indigo-50/50 hover:border-blue-400 hover:bg-blue-100/70'
              }`}
            >
              <div className={`p-3 rounded-lg mb-3 transition-all ${dark ? 'bg-gradient-to-br from-[#00b0a5] to-[#0d9488]' : 'bg-gradient-to-br from-blue-600 to-indigo-600'}`}>
                <Upload size={20} className="text-white" />
              </div>
              <p className={`text-sm font-bold ${dark ? 'text-[#00b0a5]' : 'text-blue-600'}`}>Choose Image</p>
              <p className={`text-xs mt-1 ${dark ? 'text-slate-500' : 'text-slate-500'}`}>Click to upload • PNG, JPG, WebP</p>
            </div>
            {errors.url && (
              <p className="text-xs font-medium text-red-500 mt-2">⚠️ {errors.url}</p>
            )}
            <p className={`text-xs font-medium mt-2 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>Max file size: 5MB</p>
          </div>

          <div className={`relative aspect-video rounded-2xl overflow-hidden border-2 flex items-center justify-center transition-all ${formData.url ? 'scale-100' : 'scale-95'} ${dark ? 'border-white/10 bg-gradient-to-br from-slate-900/70 to-slate-950/70' : 'border-blue-100 bg-gradient-to-br from-slate-100/70 to-slate-50/70'}`}>
            {formData.url ? (
              <img src={formData.url} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center">
                <Upload size={40} className={dark ? 'text-slate-600 mx-auto mb-2' : 'text-slate-300 mx-auto mb-2'} />
                <p className={`text-xs font-medium ${dark ? 'text-slate-500' : 'text-slate-400'}`}>Preview</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className={`text-sm font-bold flex items-center gap-2 ${dark ? 'text-slate-300' : 'text-slate-800'}`}>
              <span>📝</span> Title
            </label>
            <input
              type="text"
              className={`w-full border-2 rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all ${
                errors.title 
                  ? 'border-red-500 bg-red-50/30 focus:border-red-600'
                  : dark 
                  ? 'border-slate-700 bg-slate-900/80 text-slate-100 placeholder:text-slate-600 focus:border-[#00b0a5] focus:bg-slate-900' 
                  : 'border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-blue-50/50'
              }`}
              placeholder="e.g., Mountain Landscape, Vehicle Fleet, Tour Group Photo..."
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                validateField('title', e.target.value);
              }}
            />
            {errors.title && (
              <p className="text-xs font-medium text-red-500 mt-1">⚠️ {errors.title}</p>
            )}
            <p className={`text-xs font-medium mt-1 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
              {formData.title.length}/50 characters
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className={`text-sm font-bold flex items-center gap-2 ${dark ? 'text-slate-300' : 'text-slate-800'}`}>
                <span>🏷️</span> Category
              </label>
              <select 
                className={`w-full border-2 rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all ${
                  errors.category
                    ? 'border-red-500 bg-red-50/30 focus:border-red-600'
                    : dark 
                    ? 'border-slate-700 bg-slate-900/80 text-slate-100 focus:border-[#00b0a5] focus:bg-slate-900' 
                    : 'border-slate-200 bg-white text-slate-900 focus:border-blue-500 focus:bg-blue-50/50'
                }`}
                value={formData.category}
                onChange={(e) => {
                  setFormData({...formData, category: e.target.value});
                  validateField('category', e.target.value);
                }}
              >
                <option value="">-- Select a Category --</option>
                <option value="Vehicles">🚗 Vehicles</option>
                <option value="Traveler Photos">📸 Traveler Photos</option>
                <option value="Packages Photos">✈️ Packages Photos</option>
              </select>
              {errors.category && (
                <p className="text-xs font-medium text-red-500 mt-1">⚠️ {errors.category}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className={`text-sm font-bold flex items-center gap-2 ${dark ? 'text-slate-300' : 'text-slate-800'}`}>
                <span>💬</span> Description
              </label>
              <textarea 
                className={`w-full border-2 rounded-xl px-4 py-3 text-sm font-medium outline-none min-h-[100px] resize-none transition-all ${
                  errors.description
                    ? 'border-red-500 bg-red-50/30 focus:border-red-600'
                    : dark 
                    ? 'border-slate-700 bg-slate-900/80 text-slate-100 placeholder:text-slate-600 focus:border-[#00b0a5] focus:bg-slate-900' 
                    : 'border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-blue-50/50'
                }`}
                placeholder="Describe this image... what makes it special?"
                value={formData.description}
                onChange={(e) => {
                  setFormData({...formData, description: e.target.value});
                  validateField('description', e.target.value);
                }}
              />
              {errors.description && (
                <p className="text-xs font-medium text-red-500 mt-1">⚠️ {errors.description}</p>
              )}
              <p className={`text-xs font-medium mt-1 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
                {formData.description.length}/500 characters
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button 
            type="submit" 
            className={`flex-1 px-8 py-3.5 rounded-xl font-bold text-sm shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 ${
              formData.url && formData.title.trim() && formData.description.trim() && Object.keys(errors).length === 0
              ? dark ? 'bg-gradient-to-r from-[#00b0a5] to-[#0d9488] text-white shadow-[#00b0a5]/40 hover:shadow-lg' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-300/50 hover:shadow-lg'
              : dark ? 'bg-slate-700/50 text-slate-500' : 'bg-slate-200 text-slate-400'
            }`}
          >
            {editingItem ? '💾 Save Changes' : '✅ Publish Image'}
          </button>
          
          {editingItem && (
            <button 
              type="button" 
              onClick={onCancel} 
              className={`px-6 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 ${dark ? 'bg-slate-700/60 text-slate-200 hover:bg-slate-600/80' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              ✕ Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default GalleryForm;