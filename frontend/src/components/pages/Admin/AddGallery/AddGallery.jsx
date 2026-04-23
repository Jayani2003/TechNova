import React, { useState } from 'react';
import GalleryForm from './GalleryForm';
import GalleryTable from './GalleryTable';

const AddGallery = () => {
  const [items, setItems] = useState([
    { id: 1, category: 'TRAVEL PHOTOS', description: 'Breathtaking sunset at the Pacific beach with silhouetted palms.' },
    { id: 2, category: 'VEHICLE', description: 'A sleek, cherry red classic sports car parked on a scenic coastal road.' },
  ]);
  const [editingItem, setEditingItem] = useState(null);
  const [showNotification, setShowNotification] = useState(false);

  const handleSubmit = (formData) => {
    if (editingItem) {
      setItems(items.map(item => item.id === editingItem.id ? { ...item, ...formData } : item));
      setEditingItem(null);
    } else {
      setItems([{ ...formData, id: Date.now() }, ...items]); // Add new item to the beginning
    }
    
    // Trigger Success Notification
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to permanently delete this item? This action cannot be undone.")) {
      setItems(items.filter(item => item.id !== id));
      setShowNotification(true); // Reuse notification for delete too
      setTimeout(() => setShowNotification(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-12 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto relative space-y-12">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
          <div>
            <h2 className="text-4xl font-extrabold text-slate-950 tracking-tighter mb-1.5">Manage Media Gallery</h2>
            <p className="text-slate-600 font-medium">Add, update, and manage your vehicle and travel photo collections.</p>
          </div>
          
          {/* Success Notification Popup */}
          {showNotification && (
            <div className="fixed top-8 right-8 flex items-center gap-3 bg-white border border-green-200 text-green-800 p-4 rounded-xl shadow-xl z-[999] animate-in fade-in slide-in-from-top-6 duration-300">
              <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow">✓</div>
              <span className="text-sm font-semibold">Changes applied successfully!</span>
            </div>
          )}
        </div>

        {/* Main Grid Layout (Single Column) */}
        <div className="space-y-12">
          <GalleryForm 
            editingItem={editingItem} 
            onSubmit={handleSubmit} 
            onCancel={() => setEditingItem(null)} 
          />
          
          <GalleryTable 
            items={items} 
            onEdit={setEditingItem} 
            onDelete={handleDelete} 
          />
        </div>
      </div>
    </div>
  );
};

export default AddGallery;