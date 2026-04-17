import React, { useState, useEffect } from 'react';
import { 
  MapPin, Home, Trees, MessageCircle, X, Heart, 
  CheckCircle, Trash2, Eye, Edit, ShieldCheck, UserCheck, ImageIcon 
} from 'lucide-react';

const PropertyCard = ({ property, onDelete, onSoldOut, onEdit, isProfileView, isAdmin }) => {
  const [showMore, setShowMore] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const ADMIN_CONTACT = "8690385064";
  const currentUserId = localStorage.getItem('userId');

  // Background Scroll Lock (Bina logic change kiye sirf UI experience ke liye)
  useEffect(() => {
    if (showMore) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
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
      <div className="bg-white rounded-[24px] shadow-md border border-gray-100 overflow-hidden relative font-sans mb-4 transition-transform active:scale-95">
        {/* Card Image */}
        <div className="relative aspect-[4/3] bg-gray-100">
          <img 
            src={getFullImageUrl()} 
            alt={property.title} 
            onLoad={() => setImgLoaded(true)}
            className={`w-full h-full object-cover transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
          <div className="absolute top-2 left-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded-lg uppercase font-bold">
            {property.category}
          </div>
        </div>

        {/* Card Info */}
        <div className="p-4">
          <h3 className="text-lg font-black italic">₹{Number(property.price).toLocaleString('en-IN')}</h3>
          <p className="text-gray-800 font-bold truncate">{property.title}</p>
          <div className="flex items-center text-gray-500 text-xs mt-1 mb-3">
            <MapPin size={12} className="mr-1 text-red-500" /> {property.location}
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => setShowMore(true)} 
              className="flex-1 bg-black text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2"
            >
              <Eye size={16} /> DETAILS
            </button>
            <button 
              onClick={handleWhatsApp} 
              className="bg-[#25D366] text-white px-4 py-2.5 rounded-xl"
            >
              <MessageCircle size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* --- RESPONSIVE FULL-SCREEN POPUP --- */}
      {showMore && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-0 sm:p-4">
          
          {/* Backdrop (Back shadow) - PC aur Mobile dono ko handle karega */}
          <div 
            className="fixed inset-0 bg-black/95 backdrop-blur-sm transition-opacity" 
            onClick={() => setShowMore(false)} 
          />
          
          {/* Modal Container: PC par max-width aur Mobile par full screen */}
          <div className="relative bg-white w-full h-full sm:h-auto sm:max-w-[450px] sm:max-h-[85vh] sm:rounded-[32px] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in duration-300 border border-white/10">
            
            {/* Close Button - Responsive Position */}
            <button 
              onClick={() => setShowMore(false)} 
              className="absolute top-5 right-5 z-[100000] p-2 bg-black/30 hover:bg-black/60 text-white rounded-full transition-all"
            >
              <X size={24} />
            </button>

            {/* Content Area - Scrollable */}
            <div className="overflow-y-auto overflow-x-hidden flex-1">
              <img src={getFullImageUrl()} className="w-full h-64 sm:h-72 object-cover" alt="Detail" />
              
              <div className="p-6">
                <span className="bg-blue-100 text-blue-600 text-[10px] font-black px-3 py-1 rounded-full uppercase mb-2 inline-block tracking-widest italic">
                  {property.category}
                </span>
                <h2 className="text-2xl font-black text-gray-900 leading-tight mb-1 capitalize">{property.title}</h2>
                <p className="text-2xl font-black text-blue-600 mb-6 italic">₹{Number(property.price).toLocaleString('en-IN')}</p>
                
                <div className="grid grid-cols-2 gap-3 mb-8">
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Area</p>
                    <p className="font-extrabold text-gray-800 text-sm">{property.area} sqft</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Location</p>
                    <p className="font-extrabold text-gray-800 text-sm truncate">{property.location}</p>
                  </div>
                </div>

                <div className="mb-24 sm:mb-6">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2 italic">Description</p>
                  <p className="text-gray-600 leading-relaxed font-semibold italic text-base">
                    "{property.description || "Premium property listing with modern infrastructure and prime location accessibility."}"
                  </p>
                </div>

                {/* Bottom Contact Section (Sticky on Mobile, Static on PC) */}
                <div className="bg-gray-900 p-5 rounded-[24px] text-white flex justify-between items-center shadow-xl mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-black italic">
                      {displayName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Contact</p>
                      <p className="font-bold text-sm truncate max-w-[120px]">{displayName}</p>
                    </div>
                  </div>
                  <button onClick={handleWhatsApp} className="bg-[#25D366] p-3 rounded-2xl hover:scale-105 active:scale-95 transition-all">
                    <MessageCircle size={22} fill="white" strokeWidth={0}/>
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