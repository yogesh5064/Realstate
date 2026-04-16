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
      <div className="bg-white rounded-[24px] shadow-md border border-gray-100 overflow-hidden relative font-sans mb-4">
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

      {/* --- LIGHTWEIGHT FULL-SCREEN POPUP --- */}
      {showMore && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Dark Overlay */}
          <div 
            className="absolute inset-0 bg-black/90" 
            onClick={() => setShowMore(false)} 
          />
          
          {/* Modal Container */}
          <div className="relative bg-white rounded-[30px] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in duration-200 flex flex-col max-h-[90vh]">
            
            {/* Close Button */}
            <button 
              onClick={() => setShowMore(false)} 
              className="absolute top-4 right-4 z-[10000] p-2 bg-black/20 text-white rounded-full"
            >
              <X size={24} />
            </button>

            {/* Content (Scrollable for mobile) */}
            <div className="overflow-y-auto">
              <img src={getFullImageUrl()} className="w-full h-64 object-cover" alt="Detail" />
              <div className="p-6">
                <h2 className="text-2xl font-black text-gray-900">{property.title}</h2>
                <p className="text-xl font-black text-blue-600 mb-4">₹{Number(property.price).toLocaleString('en-IN')}</p>
                
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Area</p>
                    <p className="font-bold text-sm">{property.area} sqft</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Location</p>
                    <p className="font-bold text-sm truncate">{property.location}</p>
                  </div>
                </div>

                <p className="text-gray-600 italic font-medium mb-6">
                  {property.description || "No description provided."}
                </p>

                <div className="bg-gray-900 p-4 rounded-2xl text-white flex justify-between items-center">
                  <div>
                    <p className="text-[10px] text-blue-400 font-bold">CONTACT</p>
                    <p className="font-bold">{displayName}</p>
                  </div>
                  <button onClick={handleWhatsApp} className="bg-[#25D366] p-3 rounded-xl">
                    <MessageCircle size={20}/>
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