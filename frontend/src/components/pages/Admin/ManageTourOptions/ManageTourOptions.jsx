import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, MapPin, Zap } from 'lucide-react';
import { AuthContext } from '../../../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ManageTourOptions = () => {
  const { getToken } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('cities'); // 'cities' or 'activities'

  const [cities, setCities] = useState([]);
  const [activities, setActivities] = useState([]);
  const [newItem, setNewItem] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchItems = async () => {
    try {
      setLoading(true);
      const [citiesRes, activitiesRes] = await Promise.all([
        fetch(`${API_URL}/cities`),
        fetch(`${API_URL}/activities`)
      ]);
      
      if (citiesRes.ok) {
        const citiesData = await citiesRes.json();
        setCities(citiesData.sort((a, b) => a.name.localeCompare(b.name)));
      }
      
      if (activitiesRes.ok) {
        const activitiesData = await activitiesRes.json();
        setActivities(activitiesData.sort((a, b) => a.name.localeCompare(b.name)));
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const endpoint = activeTab === 'cities' ? '/cities' : '/activities';
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ name: newItem })
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `Failed to add ${activeTab.slice(0, -1)}`);
      }

      if (activeTab === 'cities') {
        setCities([...cities, data].sort((a, b) => a.name.localeCompare(b.name)));
      } else {
        setActivities([...activities, data].sort((a, b) => a.name.localeCompare(b.name)));
      }
      
      setNewItem('');
      setSuccess(`${activeTab === 'cities' ? 'City' : 'Activity'} added successfully!`);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (id) => {
    const itemName = activeTab === 'cities' ? 'city' : 'activity';
    if (!window.confirm(`Are you sure you want to delete this ${itemName}?`)) return;
    
    setError('');
    setSuccess('');
    
    try {
      const endpoint = activeTab === 'cities' ? `/cities/${id}` : `/activities/${id}`;
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete ${itemName}`);
      }

      if (activeTab === 'cities') {
        setCities(cities.filter(c => c.id !== id));
      } else {
        setActivities(activities.filter(a => a.id !== id));
      }
      setSuccess(`${itemName === 'city' ? 'City' : 'Activity'} deleted successfully!`);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const currentList = activeTab === 'cities' ? cities : activities;
  const currentIcon = activeTab === 'cities' ? <MapPin className="h-5 w-5 text-[#00b0a5]" /> : <Zap className="h-5 w-5 text-[#00b0a5]" />;

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-black tracking-tight" style={{ color: 'black' }}>Tour Options</h1>
          <p className="mt-1 font-medium text-black" style={{ color: 'black' }}>Manage destinations and activities for custom tours</p>
        </div>
      </div>

      <div className="flex gap-4 mb-6 border-b border-slate-200 dark:border-slate-700">
        <button
          onClick={() => { setActiveTab('cities'); setError(''); setSuccess(''); setNewItem(''); }}
          className={`px-6 py-3 font-bold transition-all border-b-2 ${activeTab === 'cities' ? 'border-[#00b0a5] text-[#00b0a5]' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
        >
          Cities
        </button>
        <button
          onClick={() => { setActiveTab('activities'); setError(''); setSuccess(''); setNewItem(''); }}
          className={`px-6 py-3 font-bold transition-all border-b-2 ${activeTab === 'activities' ? 'border-[#00b0a5] text-[#00b0a5]' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
        >
          Activities
        </button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">{success}</div>}

      <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 mb-8">
        <form onSubmit={handleAddItem} className="flex gap-4">
          <div className="flex-1 relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400">
               {activeTab === 'cities' ? <MapPin /> : <Zap />}
            </div>
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder={`Enter new ${activeTab === 'cities' ? 'city' : 'activity'} name...`}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-[#242424] border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#00b0a5] outline-none text-slate-800 dark:text-white"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-[#00b0a5] hover:bg-[#008f86] text-white rounded-xl font-medium transition-colors disabled:opacity-50"
          >
            <Plus className="h-5 w-5" />
            {loading ? 'Adding...' : 'Add'}
          </motion.button>
        </form>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden"
        >
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-[#242424] border-b border-slate-100 dark:border-slate-700">
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">ID</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Name</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentList.map((item) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-[#242424] transition-colors group"
                >
                  <td className="px-6 py-4 text-sm font-medium text-slate-400">#{item.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center">
                        {currentIcon}
                      </div>
                      <span className="font-semibold text-slate-700 dark:text-slate-200">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title={`Delete ${activeTab === 'cities' ? 'City' : 'Activity'}`}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </motion.tr>
              ))}
              {currentList.length === 0 && !loading && (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                    No {activeTab} found. Add some to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ManageTourOptions;
