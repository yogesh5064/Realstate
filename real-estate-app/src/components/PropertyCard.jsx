import React, { useState, useEffect } from 'react';
import { 
  MapPin, MessageCircle, X, Eye, 
} from 'lucide-react';

const PropertyCard = ({ property, isAdmin }) => {
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
      {/* Main Property Card Item */}
      <div className="bg-white rounded-[24px] shadow-md border border-gray-100 overflow-hidden relative font-sans mb-4 hover:shadow-lg transition-shadow duration-300">
        <div className="relative aspect-[4/3] bg-gray-200">
          <img 
            src={getFullImageUrl()} 
            alt={property.title} 
            onLoad={() => setImgLoaded(true)}
            className={`w-full h-full object-cover transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
          <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded-lg uppercase font-bold">
            {property.category}
          </div>
        </div>

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
              className="flex-1 bg-black text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2"
            >
              <Eye size={16} /> DETAILS
            </button>
            <button onClick={handleWhatsApp} className="bg-[#25D366] text-white px-5 py-3 rounded-xl">
              <MessageCircle size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* --- CENTERED MODAL POPUP --- */}
      {showMore && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6">
          {/* Overlay: Pure center hone ke liye inset-0 zaroori hai */}
          <div 
            className="fixed inset-0 bg-black/85 backdrop-blur-sm transition-opacity" 
            onClick={() => setShowMore(false)} 
          />
          
          {/* Modal Box */}
          <div className="relative bg-white w-full max-w-[500px] max-h-[85vh] sm:max-h-[90vh] rounded-[32px] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
            
            {/* Close Icon */}
            <button 
              onClick={() => setShowMore(false)} 
              className="absolute top-4 right-4 z-[100000] p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors"
            >
              <X size={24} />
            </button>

            {/* Scrollable Body */}
            <div className="overflow-y-auto flex-1 scrollbar-hide">
              <img src={getFullImageUrl()} className="w-full h-64 object-cover" alt="Property Detail" />
              
              <div className="p-6">
                <span className="bg-blue-100 text-blue-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase mb-2 inline-block">
                  {property.category}
                </span>
                <h2 className="text-2xl font-black text-gray-900 leading-tight">{property.title}</h2>
                <p className="text-2xl font-black text-blue-600 my-2">₹{Number(property.price).toLocaleString('en-IN')}</p>
                
                <div className="grid grid-cols-2 gap-3 my-4">
                  <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Area</p>
                    <p className="font-extrabold text-gray-800">{property.area} sqft</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Location</p>
                    <p className="font-extrabold text-gray-800 truncate">{property.location}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">About this property</p>
                  <p className="text-gray-600 leading-relaxed font-medium">
                    {property.description || "No description provided for this property."}
                  </p>
                </div>

                {/* Bottom Contact Section */}
                <div className="bg-gray-900 p-5 rounded-[24px] text-white flex justify-between items-center sticky bottom-0 mt-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-black">
                      {displayName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-[10px] text-blue-400 font-bold uppercase">Contact</p>
                      <p className="font-bold text-sm">{displayName}</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleWhatsApp} 
                    className="bg-[#25D366] p-3.5 rounded-2xl hover:scale-105 active:scale-95 transition-all"
                  >
                    <MessageCircle size={22} fill="white"/>
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