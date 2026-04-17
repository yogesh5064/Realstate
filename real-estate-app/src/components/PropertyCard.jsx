import React, { useState, useEffect } from 'react';
import { MapPin, MessageCircle, X, Eye } from 'lucide-react';

const PropertyCard = ({ property, isAdmin }) => {
  const [showMore, setShowMore] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // 1. Forcefully screen size detect karna
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    if (showMore) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => {
      window.removeEventListener('resize', handleResize);
      document.body.style.overflow = 'unset';
    };
  }, [showMore]);

  const getFullImageUrl = () => {
    if (!property.images || property.images.length === 0) return "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800";
    const baseURL = "https://realstate-41cq.onrender.com";
    const fileName = property.images[0].replace(/\\/g, '/').split('/').pop();
    return `${baseURL}/uploads/${fileName}`;
  };

  const handleWhatsApp = (e) => {
    e.stopPropagation();
    window.open(`https://wa.me/91${property.phone || "8690385064"}`, '_blank');
  };

  // --- Inline Styles for Laptop (PC) ---
  const pcStyle = {
    width: '450px',
    height: 'auto',
    maxHeight: '85vh',
    borderRadius: '32px',
    position: 'relative',
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column'
  };

  // --- Inline Styles for Mobile ---
  const mobileStyle = {
    width: '100vw',
    height: '100vh',
    borderRadius: '0px',
    position: 'relative',
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column'
  };

  return (
    <>
      {/* Card UI (As it is) */}
      <div className="bg-white rounded-[24px] shadow-md border border-gray-100 overflow-hidden mb-4">
        <div className="relative aspect-[4/3] bg-gray-100">
          <img src={getFullImageUrl()} className="w-full h-full object-cover" alt="img" />
        </div>
        <div className="p-4 text-center">
          <h3 className="text-lg font-black italic">₹{Number(property.price).toLocaleString('en-IN')}</h3>
          <button onClick={() => setShowMore(true)} className="mt-2 w-full bg-black text-white py-2 rounded-xl text-xs font-bold">
            DETAILS
          </button>
        </div>
      </div>

      {/* --- FINAL FIXED POPUP --- */}
      {showMore && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 999999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.95)', // Piche ka parda ekdum solid
          backdropFilter: 'blur(10px)'
        }}>
          {/* Backdrop Click */}
          <div style={{ position: 'absolute', inset: 0 }} onClick={() => setShowMore(false)} />

          {/* Modal Container with Dynamic Style */}
          <div style={isMobile ? mobileStyle : pcStyle}>
            
            {/* Close Button */}
            <button 
              onClick={() => setShowMore(false)} 
              style={{
                position: 'absolute', top: '20px', right: '20px',
                zIndex: 10, padding: '8px', backgroundColor: 'rgba(0,0,0,0.3)',
                color: 'white', borderRadius: '50%', border: 'none', cursor: 'pointer'
              }}
            >
              <X size={24} />
            </button>

            {/* Scrollable Content */}
            <div style={{ overflowY: 'auto', flex: 1 }}>
              <img src={getFullImageUrl()} style={{ width: '100%', height: '250px', objectCover: 'cover' }} alt="detail" />
              <div style={{ padding: '24px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#111' }}>{property.title}</h2>
                <p style={{ fontSize: '22px', fontWeight: 900, color: '#2563eb', margin: '8px 0' }}>₹{Number(property.price).toLocaleString('en-IN')}</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', margin: '20px 0' }}>
                  <div style={{ backgroundColor: '#f9fafb', padding: '12px', borderRadius: '16px' }}>
                    <p style={{ fontSize: '10px', color: '#9ca3af', fontWeight: 'bold' }}>AREA</p>
                    <p style={{ fontWeight: 'bold' }}>{property.area} sqft</p>
                  </div>
                  <div style={{ backgroundColor: '#f9fafb', padding: '12px', borderRadius: '16px' }}>
                    <p style={{ fontSize: '10px', color: '#9ca3af', fontWeight: 'bold' }}>LOCATION</p>
                    <p style={{ fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis' }}>{property.location}</p>
                  </div>
                </div>

                <p style={{ color: '#4b5563', lineHeight: 1.6, marginBottom: '80px' }}>
                  {property.description || "Premium property listing details."}
                </p>
              </div>
            </div>

            {/* Fixed Contact Bar inside Modal */}
            <div style={{
              padding: '16px', borderTop: '1px solid #eee', backgroundColor: 'white'
            }}>
              <div style={{
                backgroundColor: '#111', padding: '16px', borderRadius: '20px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white'
              }}>
                <div>
                  <p style={{ fontSize: '10px', color: '#60a5fa', fontWeight: 'bold' }}>CONTACT OWNER</p>
                  <p style={{ fontWeight: 'bold' }}>{property.seller?.name || "Admin"}</p>
                </div>
                <button 
                  onClick={handleWhatsApp} 
                  style={{ backgroundColor: '#25D366', border: 'none', padding: '12px', borderRadius: '12px', cursor: 'pointer' }}
                >
                  <MessageCircle size={24} color="white" />
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