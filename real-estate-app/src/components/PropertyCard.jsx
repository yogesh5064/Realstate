import React, { useState, useEffect } from 'react';
import { 
  MapPin, Home, Trees, MessageCircle, X, Heart, ChevronRight, 
  CheckCircle, Trash2, Eye, Edit, Phone, ShieldCheck, UserCheck, ImageIcon,
  Maximize2, Ruler, Calendar, LayoutGrid
} from 'lucide-react';

const PropertyCard = ({ property, onDelete, onSoldOut, onEdit, isProfileView, isAdmin }) => {
  const [showMore, setShowMore] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);

  const ADMIN_CONTACT = "8690385064";
  const currentUserId = localStorage.getItem('userId');

  useEffect(() => {
    if (property.images && property.images.length > 1) {
      const timer = setInterval(() => {
        setCurrentImgIndex((prev) => (prev === property.images.length - 1 ? 0 : prev + 1));
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [property.images]);

  const getFullImageUrl = (index) => {
    if (!property.images || property.images.length === 0) {
      return "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800";
    }
    const baseURL = "https://realstate-41cq.onrender.com";
    const fileName = property.images[index].replace(/\\/g, '/').split('/').pop();
    return `${baseURL}/uploads/${fileName}`;
  };

  const isOwnerOrAdmin = isAdmin || (property.seller?._id === currentUserId || property.seller === currentUserId);
  const displayContact = isOwnerOrAdmin ? (property.phone || property.seller?.phone || ADMIN_CONTACT) : ADMIN_CONTACT;
  const displayName = isOwnerOrAdmin ? (property.seller?.name || "Original Seller") : "Real Estate Admin";

  const handleWhatsApp = () => {
    const formattedPrice = Number(property.price).toLocaleString('en-IN');
    const message = `*PROPERTY INQUIRY* 🏠\n--------------------------\n*Hi, I am interested in this listing:*\n\n🆔 *Property ID:* ${property._id}\n📌 *Title:* ${property.title}\n💰 *Price:* ₹${formattedPrice}\n📍 *Location:* ${property.location}\n--------------------------\n_Please provide more details._`;
    window.open(`https://wa.me/91${displayContact}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-500 relative font-sans">
      
      {/* --- 🖼️ IMAGE SECTION --- */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {!imgLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse">
            <ImageIcon className="text-gray-400" size={32} />
          </div>
        )}
        <img 
          src={getFullImageUrl(currentImgIndex)} 
          alt={property.title} 
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-full object-cover object-center transition-all duration-1000 group-hover:scale-110 ${imgLoaded ? 'opacity-100' : 'opacity-0'} ${property.status === 'sold' ? 'grayscale-[0.4]' : ''}`}
        />

        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          <span className="px-4 py-1.5 bg-black/60 backdrop-blur-md text-white text-[10px] font-black rounded-xl shadow-lg uppercase tracking-wider flex items-center gap-1.5 border border-white/20">
            {property.category === 'house' ? <Home size={12}/> : <Trees size={12}/>}
            {property.category}
          </span>
          {property.status === 'sold' && (
            <span className="bg-red-600 text-white px-4 py-1 rounded-lg font-black text-[10px] uppercase shadow-xl border border-white/30">
              Sold Out
            </span>
          )}
        </div>

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
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-black text-gray-900 tracking-tight italic">₹{Number(property.price).toLocaleString('en-IN')}</h3>
          <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-100 uppercase tracking-tighter">ID: {property._id.slice(-6)}</span>
        </div>
        
        <p className="text-gray-800 font-bold text-base truncate mb-1 capitalize leading-tight">{property.title}</p>
        
        <div className="flex items-center text-gray-500 text-xs font-medium mb-4">
          <MapPin size={14} className="mr-1 text-red-500" />
          <span className="capitalize truncate">{property.location}</span>
        </div>

        <div className="flex gap-4 py-3 border-y border-gray-50 mb-5 text-[11px] font-black uppercase tracking-widest text-gray-400">
          <div className="flex items-center gap-1.5"><Home size={14} className="text-blue-500" /> {property.area} sqft</div>
          {property.category === 'house' && <div className="border-l pl-4 flex items-center gap-1.5"><ShieldCheck size={14} className="text-green-500"/> {property.bhk} BHK</div>}
        </div>

        <div className="flex gap-2">
          <button onClick={() => setShowMore(true)} className="flex-1 bg-gray-950 text-white py-3.5 rounded-2xl font-black text-[12px] flex items-center justify-center gap-2 hover:bg-blue-600 transition-all shadow-xl shadow-gray-100 uppercase">
            <Eye size={16} /> Details
          </button>
          <button onClick={handleWhatsApp} className="bg-[#25D366] text-white px-5 py-3.5 rounded-2xl transition shadow-lg shadow-green-100 hover:bg-[#128C7E] flex items-center justify-center">
            <MessageCircle size={22} />
          </button>
        </div>
      </div>

      {/* --- 🌟 IMPROVED PREMIUM DETAILS MODAL 🌟 --- */}
      {showMore && (
        <div className="fixed inset-0 bg-gray-950/40 backdrop-blur-xl z-[500] flex items-center justify-center p-0 md:p-6 lg:p-12 overflow-hidden">
          <div className="bg-white md:rounded-[48px] w-full max-w-6xl h-full md:h-auto max-h-[100vh] md:max-h-[90vh] relative animate-in slide-in-from-bottom-10 duration-500 shadow-[0_32px_80px_-20px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col md:flex-row border-none">
            
            {/* Modal Image Section - Now takes more space on Desktop */}
            <div className="w-full md:w-3/5 h-[40vh] md:h-auto bg-gray-200 relative overflow-hidden group">
              <img 
                src={getFullImageUrl(currentImgIndex)} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                alt="Detail View" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
              
              <button onClick={() => setShowMore(false)} className="absolute top-6 left-6 p-4 bg-white/10 backdrop-blur-md text-white rounded-2xl hover:bg-red-500 hover:scale-110 transition-all border border-white/20 md:hidden shadow-2xl">
                <X size={24} />
              </button>

              <div className="absolute bottom-8 left-8 flex flex-col gap-2">
                <div className="flex gap-2">
                  <span className="px-4 py-2 bg-blue-600 text-white text-[10px] font-black rounded-xl uppercase tracking-[0.2em] shadow-lg">Premium Listing</span>
                  <span className="px-4 py-2 bg-white/20 backdrop-blur-md text-white text-[10px] font-black rounded-xl uppercase tracking-[0.2em] border border-white/20">Active</span>
                </div>
                <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest mt-1">Image {currentImgIndex + 1} of {property.images?.length || 1}</p>
              </div>
            </div>

            {/* Modal Content Section */}
            <div className="w-full md:w-2/5 p-6 md:p-12 overflow-y-auto bg-white flex flex-col custom-scrollbar">
              {/* Desktop Close Button */}
              <button onClick={() => setShowMore(false)} className="hidden md:flex absolute top-8 right-8 p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-300 rounded-2xl"><X size={28} /></button>
              
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-1 w-12 bg-blue-600 rounded-full" />
                  <p className="text-blue-600 font-black text-[11px] uppercase tracking-[0.3em] italic">Real Estate Portal</p>
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-gray-900 capitalize leading-tight mb-3 tracking-tighter">{property.title}</h2>
                <div className="flex items-center gap-2 text-gray-500 mb-6">
                  <MapPin size={18} className="text-red-500" />
                  <span className="text-sm font-bold italic">{property.location}</span>
                </div>
                <div className="p-6 bg-blue-50/50 rounded-[32px] border border-blue-100/50 inline-block w-full">
                   <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">Asking Price</p>
                   <p className="text-4xl font-black text-blue-600 tracking-tighter italic">₹{Number(property.price).toLocaleString('en-IN')}</p>
                </div>
              </div>

              {/* Property Specs Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="p-5 bg-gray-50 rounded-[28px] border border-gray-100 flex items-center gap-4 transition-all hover:bg-white hover:shadow-xl hover:shadow-gray-100">
                     <div className="p-3 bg-white rounded-2xl shadow-sm text-blue-600"><Ruler size={22}/></div>
                     <div>
                        <span className="text-[9px] font-black text-gray-400 uppercase block tracking-widest">Total Area</span>
                        <span className="text-base font-black text-gray-800">{property.area} <span className="text-[10px]">Sq.ft</span></span>
                     </div>
                  </div>
                  <div className="p-5 bg-gray-50 rounded-[28px] border border-gray-100 flex items-center gap-4 transition-all hover:bg-white hover:shadow-xl hover:shadow-gray-100">
                     <div className="p-3 bg-white rounded-2xl shadow-sm text-green-600"><LayoutGrid size={22}/></div>
                     <div>
                        <span className="text-[9px] font-black text-gray-400 uppercase block tracking-widest">Category</span>
                        <span className="text-base font-black text-gray-800 capitalize">{property.category}</span>
                     </div>
                  </div>
              </div>

              {/* Description */}
              <div className="mb-10">
                <h4 className="text-[10px] font-black text-gray-950 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" /> Property Description
                </h4>
                <div className="relative">
                   <p className="text-gray-600 leading-relaxed font-semibold italic text-lg pr-4">
                    "{property.description || "Premium property listing featuring elite architectural design, sustainable infrastructure, and prime location benefits with direct connectivity to major landmarks."}"
                  </p>
                </div>
              </div>

              {/* Enhanced Contact Card */}
              <div className="bg-gray-900 rounded-[36px] p-6 text-white shadow-2xl relative overflow-hidden group/card mt-auto border-2 border-white/5">
                 {/* Decorative background circle */}
                 <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl group-hover/card:bg-blue-600/40 transition-all duration-700"></div>
                 
                 <div className="relative z-10 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                       <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg text-white ring-4 ring-white/10">
                          {isOwnerOrAdmin ? <UserCheck size={28}/> : <ShieldCheck size={28}/>}
                       </div>
                       <div>
                          <p className="text-[8px] font-black uppercase tracking-[0.2em] text-blue-400 mb-0.5">
                            {isOwnerOrAdmin ? "Direct Seller Information" : "Verified Listing Agent"}
                          </p>
                          <h4 className="text-xl font-black italic leading-none mb-1">{displayName}</h4>
                          <p className="text-white/50 text-[10px] font-bold tracking-widest">+91 {displayContact}</p>
                       </div>
                    </div>
                    <button 
                      onClick={handleWhatsApp} 
                      className="bg-white text-gray-900 p-4 rounded-2xl hover:bg-[#25D366] hover:text-white hover:scale-110 transition-all shadow-xl active:scale-95"
                    >
                       <MessageCircle size={24} />
                    </button>
                 </div>
              </div>

              <div className="mt-8 flex items-center justify-between px-2">
                 <p className="text-[8px] font-black text-gray-300 uppercase tracking-[0.4em]">Ref: {property._id}</p>
                 <div className="flex gap-1">
                    <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
                    <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                    <div className="w-1 h-1 bg-blue-200 rounded-full"></div>
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