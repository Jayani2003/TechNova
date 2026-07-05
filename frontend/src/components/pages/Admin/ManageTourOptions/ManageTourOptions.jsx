import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, MapPin, Zap } from 'lucide-react';
import { AuthContext } from '../../../../context/AuthContext';
import { useOutletContext } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ManageTourOptions = () => {
  const dark = useOutletContext()?.dark ?? false;
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
    <div className="w-full">
      <div className="max-w-[1320px] mx-auto px-6 space-y-6 pb-12">
        {/* HERO SECTION */}
        <div
          className={[
            'rounded-2xl border p-6 md:p-7',
            dark ? 'bg-slate-800/60 border-white/8' : 'bg-white border-slate-100 shadow-sm',
          ].join(' ')}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className={`font-extrabold text-[28px] leading-tight ${dark ? 'text-slate-100' : 'text-slate-800'}`}>
                Tour Options
              </h1>
              <p className={`text-[13px] mt-2 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                Manage destinations and activities for custom tours
              </p>
              
              <div className="flex flex-wrap gap-2 mt-4">
                <div className={[
                    'inline-flex items-center gap-2 px-3 py-1.5 rounded-full border cursor-pointer transition-colors',
                    activeTab === 'cities'
                      ? dark ? 'bg-[#00b0a5]/20 border-[#00b0a5]' : 'bg-white border-[#00b0a5] shadow-sm'
                      : dark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-slate-200 hover:bg-slate-50'
                  ].join(' ')}
                  onClick={() => { setActiveTab('cities'); setError(''); setSuccess(''); setNewItem(''); }}
                >
                  <span className={`text-[14px] font-extrabold leading-none ${activeTab === 'cities' ? 'text-[#00b0a5]' : (dark ? 'text-slate-400' : 'text-slate-500')}`}>
                    {cities.length}
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${activeTab === 'cities' ? 'text-[#00b0a5]' : (dark ? 'text-slate-400' : 'text-slate-500')}`}>
                    Cities
                  </span>
                </div>
                <div className={[
                    'inline-flex items-center gap-2 px-3 py-1.5 rounded-full border cursor-pointer transition-colors',
                    activeTab === 'activities'
                      ? dark ? 'bg-[#00b0a5]/20 border-[#00b0a5]' : 'bg-white border-[#00b0a5] shadow-sm'
                      : dark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-slate-200 hover:bg-slate-50'
                  ].join(' ')}
                  onClick={() => { setActiveTab('activities'); setError(''); setSuccess(''); setNewItem(''); }}
                >
                  <span className={`text-[14px] font-extrabold leading-none ${activeTab === 'activities' ? 'text-[#00b0a5]' : (dark ? 'text-slate-400' : 'text-slate-500')}`}>
                    {activities.length}
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${activeTab === 'activities' ? 'text-[#00b0a5]' : (dark ? 'text-slate-400' : 'text-slate-500')}`}>
                    Activities
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ALERTS */}
        {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
        {success && <div className="p-3 bg-green-100 text-green-700 rounded-lg text-sm">{success}</div>}

        {/* ADD NEW SECTION */}
        <div className={[
            'rounded-2xl border p-6',
            dark ? 'bg-[#0f172a] border-white/8' : 'bg-white border-slate-100 shadow-sm',
          ].join(' ')}>
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
                className={[
                  'w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition-all focus:ring-2 focus:ring-[#00b0a5]',
                  dark ? 'bg-slate-800/50 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-[#00b0a5]'
                ].join(' ')}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-[#00b0a5] text-white px-6 py-3 text-[12px] font-bold uppercase tracking-wider transition-all duration-200 hover:bg-[#009e94] hover:-translate-y-0.5 disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              {loading ? 'Adding...' : 'Add'}
            </button>
          </form>
        </div>

        {/* TABLE SECTION */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={[
              'rounded-2xl border overflow-hidden',
              dark ? 'bg-[#0f172a] border-white/8' : 'bg-white border-slate-100 shadow-sm',
            ].join(' ')}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={dark ? 'bg-slate-800/40 border-b border-white/8' : 'bg-white border-b border-slate-100'}>
                    <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-[#00b0a5]">ID</th>
                    <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-[#00b0a5]">Name</th>
                    <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-[#00b0a5] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {currentList.map((item) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-800/30 bg-white dark:bg-transparent transition-colors group ${dark ? 'text-slate-300' : 'text-slate-600'}`}
                    >
                      <td className="px-6 py-4 text-xs font-semibold opacity-60">#{item.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${dark ? 'bg-teal-900/30 text-teal-400' : 'bg-teal-50 text-[#00b0a5]'}`}>
                            {currentIcon}
                          </div>
                          <span className="font-semibold text-sm">{item.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title={`Delete ${activeTab === 'cities' ? 'City' : 'Activity'}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                  {currentList.length === 0 && !loading && (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-sm opacity-50">
                        No {activeTab} found. Add some to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ManageTourOptions;
