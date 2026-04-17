import React, { useState, useEffect } from 'react';
import { 
  MapPin, MessageCircle, X, Eye, 
} from 'lucide-react';

const PropertyCard = ({ property, onDelete, onSoldOut, onEdit, isProfileView, isAdmin }) => {
  const [showMore, setShowMore] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const ADMIN_CONTACT = "8690385064";
  const currentUserId = localStorage.getItem('userId');

  // Popup khulne par background scroll lock karne ke liye
  useEffect(() => {
    if (showMore) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [showMore]);

  const getFullImageUrl = () => {
    if (!property.images || property.images.length === 0) return "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800";
    const baseURL = "https://realstate-41cq.onrender.com";
    const fileName = property.images[0].replace(/\\/g, '/').split('/').pop();
    return `${baseURL}/uploads/${fileName}`;
  };

  const isOwnerOrAdmin = isAdmin || (property.seller?._id === currentUserId || property.seller === currentUserId);
  const displayContact = isOwnerOrAdmin ? (property.phone || property.seller?.phone || ADMIN_CONTACT) : ADMIN_CONTACT;
  const displayName = isOwnerOrAdmin ? (property.seller?.name || "Owner") : "Admin";

  const handleWhatsApp = (e) => {
    e.stopPropagation();
    window.open(`https://wa.me/91${displayContact}`, '_blank');
  };

  return (
    <>
      <div className="bg-white rounded-[24px] shadow-md border border-gray-100 overflow-hidden relative font-sans mb-4 hover:shadow-lg transition-shadow duration-300">
        {/* Card Image */}
        <div className="relative aspect-[4/3] bg-gray-200">
          <img 
            src={getFullImageUrl()} 
            alt={property.title} 
            onLoad={() => setImgLoaded(true)}
            className={`w-full h-full object-cover transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
          <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded-lg uppercase font-bold tracking-wider">
            {property.category}
          </div>
        </div>

        {/* Card Info */}
        <div className="p-4">
          <h3 className="text-xl font-black text-gray-900">₹{Number(property.price).toLocaleString('en-IN')}</h3>
          <p className="text-gray-700 font-bold truncate text-sm mt-1">{property.title}</p>
          <div className="flex items-center text-gray-500 text-xs mt-2 mb-4">
            <MapPin size={14} className="mr-1 text-red-500 shrink-0" /> 
            <span className="truncate">{property.location}</span>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => setShowMore(true)} 
              className="flex-1 bg-black hover:bg-gray-800 text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Eye size={16} /> DETAILS
            </button>
            <button 
              onClick={handleWhatsApp} 
              className="bg-[#25D366] hover:bg-[#20bd5a] text-white px-5 py-3 rounded-xl transition-colors"
            >
              <MessageCircle size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* --- IMPROVED FULL-SCREEN MODAL --- */}
      {showMore && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          {/* Blur Overlay */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
            onClick={() => setShowMore(false)} 
          />
          
          {/* Modal Container */}
          <div className="relative bg-white w-full sm:max-w-lg h-full sm:h-auto sm:max-h-[90vh] sm:rounded-[32px] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
            
            {/* Close Button (Floating) */}
            <button 
              onClick={() => setShowMore(false)} 
              className="absolute top-4 right-4 z-[10001] p-2 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-md transition-all"
            >
              <X size={24} />
            </button>

            {/* Scrollable Content Area */}
            <div className="overflow-y-auto flex-1 custom-scrollbar">
              {/* Modal Image */}
              <div className="relative h-[300px] sm:h-[350px]">
                <img src={getFullImageUrl()} className="w-full h-full object-cover" alt="Property Detail" />
                <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent"></div>
              </div>
              
              <div className="p-6 sm:p-8 -mt-6 relative bg-white rounded-t-[30px]">
                <div className="flex justify-between items-start mb-2">
                   <span className="bg-blue-100 text-blue-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                    {property.category}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight mb-1">{property.title}</h2>
                <p className="text-2xl font-black text-blue-600 mb-6 tracking-tight">₹{Number(property.price).toLocaleString('en-IN')}</p>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Area</p>
                    <p className="font-extrabold text-base text-gray-800">{property.area} sqft</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Location</p>
                    <p className="font-extrabold text-base text-gray-800 truncate">{property.location}</p>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-8">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Description</p>
                  <p className="text-gray-600 leading-relaxed font-medium">
                    {property.description || "No description provided for this property."}
                  </p>
                </div>

                {/* Sticky-like Bottom Contact Bar inside Modal */}
                <div className="bg-gray-900 p-5 rounded-[24px] text-white flex justify-between items-center shadow-xl shadow-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-black text-white">
                      {displayName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Contact Seller</p>
                      <p className="font-bold text-sm">{displayName}</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleWhatsApp} 
                    className="bg-[#25D366] hover:bg-[#20bd5a] p-3.5 rounded-2xl transition-transform active:scale-95"
                  >
                    <MessageCircle size={24} fill="white"/>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PropertyCard;