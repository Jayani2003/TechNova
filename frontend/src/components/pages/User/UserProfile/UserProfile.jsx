import React, { useContext, useState } from 'react';
import { AuthContext } from '../../../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router';
import { 
  Camera, Mail, User as UserIcon, Phone, MapPin, Globe, Hash, 
  Edit3, Check, LayoutDashboard, CreditCard, Shield, CalendarDays, Lock, 
  CreditCard as CardIcon, MessageCircle
} from 'lucide-react';
import MyMessageList from '../MyMessages/MyMessageList';
import MyMessageThread from '../MyMessages/MyMessageThread';
import MyMessageEmpty from '../MyMessages/MyMessageEmpty';
import { useMessages } from '../../../../context/MessagesContext.jsx';

function UserProfile() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Tab State
  const [activeTab, setActiveTab] = useState('dashboard');

  // State for profile fields (defaults to empty strings if not updated yet)
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    contactNumber: '',
    address: '',
    country: '',
    zipcode: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // Add logic here to save to backend in the future
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  // Field Config for rendering mapping
  const formFields = [
    { label: 'Full Name', name: 'name', type: 'text', icon: UserIcon, placeholder: 'E.g. John Doe' },
    { label: 'Email Address', name: 'email', type: 'email', icon: Mail, placeholder: 'E.g. john@example.com' },
    { label: 'Contact Number', name: 'contactNumber', type: 'tel', icon: Phone, placeholder: 'E.g. +94 77 123 4567' },
    { label: 'Street Address', name: 'address', type: 'text', icon: MapPin, placeholder: 'E.g. 123 Main St, City' },
    { label: 'Country', name: 'country', type: 'text', icon: Globe, placeholder: 'E.g. Sri Lanka' },
    { label: 'Zip/Postal Code', name: 'zipcode', type: 'text', icon: Hash, placeholder: 'E.g. 10000' },
  ];

  // Navigation Data
  const navTabs = [
    { id: 'dashboard', label: 'My Dashboard', icon: LayoutDashboard },
    { id: 'bookings', label: 'My Bookings', icon: CalendarDays },
    { id: 'messages', label: 'My Messages', icon: MessageCircle },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  // ================= TABS COMPONENTS =================

  const DashboardTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
    >
      <div className="px-8 pt-10 pb-6 flex flex-col sm:flex-row items-center justify-between border-b border-slate-100/50 relative">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative group">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white shadow-xl flex items-center justify-center overflow-hidden bg-slate-100 relative">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300" />
              )}
              {isEditing && (
                <label className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Camera className="w-6 h-6 text-white" />
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              )}
            </div>
            <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
          </div>

          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {profileData.name || 'Your Profile'}
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-1 flex items-center justify-center sm:justify-start gap-1">
              <Mail className="w-4 h-4" /> {user?.email || 'user@example.com'}
            </p>
          </div>
        </div>
        
        <div className="mt-6 sm:mt-0">
          {isEditing ? (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              className="flex items-center gap-2 bg-[#00b0a5] hover:bg-[#009b91] text-white px-6 py-2.5 rounded-full font-semibold shadow-md shadow-[#00b0a5]/20 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" /> Save Changes
            </motion.button>
          ) : (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-2.5 rounded-full font-semibold transition-all cursor-pointer"
            >
              <Edit3 className="w-4 h-4" /> Edit Profile
            </motion.button>
          )}
        </div>
      </div>

      <div className="p-8 sm:p-10">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-1">Personal Information</h2>
          <p className="text-sm text-slate-500">Manage your personal details and contact information.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
          {formFields.map((field, idx) => (
            <motion.div 
              key={field.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="space-y-2"
            >
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <field.icon className="w-4 h-4 text-[#00b0a5]" />
                {field.label}
              </label>
              
              {isEditing ? (
                <input
                  type={field.type}
                  name={field.name}
                  value={profileData[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-[#00b0a5]/50 focus:border-[#00b0a5] transition-all shadow-sm outline-none"
                />
              ) : (
                <div className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-xl text-slate-900 text-sm min-h-[46px] shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
                  {profileData[field.name] ? (
                    <span className="font-medium text-slate-800">{profileData[field.name]}</span>
                  ) : (
                    <span className="text-slate-400 italic">Not set</span>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {!isEditing && (
           <div className="mt-10 p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-3">
             <div className="min-w-fit mt-0.5">
               <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
             </div>
             <div>
               <h4 className="text-sm font-semibold text-blue-900">Keeping your profile updated</h4>
               <p className="text-sm text-blue-700 mt-1">
                 Make sure your contact information is accurate. This helps us communicate with you regarding your bookings and personalized tours.
               </p>
             </div>
           </div>
        )}
      </div>
    </motion.div>
  );

  const BookingsTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="p-8 sm:p-10 h-full flex flex-col pt-16"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">My Bookings</h2>
        <p className="text-slate-500">View and manage all your past and upcoming tours.</p>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50">
        <div className="w-20 h-20 bg-slate-100 text-slate-300 rounded-full flex items-center justify-center mb-6">
          <CalendarDays size={40} />
        </div>
        <h3 className="text-xl font-semibold text-slate-800 mb-2">No bookings yet</h3>
        <p className="text-slate-500 max-w-sm">We'll show your tour itinerary and booking history here once you make a reservation.</p>
      </div>
    </motion.div>
  );

// adding messages tab
  const MessagesTab = () => {
    const { messages, addReply } = useMessages();
    const [selectedId, setSelectedId] = useState(null);
 
    const userMessages = messages.filter((m) => m.customerId === user?.email);
    const selectedMessage = userMessages.find((m) => m.id === selectedId) || null;
 
    const handleSendFollowUp = (messageId, text) => {
      addReply(messageId, {
        from: 'customer',
        fromName: user?.name || user?.email,
        message: text,
      });
    };
 
    return (
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }}
        className="p-8 sm:p-10 h-full flex flex-col">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-1">My Messages</h2>
          <p className="text-slate-500 text-sm">View your conversations with support.</p>
        </div>
 
        {userMessages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50">
            <MyMessageEmpty navigate={navigate} />
          </div>
        ) : (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
            <MyMessageList
              messages={userMessages}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
            <MyMessageThread
              message={selectedMessage}
              onSendFollowUp={handleSendFollowUp}
            />
          </div>
        )}
      </motion.div>
    );
  };

const PaymentsTab = () => {
    const [savedCards, setSavedCards] = useState([
      { id: 1, name: 'John Doe', last4: '4242', expiry: '12/25' },
    ]);
    const [isAddingCard, setIsAddingCard] = useState(false);
    const [newCard, setNewCard] = useState({ name: '', number: '', expiry: '', cvv: '' });

    const handleAddCard = (e) => {
      e.preventDefault();
      if (!newCard.number || newCard.number.length < 4) return;
      
      setSavedCards([...savedCards, {
        id: Date.now(),
        name: newCard.name,
        last4: newCard.number.substring(newCard.number.length - 4),
        expiry: newCard.expiry
      }]);
      setIsAddingCard(false);
      setNewCard({ name: '', number: '', expiry: '', cvv: '' });
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.3 }}
        className="p-8 sm:p-10 h-full flex flex-col"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Payment Methods</h2>
            <p className="text-slate-500 text-sm">Manage your saved cards and payment history.</p>
          </div>
          {!isAddingCard && (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsAddingCard(true)}
              className="flex items-center gap-2 bg-[#00b0a5] hover:bg-[#009b91] text-white px-5 py-2.5 rounded-full font-semibold shadow-md shadow-[#00b0a5]/20 transition-all text-sm cursor-pointer"
            >
              + Add New Card
            </motion.button>
          )}
        </div>

        {isAddingCard ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-50 border border-slate-100 rounded-3xl p-6 sm:p-8"
          >
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <CardIcon className="w-5 h-5 text-[#00b0a5]"/> Add Credit Card
            </h3>
            <form onSubmit={handleAddCard} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Cardholder Name</label>
                <input 
                  type="text" required placeholder="E.g. John Doe"
                  value={newCard.name} onChange={(e) => setNewCard({...newCard, name: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-[#00b0a5]/50 focus:border-[#00b0a5] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Card Number</label>
                <input 
                  type="text" required placeholder="0000 0000 0000 0000" maxLength="19"
                  value={newCard.number} onChange={(e) => setNewCard({...newCard, number: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-[#00b0a5]/50 focus:border-[#00b0a5] outline-none tracking-widest font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Expiry Date</label>
                  <input 
                    type="text" required placeholder="MM/YY" maxLength="5"
                    value={newCard.expiry} onChange={(e) => setNewCard({...newCard, expiry: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-[#00b0a5]/50 focus:border-[#00b0a5] outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">CVV</label>
                  <input 
                    type="password" required placeholder="123" maxLength="4"
                    value={newCard.cvv} onChange={(e) => setNewCard({...newCard, cvv: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-[#00b0a5]/50 focus:border-[#00b0a5] outline-none font-mono"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsAddingCard(false)} className="flex-1 px-4 py-3 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="flex-1 px-4 py-3 bg-[#00b0a5] text-white font-semibold rounded-xl hover:bg-[#009b91] shadow-md shadow-[#00b0a5]/20 transition-all cursor-pointer">
                  Save Card
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {savedCards.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50">
                <div className="w-16 h-16 bg-slate-100 text-slate-300 rounded-full flex items-center justify-center mb-4">
                  <CardIcon size={32} />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-1">No saved cards</h3>
                <p className="text-sm text-slate-500">Add a credit or debit card to make future bookings faster.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {savedCards.map(card => (
                  <motion.div 
                    key={card.id}
                    className="flex items-center justify-between p-5 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-5">
                      <div className="hidden sm:flex w-12 h-8 bg-slate-100 rounded border border-slate-200 items-center justify-center">
                        <CardIcon className="w-5 h-5 text-slate-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 tracking-wide">
                          •••• •••• •••• {card.last4}
                        </p>
                        <p className="text-sm text-slate-500 mt-0.5">
                          {card.name} <span className="mx-2">•</span> Expires {card.expiry}
                        </p>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => setSavedCards(savedCards.filter(c => c.id !== card.id))}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                      title="Remove Card"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </motion.div>
    );
  };

  const SecurityTab = () => {
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
    const [message, setMessage] = useState({ type: '', text: '' });

    const handlePasswordChange = (e) => {
      e.preventDefault();
      if (passwords.new !== passwords.confirm) {
        setMessage({ type: 'error', text: 'New passwords do not match.' });
        return;
      }
      if (passwords.new.length < 5) {
        setMessage({ type: 'error', text: 'Password must be at least 6 characters long.' });
        return;
      }
      // Simulate backend update
      setMessage({ type: 'success', text: 'Password successfully updated!' });
      setPasswords({ current: '', new: '', confirm: '' });
      
      // Clear success message after 4 seconds
      setTimeout(() => setMessage({ type: '', text: '' }), 4000);
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.3 }}
        className="p-8 sm:p-10 h-full flex flex-col"
      >
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Security & Privacy</h2>
          <p className="text-slate-500">Update your password to keep your account secure.</p>
        </div>
        
        <div className="flex-1 max-w-2xl">
          <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 sm:p-8">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#00b0a5]"/> Change Password
            </h3>
            
            {message.text && (
              <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 border ${
                message.type === 'error' ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'
              }`}>
                {message.type === 'success' ? (
                  <Check className="w-5 h-5 text-green-500 mt-0.5 min-w-fit" />
                ) : (
                  <svg className="w-5 h-5 text-red-500 mt-0.5 min-w-fit" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                <p className={`text-sm font-medium ${message.type === 'error' ? 'text-red-800' : 'text-green-800'}`}>
                  {message.text}
                </p>
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Current Password</label>
                <input 
                  type="password" required placeholder="••••••••"
                  value={passwords.current} onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-[#00b0a5]/50 focus:border-[#00b0a5] outline-none transition-all"
                />
              </div>
              
              <div className="pt-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1">New Password</label>
                <input 
                  type="password" required placeholder="••••••••"
                  value={passwords.new} onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-[#00b0a5]/50 focus:border-[#00b0a5] outline-none transition-all"
                />
                <p className="text-xs text-slate-500 mt-2">Make sure it's at least 6 characters long.</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Confirm New Password</label>
                <input 
                  type="password" required placeholder="••••••••"
                  value={passwords.confirm} onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-[#00b0a5]/50 focus:border-[#00b0a5] outline-none transition-all"
                />
              </div>
              
              <div className="pt-4">
                <button type="submit" className="px-6 py-3 bg-[#00b0a5] text-white font-semibold rounded-xl hover:bg-[#009b91] shadow-md shadow-[#00b0a5]/20 transition-all cursor-pointer">
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    );
  };


  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 flex justify-center bg-slate-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-80 bg-gradient-to-br from-[#00b0a5] to-[#007b73] -z-10 shadow-lg" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl z-[-1]" />
      
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-8 z-10">
        
        {/* Sidebar Menu */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-6 md:sticky md:top-28">
            <div className="mb-8 hidden md:block">
               <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Profile Navigation</h3>
            </div>
            <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              {navTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === tab.id 
                      ? 'bg-[#00b0a5] text-white shadow-md shadow-[#00b0a5]/20' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-white' : 'text-slate-400'}`} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden min-h-[600px]">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && <DashboardTab key="dashboard" />}
            {activeTab === 'bookings' && <BookingsTab key="bookings" />}
            {activeTab === 'messages' && <MessagesTab key="messages" />}
            {activeTab === 'payments' && <PaymentsTab key="payments" />}
            {activeTab === 'security' && <SecurityTab key="security" />}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}

export default UserProfile;
