import React, { useState, useEffect } from 'react';
import { 
  MapPin, Home, Trees, MessageCircle, X, Heart, 
  CheckCircle, Trash2, Eye, Edit, ShieldCheck, 
  UserCheck, ImageIcon, Ruler, LayoutGrid
} from 'lucide-react';

const PropertyCard = ({ property, onDelete, onSoldOut, onEdit, isProfileView, isAdmin }) => {
  const [showMore, setShowMore] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);

  const ADMIN_CONTACT = "8690385064";
  const currentUserId = localStorage.getItem('userId');

  // Auto-slide images
  useEffect(() => {
    if (property.images?.length > 1) {
      const timer = setInterval(() => {
        setCurrentImgIndex((prev) => (prev === property.images.length - 1 ? 0 : prev + 1));
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [property.images]);

  // Robust URL handling to prevent 404s
  const getFullImageUrl = (index) => {
    if (!property.images || property.images.length === 0) {
      return "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800";
    }
    const baseURL = "https://realstate-41cq.onrender.com";
    // Extract only the filename to avoid double "uploads/uploads" issues
    const pathParts = property.images[index].replace(/\\/g, '/').split('/');
    const fileName = pathParts[pathParts.length - 1];
    return `${baseURL}/uploads/${fileName}`;
  };

  const isOwnerOrAdmin = isAdmin || (property.seller?._id === currentUserId || property.seller === currentUserId);
  const displayContact = isOwnerOrAdmin ? (property.phone || property.seller?.phone || ADMIN_CONTACT) : ADMIN_CONTACT;
  const displayName = isOwnerOrAdmin ? (property.seller?.name || "Original Seller") : "Real Estate Admin";

  const handleWhatsApp = (e) => {
    e.stopPropagation();
    const formattedPrice = Number(property.price).toLocaleString('en-IN');
    const message = `*PROPERTY INQUIRY* 🏠\n--------------------------\n🆔 *ID:* ${property._id}\n📌 *Title:* ${property.title}\n💰 *Price:* ₹${formattedPrice}\n📍 *Location:* ${property.location}\n--------------------------`;
    window.open(`https://wa.me/91${displayContact}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-500 relative font-sans h-full flex flex-col">
      
      {/* --- 🖼️ IMAGE SECTION --- */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 shrink-0">
        {!imgLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse">
            <ImageIcon className="text-gray-400" size={32} />
          </div>
        )}
        <img 
          src={getFullImageUrl(currentImgIndex)} 
          alt={property.title} 
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 ${imgLoaded ? 'opacity-100' : 'opacity-0'} ${property.status === 'sold' ? 'grayscale-[0.4]' : ''}`}
        />

        {/* Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          <span className="px-3 py-1.5 bg-black/60 backdrop-blur-md text-white text-[10px] font-black rounded-xl shadow-lg uppercase tracking-wider flex items-center gap-1.5 border border-white/20">
            {property.category === 'house' ? <Home size={12}/> : <Trees size={12}/>}
            {property.category}
          </span>
          {property.status === 'sold' && (
            <span className="bg-red-600 text-white px-3 py-1 rounded-lg font-black text-[10px] uppercase shadow-xl border border-white/30">
              Sold Out
            </span>
          )}
        </div>

        {/* Admin/Owner Controls */}
        <div className="absolute top-4 right-4 z-30 flex flex-col gap-2">
          {isProfileView && (
            <>
              <button onClick={(e) => { e.stopPropagation(); onDelete(property._id); }} className="p-2.5 bg-white/90 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-xl backdrop-blur-md"><Trash2 size={18} /></button>
              <button onClick={(e) => { e.stopPropagation(); onEdit(property); }} className="p-2.5 bg-white/90 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-xl backdrop-blur-md"><Edit size={18} /></button>
              {isAdmin && (
                <button onClick={(e) => { e.stopPropagation(); onSoldOut(property._id); }} className={`p-2.5 rounded-xl shadow-xl backdrop-blur-md transition-all ${property.status === 'sold' ? 'bg-green-600 text-white' : 'bg-white/90 text-gray-700 hover:bg-green-600 hover:text-white'}`}><CheckCircle size={18} /></button>
              )}
            </>
          )}
        </div>

        {!isProfileView && (
          <button onClick={() => setIsWishlisted(!isWishlisted)} className={`absolute bottom-4 right-4 p-3 rounded-full backdrop-blur-md z-10 transition-all ${isWishlisted ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-700'}`}>
            <Heart size={18} fill={isWishlisted ? "white" : "none"} />
          </button>
        )}
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-black text-gray-900 italic">₹{Number(property.price).toLocaleString('en-IN')}</h3>
          <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-100 uppercase">ID: {property._id.slice(-6)}</span>
        </div>
        
        <p className="text-gray-800 font-bold text-base truncate mb-1 capitalize">{property.title}</p>
        
        <div className="flex items-center text-gray-500 text-xs font-medium mb-4">
          <MapPin size={14} className="mr-1 text-red-500 shrink-0" />
          <span className="capitalize truncate">{property.location}</span>
        </div>

        <div className="flex gap-4 py-3 border-y border-gray-50 mb-5 text-[10px] font-black uppercase tracking-widest text-gray-400">
          <div className="flex items-center gap-1.5"><Home size={14} className="text-blue-500" /> {property.area} <span className="hidden xs:inline">sqft</span></div>
          {property.category === 'house' && <div className="border-l pl-4 flex items-center gap-1.5"><ShieldCheck size={14} className="text-green-500"/> {property.bhk} BHK</div>}
        </div>

        <div className="flex gap-2 mt-auto">
          <button onClick={() => setShowMore(true)} className="flex-1 bg-gray-950 text-white py-3 rounded-2xl font-black text-[11px] flex items-center justify-center gap-2 hover:bg-blue-600 transition-all uppercase tracking-tight">
            <Eye size={16} /> Details
          </button>
          <button onClick={handleWhatsApp} className="bg-[#25D366] text-white px-4 py-3 rounded-2xl hover:bg-[#128C7E] transition shadow-lg shadow-green-100">
            <MessageCircle size={22} />
          </button>
        </div>
      </div>

      {/* --- 🌟 RESPONSIVE PREMIUM MODAL 🌟 --- */}
      {showMore && (
        <div className="fixed inset-0 bg-gray-950/60 backdrop-blur-xl z-[500] flex items-center justify-center p-0 sm:p-4 md:p-8 overflow-hidden">
          <div className="bg-white w-full h-full sm:h-auto sm:max-h-[95vh] max-w-6xl sm:rounded-[3rem] relative animate-in slide-in-from-bottom-5 duration-500 shadow-2xl overflow-hidden flex flex-col md:flex-row">
            
            {/* Modal Image (Fixed height on mobile, full on desktop) */}
            <div className="w-full md:w-3/5 h-[35vh] sm:h-[45vh] md:h-auto relative bg-gray-200 shrink-0">
              <img src={getFullImageUrl(currentImgIndex)} className="w-full h-full object-cover" alt="Detail" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
              
              <button onClick={() => setShowMore(false)} className="md:hidden absolute top-4 left-4 p-3 bg-black/20 backdrop-blur-md text-white rounded-2xl border border-white/20"><X size={20} /></button>
              
              <div className="absolute bottom-6 left-6">
                <span className="px-3 py-1 bg-blue-600 text-white text-[9px] font-black rounded-lg uppercase tracking-widest shadow-lg">Premium Listing</span>
                <p className="text-white/80 text-[10px] font-bold uppercase mt-2">Image {currentImgIndex + 1} / {property.images?.length || 1}</p>
              </div>
            </div>

            {/* Modal Content (Scrollable) */}
            <div className="w-full md:w-2/5 flex flex-col h-[65vh] md:h-auto bg-white overflow-hidden relative">
              <button onClick={() => setShowMore(false)} className="hidden md:flex absolute top-6 right-6 p-2 text-gray-400 hover:text-red-500 transition-all"><X size={28} /></button>

              <div className="flex-1 overflow-y-auto p-6 sm:p-10">
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-1 w-8 bg-blue-600 rounded-full" />
                    <p className="text-blue-600 font-black text-[10px] uppercase tracking-widest italic">Property Details</p>
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-black text-gray-900 capitalize leading-tight mb-2">{property.title}</h2>
                  <div className="flex items-center gap-2 text-gray-500 mb-6">
                    <MapPin size={16} className="text-red-500 shrink-0" />
                    <span className="text-sm font-bold italic">{property.location}</span>
                  </div>
                  <div className="p-5 bg-blue-50/50 rounded-3xl border border-blue-100/50">
                     <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Asking Price</p>
                     <p className="text-3xl font-black text-blue-600 italic">₹{Number(property.price).toLocaleString('en-IN')}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-8">
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-3">
                    <Ruler size={18} className="text-blue-600 shrink-0"/>
                    <div className="min-w-0">
                      <span className="text-[8px] font-black text-gray-400 uppercase block">Area</span>
                      <span className="text-sm font-black text-gray-800 truncate block">{property.area} <small>Sqft</small></span>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-3">
                    <LayoutGrid size={18} className="text-green-600 shrink-0"/>
                    <div className="min-w-0">
                      <span className="text-[8px] font-black text-gray-400 uppercase block">Category</span>
                      <span className="text-sm font-black text-gray-800 capitalize truncate block">{property.category}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h4 className="text-[9px] font-black text-gray-950 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" /> Overview
                  </h4>
                  <p className="text-gray-600 leading-relaxed font-medium italic text-sm">
                    "{property.description || "Premium property listing featuring elite architectural design and prime location benefits."}"
                  </p>
                </div>

                {/* Sticky-like Contact Section */}
                <div className="bg-gray-900 rounded-[2.5rem] p-5 text-white shadow-xl relative overflow-hidden group/card border border-white/10">
                   <div className="relative z-10 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                         <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shrink-0">
                            {isOwnerOrAdmin ? <UserCheck size={22}/> : <ShieldCheck size={22}/>}
                         </div>
                         <div className="min-w-0">
                            <p className="text-[7px] font-black uppercase tracking-widest text-blue-400 mb-0.5">{isOwnerOrAdmin ? "Seller" : "Verified Agent"}</p>
                            <h4 className="text-lg font-black italic truncate leading-none">{displayName}</h4>
                         </div>
                      </div>
                      <button onClick={handleWhatsApp} className="bg-white text-gray-900 p-3.5 rounded-xl hover:bg-[#25D366] hover:text-white transition-all shrink-0 shadow-lg">
                         <MessageCircle size={20} />
                      </button>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyCard;