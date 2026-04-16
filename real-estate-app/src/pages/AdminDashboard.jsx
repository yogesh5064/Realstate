import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, 
  ShieldAlert, 
  UserX, 
  UserCheck, 
  Home, 
  Eye, 
  Search,
  XCircle,
  BadgeCheck,
  Clock
} from 'lucide-react';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  const fetchUsers = async () => {
    try {
      const res = await axios.get('https://realstate-41cq.onrender.com/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
      setFilteredUsers(res.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch users");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Search Logic
  useEffect(() => {
    const results = users.filter(user => 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.phone.includes(searchTerm) ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(results);
  }, [searchTerm, users]);

  // Block/Unblock Logic
  const handleBlockToggle = async (userId, currentStatus) => {
    const action = currentStatus ? "Unblock" : "Block";
    if (window.confirm(`Are you sure you want to ${action} this user?`)) {
      try {
        await axios.patch(`https://realstate-41cq.onrender.com/api/admin/users/${userId}/block`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchUsers(); 
      } catch (err) {
        alert("Action failed!");
      }
    }
  };

  // 🔥 NEW: Approval Logic for Professional Dealers
  const handleApproveToggle = async (userId, currentApproval) => {
    const action = currentApproval ? "Unapprove" : "Approve";
    if (window.confirm(`Do you want to ${action} this dealer to list properties?`)) {
      try {
        await axios.patch(`https://realstate-41cq.onrender.com/api/admin/users/${userId}/approve`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchUsers();
      } catch (err) {
        alert("Approval failed: " + (err.response?.data?.message || "Error"));
      }
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-black text-2xl text-blue-600 italic">ADMIN PANEL LOADING...</div>;
  if (error) return <div className="h-screen flex items-center justify-center text-red-600 font-bold">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 bg-gray-50 min-h-screen font-sans">
      {/* 1. Header with Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-gray-900 text-white rounded-[24px] shadow-2xl">
            <ShieldAlert size={30} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Dealer Control Center</h1>
            <p className="text-gray-400 font-bold text-sm">Verify, Block or Monitor Dealers</p>
          </div>
        </div>
        
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text"
            placeholder="Search email or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-100 focus:border-blue-600 rounded-3xl shadow-sm outline-none font-bold transition-all"
          />
        </div>
      </div>

      {/* 2. User Cards */}
      <div className="grid grid-cols-1 gap-4">
        {filteredUsers.map((u) => (
          <div key={u._id} className={`bg-white p-6 rounded-[35px] border-2 transition-all flex flex-col lg:flex-row items-center justify-between gap-6 ${u.isBlocked ? 'border-red-100 opacity-75' : 'border-transparent shadow-sm'}`}>
            
            <div className="flex items-center gap-6 w-full lg:w-auto">
              {/* Avatar with Status Ring */}
              <div className={`relative w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-inner ${u.isBlocked ? 'bg-gray-400' : 'bg-gradient-to-br from-blue-600 to-blue-400'}`}>
                {u.name.charAt(0).toUpperCase()}
                {u.isApproved && u.role === 'professional' && (
                  <div className="absolute -top-2 -right-2 bg-green-500 border-4 border-white rounded-full p-0.5 text-white">
                    <BadgeCheck size={14} />
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                  {u.name}
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-black uppercase ${u.role === 'professional' ? 'bg-purple-100 text-purple-600' : 'bg-orange-100 text-orange-600'}`}>
                    {u.role}
                  </span>
                </h3>
                <p className="text-gray-400 font-bold text-xs">{u.email} | <span className="text-blue-500">{u.phone}</span></p>
                
                <div className="flex gap-2 mt-2">
                  <span className="flex items-center gap-1 text-[10px] font-black text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    <Home size={12}/> {u.propertiesCount || 0} POSTS
                  </span>
                  {u.role === 'professional' && (
                    <span className={`flex items-center gap-1 text-[10px] font-black px-3 py-1 rounded-full ${u.isApproved ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                      {u.isApproved ? 'VERIFIED' : 'PENDING APPROVAL'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              {/* Approval Button (Only for Professional) */}
              {u.role === 'professional' && (
                <button 
                  onClick={() => handleApproveToggle(u._id, u.isApproved)}
                  className={`flex-1 lg:flex-none px-6 py-3 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 ${u.isApproved ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-yellow-500 text-white shadow-lg shadow-yellow-100'}`}
                >
                  {u.isApproved ? <BadgeCheck size={16}/> : <Clock size={16}/>}
                  {u.isApproved ? "Approved Dealer" : "Approve Now"}
                </button>
              )}

              {/* Block Button */}
              <button 
                onClick={() => handleBlockToggle(u._id, u.isBlocked)}
                className={`flex-1 lg:flex-none px-6 py-3 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 ${u.isBlocked ? 'bg-green-600 text-white' : 'bg-red-50 text-red-600 border border-red-100'}`}
              >
                {u.isBlocked ? <UserCheck size={16}/> : <UserX size={16}/>}
                {u.isBlocked ? "Unblock" : "Block User"}
              </button>

              <button className="p-3 bg-gray-100 text-gray-600 rounded-2xl hover:bg-gray-200 transition-all">
                <Eye size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;