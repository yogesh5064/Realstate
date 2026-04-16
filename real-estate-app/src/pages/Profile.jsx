import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import { 
  User, Mail, Phone, LogOut, Edit, X, Key, PlusCircle, LayoutDashboard, 
  Search, Lock, Heart, Loader2, Camera
} from 'lucide-react';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('listings');
  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]); 
  const [wishlist, setWishlist] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); 
  const [loading, setLoading] = useState(true);
  
  // Modals States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isPropertyEditModalOpen, setIsPropertyEditModalOpen] = useState(false);
  
  // Form States
  const [editData, setEditData] = useState({ name: '', phone: '' });
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '' });
  const [selectedProperty, setSelectedProperty] = useState(null); 
  const [updateLoading, setUpdateLoading] = useState(false);

  // 🔥 PHOTO EDIT STATE
  const [editFiles, setEditFiles] = useState([]);

  const API_BASE_URL = 'http://localhost:5000/api';
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      fetchData();
    } else {
      window.location.href = '/login';
    }
  }, [token]);

  const fetchData = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const userRes = await axios.get(`${API_BASE_URL}/auth/profile`, config);
      const currentUser = userRes.data;
      setUser(currentUser);
      setEditData({ name: currentUser.name, phone: currentUser.phone || '' });

      const propRoute = currentUser.role === 'admin' ? '/properties' : '/properties/my-properties';
      const propRes = await axios.get(`${API_BASE_URL}${propRoute}`, config);
      setProperties(propRes.data);

      if (currentUser.role !== 'admin') {
        const wishlistRes = await axios.get(`${API_BASE_URL}/properties/wishlist`, config);
        setWishlist(wishlistRes.data);
      }
    } catch (err) {
      console.error("Fetch Error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- PROPERTY ACTIONS ---

  const handleEditClick = (property) => {
    setSelectedProperty({ ...property });
    setEditFiles([]); // Reset files when modal opens
    setIsPropertyEditModalOpen(true);
  };

  const handleUpdateProperty = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    try {
      // 🔥 PHOTO EDIT: Using FormData instead of JSON
      const formData = new FormData();
      formData.append('title', selectedProperty.title);
      formData.append('description', selectedProperty.description);
      formData.append('price', selectedProperty.price);
      formData.append('location', selectedProperty.location);
      formData.append('area', selectedProperty.area);
      
      // Add new images if selected
      if (editFiles.length > 0) {
        editFiles.forEach(file => {
          formData.append('images', file);
        });
      }

      const config = { 
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data' 
        } 
      };

      const res = await axios.put(`${API_BASE_URL}/properties/${selectedProperty._id}`, formData, config);
      
      setProperties(properties.map(p => p._id === selectedProperty._id ? res.data : p));
      setIsPropertyEditModalOpen(false);
      alert("Property Updated Successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.patch(`${API_BASE_URL}/properties/${id}/status`, {}, config);
      setProperties(properties.map(p => p._id === id ? { ...p, status: res.data.status } : p));
    } catch (err) {
      alert("Status update failed!");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      try {
        await axios.delete(`${API_BASE_URL}/properties/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProperties(properties.filter(p => p._id !== id));
      } catch (err) {
        alert("Delete failed!");
      }
    }
  };

  // --- SEARCH LOGIC ---
  const filteredProperties = properties.filter(p => {
    const term = searchQuery.toLowerCase().trim();
    if (!term) return true;
    return (
      p._id.toLowerCase().includes(term) || 
      p.title.toLowerCase().includes(term) || 
      p.location.toLowerCase().includes(term)
    );
  });

  // --- PROFILE ACTIONS ---
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.put(`${API_BASE_URL}/auth/profile`, editData, config);
      setUser(res.data);
      setIsEditModalOpen(false);
      alert("Profile Updated!");
    } catch (err) {
      alert("Update Failed");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`${API_BASE_URL}/auth/reset-password`, passwords, config);
      alert("Password changed successfully!");
      setIsPasswordModalOpen(false);
      setPasswords({ oldPassword: '', newPassword: '' });
    } catch (err) {
      alert(err.response?.data?.message || "Password reset failed");
    }
  };

  const isAdmin = user?.role === 'admin';

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-gray-50 italic font-black text-blue-600 animate-pulse">
        LOADING SYSTEM DATA...
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 bg-gray-50 min-h-screen font-sans">
      
      {/* --- USER PROFILE CARD --- */}
      <div className="bg-white rounded-[45px] p-8 md:p-12 shadow-2xl flex flex-col md:flex-row items-center gap-8 relative border border-white">
        <div className="relative">
          <div className={`w-32 h-32 rounded-[40px] flex items-center justify-center text-white shadow-2xl rotate-3 font-black text-5xl transition-transform hover:rotate-0 duration-500 ${isAdmin ? 'bg-red-600 shadow-red-100' : 'bg-blue-600 shadow-blue-100'}`}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <button onClick={() => setIsEditModalOpen(true)} className="absolute -bottom-2 -right-2 p-3 bg-white text-blue-600 rounded-2xl shadow-xl hover:scale-110 transition-transform border border-blue-50">
            <Edit size={20} />
          </button>
        </div>

        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3">
             <h1 className="text-4xl font-black text-gray-900 capitalize tracking-tight">{user?.name}</h1>
             {isAdmin && <span className="bg-red-100 text-red-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Administrator</span>}
          </div>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
            <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-2xl text-gray-600 font-bold text-sm border border-gray-100">
              <Mail size={16} className="text-blue-500" /> {user?.email}
            </div>
            <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-2xl text-gray-600 font-bold text-sm border border-gray-100">
              <Phone size={16} className="text-green-500" /> {user?.phone || 'No Phone'}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full md:w-auto">
          <div className="flex gap-2">
             <button onClick={() => setIsPasswordModalOpen(true)} className="flex-1 bg-blue-50 text-blue-600 px-6 py-4 rounded-2xl hover:bg-blue-600 hover:text-white transition-all font-black flex items-center justify-center gap-2 text-sm">
                <Key size={18} /> Password
             </button>
             <button onClick={() => { localStorage.clear(); window.location.href='/'; }} className="bg-red-50 text-red-500 p-4 rounded-2xl hover:bg-red-500 hover:text-white transition-all">
                <LogOut size={22} />
             </button>
          </div>
          <Link to="/post" className="bg-gray-900 text-white px-6 py-4 rounded-2xl font-black flex items-center justify-center gap-2 text-sm hover:bg-blue-600 transition-all shadow-xl shadow-gray-200">
             <PlusCircle size={18} /> Post Property
          </Link>
        </div>
      </div>

      {/* --- TABS & SEARCH --- */}
      <div className="mt-16 mb-10 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex bg-white p-2 rounded-[24px] shadow-sm border border-gray-100 w-fit">
            <button 
              onClick={() => setActiveTab('listings')} 
              className={`px-8 py-4 rounded-[20px] font-black text-sm transition-all flex items-center gap-2 ${activeTab === 'listings' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}
            >
              <LayoutDashboard size={18}/> {isAdmin ? 'All Listings' : 'My Items'} ({filteredProperties.length})
            </button>
            
            {!isAdmin && (
              <button 
                onClick={() => setActiveTab('wishlist')} 
                className={`px-8 py-4 rounded-[20px] font-black text-sm transition-all flex items-center gap-2 ${activeTab === 'wishlist' ? 'bg-red-500 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}
              >
                <Heart size={18}/> Wishlist ({wishlist.length})
              </button>
            )}
        </div>

        <div className="relative w-full md:w-96">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search ID, Title or Location..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-5 bg-white border-2 border-transparent rounded-[28px] font-bold text-sm outline-none focus:border-blue-600 shadow-xl transition-all"
          />
        </div>
      </div>

      {/* --- LISTINGS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {activeTab === 'listings' ? (
          filteredProperties.length > 0 ? (
            filteredProperties.map(property => (
              <PropertyCard 
                key={property._id} 
                property={property} 
                isProfileView={true} 
                isAdmin={isAdmin}
                onDelete={handleDelete}
                onSoldOut={handleToggleStatus}
                onEdit={handleEditClick}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-32 bg-white rounded-[50px] border-4 border-dashed border-gray-100">
                <Search size={50} className="text-gray-200 mx-auto mb-6" />
                <h3 className="text-2xl font-black text-gray-400">No matching listings found</h3>
            </div>
          )
        ) : (
          wishlist.length > 0 ? (
            wishlist.map(property => (
              <PropertyCard 
                key={property._id} 
                property={property} 
                isProfileView={false} 
              />
            ))
          ) : (
            <div className="col-span-full text-center py-32 bg-white rounded-[50px] border border-gray-100">
              <Heart size={60} className="mx-auto text-red-100 mb-6" />
              <h3 className="text-2xl font-black text-gray-900 mb-2">Wishlist is Empty</h3>
            </div>
          )
        )}
      </div>

      {/* --- MODAL: EDIT PROPERTY --- */}
      {isPropertyEditModalOpen && selectedProperty && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[300] flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] w-full max-w-2xl p-8 md:p-12 relative shadow-2xl overflow-y-auto max-h-[90vh]">
            <button onClick={() => setIsPropertyEditModalOpen(false)} className="absolute top-8 right-8 text-gray-400 hover:text-gray-900 bg-gray-100 p-2 rounded-full">
              <X size={24} />
            </button>
            <h2 className="text-3xl font-black mb-8 text-gray-900 italic">Edit Listing Details</h2>
            
            <form onSubmit={handleUpdateProperty} className="space-y-5">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Property Title</label>
                <input type="text" className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-blue-600 outline-none font-bold"
                  value={selectedProperty.title} onChange={(e) => setSelectedProperty({...selectedProperty, title: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Price (₹)</label>
                  <input type="number" className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-blue-600 outline-none font-bold"
                    value={selectedProperty.price} onChange={(e) => setSelectedProperty({...selectedProperty, price: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Area (sq.ft)</label>
                  <input type="number" className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-blue-600 outline-none font-bold"
                    value={selectedProperty.area} onChange={(e) => setSelectedProperty({...selectedProperty, area: e.target.value})} />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Location</label>
                <input type="text" className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-blue-600 outline-none font-bold"
                  value={selectedProperty.location} onChange={(e) => setSelectedProperty({...selectedProperty, location: e.target.value})} />
              </div>

              {/* 🔥 NEW: PHOTO UPDATE SECTION */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Update Photos (Optional)</label>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                  <Camera className="text-blue-600" size={24} />
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*"
                    onChange={(e) => setEditFiles(Array.from(e.target.files))}
                    className="text-sm font-bold text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                  />
                </div>
                {editFiles.length > 0 && (
                  <p className="text-xs text-green-600 font-black ml-1 uppercase tracking-tighter">
                    {editFiles.length} new photos ready for upload
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                <textarea className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-blue-600 outline-none font-bold h-32"
                  value={selectedProperty.description} onChange={(e) => setSelectedProperty({...selectedProperty, description: e.target.value})}></textarea>
              </div>

              <button type="submit" disabled={updateLoading} className="w-full bg-blue-600 text-white py-5 rounded-[24px] font-black text-lg shadow-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                {updateLoading ? <><Loader2 className="animate-spin" /> Updating Listing...</> : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: EDIT PROFILE --- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center p-6">
          <div className="bg-white rounded-[40px] w-full max-w-md p-10 relative shadow-2xl">
            <button onClick={() => setIsEditModalOpen(false)} className="absolute top-8 right-8 text-gray-400 hover:text-gray-900 bg-gray-100 p-2 rounded-full">
              <X size={24} />
            </button>
            <h2 className="text-3xl font-black mb-6 text-gray-900">Edit Profile</h2>
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <input type="text" className="w-full p-5 bg-gray-50 border-2 border-transparent rounded-[24px] font-bold outline-none focus:border-blue-600 transition-all" value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} placeholder="Full Name" required />
              <input type="text" className="w-full p-5 bg-gray-50 border-2 border-transparent rounded-[24px] font-bold outline-none focus:border-blue-600 transition-all" value={editData.phone} onChange={(e) => setEditData({...editData, phone: e.target.value})} placeholder="Phone Number" />
              <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-[24px] font-black text-lg">Save Profile</button>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: RESET PASSWORD --- */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center p-6">
          <div className="bg-white rounded-[40px] w-full max-w-md p-10 relative shadow-2xl">
            <button onClick={() => setIsPasswordModalOpen(false)} className="absolute top-8 right-8 text-gray-400 hover:text-gray-900 bg-gray-100 p-2 rounded-full">
              <X size={24} />
            </button>
            <h2 className="text-3xl font-black mb-6 text-gray-900">Security</h2>
            <form onSubmit={handleResetPassword} className="space-y-6">
              <input type="password" placeholder="Old Password" className="w-full p-5 bg-gray-50 border-2 border-transparent rounded-[24px] font-bold outline-none focus:border-blue-600" value={passwords.oldPassword} onChange={(e) => setPasswords({...passwords, oldPassword: e.target.value})} required />
              <input type="password" placeholder="New Password" className="w-full p-5 bg-gray-50 border-2 border-transparent rounded-[24px] font-bold outline-none focus:border-blue-600" value={passwords.newPassword} onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})} required />
              <button type="submit" className="w-full bg-gray-900 text-white py-5 rounded-[24px] font-black text-lg flex items-center justify-center gap-2">
                <Lock size={18} /> Update Password
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;