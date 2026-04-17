import React, { useState, useEffect } from 'react';
import { 
  MapPin, MessageCircle, X, Eye, Home, Trees, ShieldCheck 
} from 'lucide-react';

const PropertyCard = ({ property, isAdmin }) => {
  const [showMore, setShowMore] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  // 1. Scroll Lock Logic: Jab popup khulega toh piche ka page freeze ho jayega
  useEffect(() => {
    if (showMore) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [showMore]);

  // 2. Image URL Logic (Aapka original logic)
  const getFullImageUrl = () => {
    if (!property.images || property.images.length === 0) {
      return "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800";
    }
    const baseURL = "https://realstate-41cq.onrender.com";
    const fileName = property.images[0].replace(/\\/g, '/').split('/').pop();
    return `${baseURL}/uploads/${fileName}`;
  };

  const handleWhatsApp = (e) => {
    e.stopPropagation();
    const contact = property.phone || "8690385064";
    window.open(`https://wa.me/91${contact}`, '_blank');
  };

  return (
    <>
      {/* --- MAIN PROPERTY CARD (Grid View) --- */}
      <div className="bg-white rounded-[24px] shadow-md border border-gray-100 overflow-hidden relative mb-4 transition-all hover:shadow-xl active:scale-95">
        <div className="relative aspect-[4/3] bg-gray-200">
          <img 
            src={getFullImageUrl()} 
            alt={property.title} 
            onLoad={() => setImgLoaded(true)}
            className={`w-full h-full object-cover transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded-lg uppercase font-bold">
            {property.category}
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-xl font-black text-gray-900 leading-none mb-1 italic">₹{Number(property.price).toLocaleString('en-IN')}</h3>
          <p className="text-gray-600 font-bold truncate text-xs lowercase first-letter:uppercase">{property.title}</p>
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

      {/* --- 🔥 FINAL FIXED POPUP MODAL 🔥 --- */}
      {showMore && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center transition-all duration-300">
          
          {/* 1. SOLID BACKDROP: Piche ka sab kuch block karne ke liye */}
          <div 
            className="fixed inset-0 bg-black/95 backdrop-blur-md transition-opacity" 
            onClick={() => setShowMore(false)} 
          />
          
          {/* 2. MODAL CONTAINER: PC par center box, Mobile par responsive */}
          <div className="relative bg-white w-full h-full sm:h-auto sm:max-w-[450px] sm:max-h-[85vh] sm:rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 border border-white/10">
            
            {/* Close Button: Fixed position inside modal */}
            <button 
              onClick={() => setShowMore(false)} 
              className="absolute top-5 right-5 z-[100] p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-all"
            >
              <X size={24} />
            </button>

            {/* Scrollable Area */}
            <div className="overflow-y-auto flex-1 scrollbar-hide">
              <img src={getFullImageUrl()} className="w-full aspect-video object-cover" alt="Detail View" />
              
              <div className="p-6 sm:p-8">
                <span className="bg-blue-100 text-blue-600 text-[10px] font-black px-3 py-1 rounded-full uppercase mb-2 inline-block tracking-widest italic">
                  {property.category}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight mb-2 capitalize italic">{property.title}</h2>
                <p className="text-3xl font-black text-blue-600 mb-6 italic tracking-tight">₹{Number(property.price).toLocaleString('en-IN')}</p>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Total Area</p>
                    <p className="font-extrabold text-gray-800 text-sm">{property.area} sqft</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Property Location</p>
                    <p className="font-extrabold text-gray-800 text-sm truncate">{property.location}</p>
                  </div>
                </div>

                {/* Description Area */}
                <div className="mb-10">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2 italic">About this property</p>
                  <p className="text-gray-600 leading-relaxed font-semibold italic text-base">
                    "{property.description || "Premium property listing with modern infrastructure and prime location accessibility."}"
                  </p>
                </div>

                {/* Sticky Contact Bar inside Modal */}
                <div className="bg-gray-900 p-5 rounded-[28px] text-white flex justify-between items-center shadow-2xl border border-white/5 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-black italic shadow-inner">
                      A
                    </div>
                    <div>
                      <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mb-0.5">Contact Seller</p>
                      <p className="font-bold text-sm tracking-tight italic">Real Estate Admin</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleWhatsApp} 
                    className="bg-[#25D366] p-3.5 rounded-2xl hover:scale-110 active:scale-95 transition-all shadow-md shadow-green-500/20"
                  >
                    <MessageCircle size={24} fill="white" strokeWidth={0}/>
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