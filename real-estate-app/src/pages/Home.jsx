import React, { useState, useEffect } from "react";
import { Search, MapPin, Home as HomeIcon, ChevronDown, Loader2, Sparkles } from "lucide-react";
import API from "../api";
import PropertyCard from "../components/PropertyCard";

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentBg, setCurrentBg] = useState(0);

  // Search States
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("house");
  const [budget, setBudget] = useState("");

  // Animated Background Images
  const bgImages = [
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=1600",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1600",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1600"
  ];

  // Background Change Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % bgImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const fetchProperties = async (searchQuery = "") => {
    setLoading(true);
    try {
      const { data } = await API.get(`/properties?${searchQuery}`);
      const availableProperties = data.filter(property => property.status !== 'sold');
      setProperties(availableProperties);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProperties(); }, []);

  const handleSearch = () => {
    const query = `location=${location}&category=${category}&maxPrice=${budget}`;
    fetchProperties(query);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      
      {/* --- ANIMATED HERO SECTION --- */}
      <div className="relative h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Images Layer */}
        {bgImages.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentBg ? "opacity-100 scale-105" : "opacity-0 scale-100"
            }`}
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url(${img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              transition: 'transform 6s linear, opacity 1s ease-in-out'
            }}
          />
        ))}

        <div className="relative z-10 w-full px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-blue-100 text-sm font-medium mb-6 animate-bounce">
            <Sparkles size={16} /> Trust by 10,000+ Customers
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight drop-shadow-2xl">
            Find Your Perfect <span className="text-blue-400">Dream Home</span>
          </h1>
          <p className="text-gray-200 text-lg mb-12 max-w-2xl mx-auto font-medium">
            Explore premium properties, lands, and apartments with ease.
          </p>

          {/* --- SEARCH BOX --- */}
          <div className="max-w-5xl mx-auto bg-white/95 backdrop-blur-xl p-4 rounded-[2rem] shadow-2xl flex flex-col lg:flex-row gap-4 border border-white/50 animate-in fade-in zoom-in duration-700">
            
            <div className="flex-[1.5] flex items-center px-5 py-4 bg-gray-50/50 rounded-2xl border border-gray-100 transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-400">
              <MapPin className="text-blue-600 mr-3" size={24} />
              <input 
                type="text" 
                placeholder="Where do you want to live?" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-transparent w-full outline-none text-gray-800 font-semibold placeholder:text-gray-400"
              />
            </div>

            <div className="flex-1 flex items-center px-5 py-4 bg-gray-50/50 rounded-2xl border border-gray-100">
              <HomeIcon className="text-gray-400 mr-3" size={20} />
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-transparent w-full outline-none text-gray-700 font-bold appearance-none cursor-pointer"
              >
                <option value="house">Modern House</option>
                <option value="land">Premium Land</option>
              </select>
              <ChevronDown className="text-gray-400" size={18} />
            </div>

            <div className="flex-1 flex items-center px-5 py-4 bg-gray-50/50 rounded-2xl border border-gray-100">
              <span className="text-blue-600 mr-3 font-black text-xl">₹</span>
              <select 
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="bg-transparent w-full outline-none text-gray-700 font-bold appearance-none cursor-pointer"
              >
                <option value="">Any Budget</option>
                <option value="1000000">Under 10 Lakh</option>
                <option value="5000000">Under 50 Lakh</option>
                <option value="10000000">Above 1 Cr</option>
              </select>
            </div>

            <button 
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition-all hover:shadow-lg hover:shadow-blue-200 active:scale-95"
            >
              <Search size={22} /> SEARCH
            </button>
          </div>
        </div>
      </div>

      {/* --- PROPERTY LISTINGS --- */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Recent Listings</h2>
            <div className="h-1.5 w-20 bg-blue-600 rounded-full mt-2"></div>
          </div>
          <button className="bg-white border-2 border-gray-100 px-6 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition" onClick={() => fetchProperties("")}>
            View All Properties
          </button>
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-blue-600">
            <Loader2 className="animate-spin mb-4" size={50} />
            <p className="font-bold text-lg tracking-widest uppercase">Fetching...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {properties.length > 0 ? (
              properties.map((property) => (
                <div key={property._id} className="hover:-translate-y-2 transition-transform duration-300">
                  <PropertyCard property={property} />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-32 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                <p className="text-gray-400 font-medium text-xl italic">No properties match your criteria.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;