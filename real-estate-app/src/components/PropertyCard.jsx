import React, { useState, useEffect } from 'react';
import { 
  MapPin, Home, Trees, MessageCircle, X, Eye, ShieldCheck, UserCheck 
} from 'lucide-react';

const PropertyCard = ({ property, isAdmin }) => {
  const [showMore, setShowMore] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  // --- Scroll Lock: Jab popup khulega toh piche ka page hilega nahi ---
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

  const handleWhatsApp = (e) => {
    e.stopPropagation();
    const contact = property.phone || "8690385064";
    window.open(`https://wa.me/91${contact}`, '_blank');
  };

  return (
    <>
      {/* --- MAIN PROPERTY CARD (Grid View) --- */}
      <div className="bg-white rounded-[24px] shadow-md border border-gray-100 overflow-hidden relative mb-4 transition-transform active:scale-95">
        <div className="relative aspect-[4/3] bg-gray-100">
          <img 
            src={getFullImageUrl()} 
            alt={property.title} 
            onLoad={() => setImgLoaded(true)}
            className={`w-full h-full object-cover transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
          <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded-lg uppercase font-bold tracking-widest">
            {property.category}
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-xl font-black text-gray-900 leading-none">₹{Number(property.price).toLocaleString('en-IN')}</h3>
          <p className="text-gray-600 font-bold truncate text-xs mt-1">{property.title}</p>
          <div className="flex items-center text-gray-400 text-[10px] mt-2 mb-4 font-bold uppercase">
            <MapPin size={12} className="mr-1 text-red-500" /> {property.location}
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => setShowMore(true)} 
              className="flex-1 bg-black text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-gray-800"
            >
              <Eye size={16} /> DETAILS
            </button>
            <button onClick={handleWhatsApp} className="bg-[#25D366] text-white px-5 py-3 rounded-xl">
              <MessageCircle size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* --- RESPONSIVE MODAL POPUP --- */}
      {showMore && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-0 md:p-6">
          
          {/* 1. Backdrop (Solid Dark Layer) */}
          <div 
            className="fixed inset-0 bg-black/95 backdrop-blur-md" 
            onClick={() => setShowMore(false)} 
          />
          
          {/* 2. Modal Container */}
          <div className="relative bg-white w-full h-full md:h-auto md:max-w-4xl md:rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in duration-300">
            
            {/* Close Button */}
            <button 
              onClick={() => setShowMore(false)} 
              className="absolute top-6 right-6 z-[100] p-3 bg-gray-100 hover:bg-red-500 hover:text-white text-gray-900 rounded-full transition-all"
            >
              <X size={24} />
            </button>

            {/* Image (Left on Desktop, Top on Mobile) */}
            <div className="w-full md:w-1/2 h-72 md:h-[600px] bg-gray-200">
              <img src={getFullImageUrl()} className="w-full h-full object-cover" alt="Property Detail" />
            </div>

            {/* Content (Right on Desktop, Bottom on Mobile) */}
            <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto bg-white flex flex-col">
              <div className="mb-6">
                <p className="text-blue-600 font-black text-xs uppercase tracking-widest mb-2 italic">Official Listing</p>
                <h2 className="text-3xl font-black text-gray-900 leading-tight mb-2 capitalize">{property.title}</h2>
                <p className="text-2xl font-black text-blue-600 italic">₹{Number(property.price).toLocaleString('en-IN')}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <span className="text-[10px] font-black text-gray-400 uppercase block mb-1">Total Area</span>
                  <span className="text-sm font-bold text-gray-800">{property.area} Sq.ft</span>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <span className="text-[10px] font-black text-gray-400 uppercase block mb-1">Category</span>
                  <span className="text-sm font-bold text-gray-800 capitalize">{property.category}</span>
                </div>
              </div>

              <div className="mb-10 flex-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 italic">Description</p>
                <p className="text-gray-600 leading-relaxed font-semibold italic text-base">
                  "{property.description || "Premium property listing with modern infrastructure and prime location accessibility."}"
                </p>
              </div>

              {/* Contact Card */}
              <div className="bg-gray-900 rounded-[32px] p-6 text-white shadow-2xl mt-auto">
                 <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
                          <UserCheck size={24}/>
                       </div>
                       <div>
                          <p className="text-[8px] font-black uppercase tracking-widest text-blue-400 mb-0.5">Contact Seller</p>
                          <h4 className="text-lg font-black italic">Property Owner</h4>
                       </div>
                    </div>
                    <button onClick={handleWhatsApp} className="bg-[#25D366] text-white p-4 rounded-2xl hover:bg-white hover:text-gray-900 transition-all">
                       <MessageCircle size={22} fill="currentColor"/>
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