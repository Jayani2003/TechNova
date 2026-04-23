import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import GalleryForm from './GalleryForm';
import GalleryTable from './GalleryTable';

const AddGallery = () => {
  const dark = useOutletContext()?.dark ?? false;

  const [items, setItems] = useState([
    { id: 1, category: 'VEHICLE', description: 'A sleek, cherry red classic sports car...', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400' },
  ]);
  const [editingItem, setEditingItem] = useState(null);
  

  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success'
  });

  const triggerNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification(prev => ({ ...prev, show: false })), 3000);
  };

  const handleSubmit = (formData) => {
    if (!editingItem) {
      const isDuplicate = items.some(
        (item) => item.description.toLowerCase().trim() === formData.description.toLowerCase().trim()
      );

      if (isDuplicate) {
        triggerNotification("This item already exists in the gallery. Please use a different description.", "error");
        return;
      }
    }

    if (editingItem) {
      setItems(items.map(item => item.id === editingItem.id ? { ...item, ...formData } : item));
      setEditingItem(null);
      triggerNotification("Changes applied successfully!", "success");
    } else {
      setItems([{ ...formData, id: Date.now() }, ...items]);
      triggerNotification("New image published successfully!", "success");
    }
  };

  return (
    <div className={`min-h-screen p-6 md:p-12 font-sans relative ${dark ? 'bg-[#020617]' : 'bg-[#f8fafc]'}`}>
      <div className="max-w-7xl mx-auto">
        {notification.show && (
          <div className={`fixed top-10 left-1/2 -translate-x-1/2 flex items-center gap-3 px-6 py-3 rounded-xl shadow-lg z-[999] animate-in fade-in slide-in-from-top-4 duration-300 border
            ${notification.type === 'success' 
              ? dark ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300' : 'bg-[#dcfce7] border-[#bbf7d0] text-[#166534]'
              : dark ? 'bg-red-500/15 border-red-500/30 text-red-300' : 'bg-[#fee2e2] border-[#fecaca] text-[#991b1b]'}`}>
            <div className={`rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold text-white shadow-sm
              ${notification.type === 'success' ? 'bg-[#22c55e]' : 'bg-[#ef4444]'}`}>
              {notification.type === 'success' ? '✓' : '!'}
            </div>

            <span className="text-sm font-bold tracking-tight">
              {notification.message}
            </span>
          </div>
        )}

        <h1 className={`text-4xl font-black mb-10 tracking-tight ${dark ? 'text-slate-100' : 'text-slate-800'}`}>Manage Media Gallery</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <GalleryForm
            dark={dark}
            editingItem={editingItem}
            onSubmit={handleSubmit}
            onCancel={() => setEditingItem(null)}
          />

          <GalleryTable
            dark={dark}
            items={items}
            onEdit={setEditingItem}
            onDelete={(id) => {
              setItems(items.filter(i => i.id !== id));
              triggerNotification("Item removed successfully", "success");
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AddGallery;