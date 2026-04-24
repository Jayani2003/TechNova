import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import GalleryForm from './GalleryForm';
import GalleryTable from './GalleryTable';

const AddGallery = () => {
  const dark = useOutletContext()?.dark ?? false;
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success'
  });

  // 1. Load data from backend on component mount
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/gallery');
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("Error fetching gallery:", error);
    }
  };

  const triggerNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification(prev => ({ ...prev, show: false })), 3000);
  };

  // 2. Handle Create and Update
  const handleSubmit = async (formData) => {
    // We use FormData to handle the physical image file
    const data = new FormData();
    data.append('title', formData.title);
    data.append('category', formData.category);
    data.append('description', formData.description);
    
    // Ensure 'image' matches the key your backend Multer middleware expects
    if (formData.file) {
      data.append('image', formData.file);
    }

    try {
      const url = editingItem 
        ? `http://localhost:5000/api/gallery/${editingItem.id}` 
        : 'http://localhost:5000/api/gallery';
      
      const method = editingItem ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        body: data, // No JSON.stringify for FormData
      });

      if (!response.ok) throw new Error('Failed to save item');

      const savedItem = await response.json();

      if (editingItem) {
        setItems(items.map(item => item.id === editingItem.id ? savedItem : item));
        triggerNotification("Changes applied successfully!", "success");
      } else {
        setItems([savedItem, ...items]);
        triggerNotification("New image published to Cloudinary!", "success");
      }
      setEditingItem(null);
    } catch (error) {
      console.error("Submit error:", error);
      triggerNotification("Error connecting to server", "error");
    }
  };

  // 3. Handle Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/gallery/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setItems(items.filter(i => i.id !== id));
        triggerNotification("Item removed successfully", "success");
      } else {
        throw new Error('Delete failed');
      }
    } catch (error) {
      triggerNotification("Could not delete item", "error");
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
            <span className="text-sm font-bold tracking-tight">{notification.message}</span>
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
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default AddGallery;