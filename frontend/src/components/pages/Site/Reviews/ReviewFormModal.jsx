import React, { useState } from 'react';

const ReviewFormModal = ({ onClose, onSubmit }) => {
  const [selectedImages, setSelectedImages] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Logic to ensure max 5 images
    if (selectedImages.length + files.length > 5) {
      alert("You can only upload a maximum of 5 images.");
      return;
    }

    // Create preview URLs for the UI
    const filePreviews = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setSelectedImages([...selectedImages, ...filePreviews]);
  };

  const removeImage = (index) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(newImages);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would use FormData to send files to your backend
    // const formData = new FormData();
    // selectedImages.forEach(img => formData.append('images', img.file));
    
    onSubmit();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-md p-8 relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-xl">✕</button>
        
        <h2 className="text-2xl font-bold mb-2 text-slate-800">Share your experience</h2>
        <p className="text-sm text-slate-500 mb-6">Show other travelers your amazing photos!</p>
        
        <form onSubmit={handleSubmit}>
          {/* Rating Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">Rating</label>
            <select className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none">
              <option>5 Stars - Excellent</option>
              <option>4 Stars - Great</option>
              <option>3 Stars - Average</option>
            </select>
          </div>

          {/* Text Review */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">Your Review</label>
            <textarea 
              className="w-full p-3 rounded-xl border border-slate-200 h-24 focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="Tell us about your trip..."
              required
            ></textarea>
          </div>

          {/* Image Upload Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Photos (Max 5)
            </label>
            
            <div className="grid grid-cols-3 gap-2 mb-3">
              {selectedImages.map((img, index) => (
                <div key={index} className="relative aspect-square">
                  <img 
                    src={img.preview} 
                    alt="preview" 
                    className="w-full h-full object-cover rounded-lg border border-slate-100" 
                  />
                  <button 
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-[10px] flex items-center justify-center shadow-lg"
                  >
                    ✕
                  </button>
                </div>
              ))}

              {/* Add Button Placeholder */}
              {selectedImages.length < 5 && (
                <label className="aspect-square border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors">
                  <span className="text-2xl text-slate-400">+</span>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Add</span>
                  <input 
                    type="file" 
                    className="hidden" 
                    multiple 
                    accept="image/*" 
                    onChange={handleImageChange} 
                  />
                </label>
              )}
            </div>
          </div>

          <button type="submit" className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200">
            Submit for Approval
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewFormModal;