import React, { useState, useEffect } from 'react';
import { MapPin, MessageCircle, X, Eye } from 'lucide-react';

const PropertyCard = ({ property, isAdmin }) => {
  const [showMore, setShowMore] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const ADMIN_CONTACT = "8690385064";
  const currentUserId = localStorage.getItem('userId');

  // Background Scroll Lock (Professional feel ke liye)
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
      {/* --- Main Card Item --- */}
      <div className="bg-white rounded-[24px] shadow-md border border-gray-100 overflow-hidden relative font-sans mb-4 transition-transform active:scale-95">
        <div className="relative aspect-[4/3] bg-gray-200">
          <img 
            src={getFullImageUrl()} 
            alt={property.title} 
            onLoad={() => setImgLoaded(true)}
            className={`w-full h-full object-cover transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded-lg uppercase font-bold tracking-widest">
            {property.category}
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-xl font-black text-gray-900 leading-none mb-1">₹{Number(property.price).toLocaleString('en-IN')}</h3>
          <p className="text-gray-600 font-bold truncate text-xs">{property.title}</p>
          <div className="flex items-center text-gray-400 text-[10px] mt-2 mb-4 font-bold uppercase tracking-tight">
            <MapPin size={12} className="mr-1 text-red-500 shrink-0" /> 
            <span className="truncate">{property.location}</span>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => setShowMore(true)} 
              className="flex-1 bg-black text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
            >
              <Eye size={16} /> DETAILS
            </button>
            <button onClick={handleWhatsApp} className="bg-[#25D366] text-white px-5 py-3 rounded-xl hover:bg-[#1fb355] transition-colors">
              <MessageCircle size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* --- RESPONSIVE MODAL POPUP --- */}
      {showMore && (
        <div className="fixed inset-0 z-[100000] flex items-end sm:items-center justify-center transition-all duration-300">
          
          {/* Backdrop: Always Full Screen */}
          <div 
            className="fixed inset-0 bg-black/90 backdrop-blur-sm" 
            onClick={() => setShowMore(false)} 
          />
          
          {/* Modal Content: Defined for Phone vs PC */}
          <div className={`
            relative bg-white shadow-2xl overflow-hidden flex flex-col transition-all duration-300
            w-full h-[92vh] rounded-t-[32px]  /* MOBILE SETTINGS: Bottom sheet style */
            sm:w-[450px] sm:h-auto sm:max-h-[85vh] sm:rounded-[32px] /* PC SETTINGS: Floating center box */
            animate-in slide-in-from-bottom sm:zoom-in-95 duration-300
          `}>
            
            {/* Close Button: Fixed on top right */}
            <button 
              onClick={() => setShowMore(false)} 
              className="absolute top-4 right-4 z-[110] p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-all"
            >
              <X size={24} />
            </button>

            {/* Scrollable Area */}
            <div className="overflow-y-auto overflow-x-hidden flex-1 scroll-smooth">
              <img src={getFullImageUrl()} className="w-full aspect-video sm:aspect-square object-cover" alt="Detail" />
              
              <div className="p-6">
                <span className="bg-blue-100 text-blue-600 text-[10px] font-black px-3 py-1 rounded-full uppercase mb-2 inline-block tracking-widest">
                  {property.category}
                </span>
                <h2 className="text-2xl font-black text-gray-900 leading-tight">{property.title}</h2>
                <p className="text-2xl font-black text-blue-600 my-2">₹{Number(property.price).toLocaleString('en-IN')}</p>
                
                <div className="grid grid-cols-2 gap-3 my-4">
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
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">Property Description</p>
                  <p className="text-gray-600 leading-relaxed font-medium text-sm">
                    {property.description || "No additional details provided for this listing."}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Footer: Professional & Fixed inside Modal */}
            <div className="absolute bottom-0 left-0 w-full p-4 bg-white border-t border-gray-100 sm:relative sm:border-0 sm:bg-transparent">
              <div className="bg-gray-900 p-4 rounded-2xl text-white flex justify-between items-center shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-black text-white shadow-inner">
                    {displayName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Contact Owner</p>
                    <p className="font-bold text-sm truncate max-w-[120px]">{displayName}</p>
                  </div>
                </div>
                <button 
                  onClick={handleWhatsApp} 
                  className="bg-[#25D366] p-3 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-md"
                >
                  <MessageCircle size={22} fill="white" strokeWidth={0}/>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default PropertyCard;