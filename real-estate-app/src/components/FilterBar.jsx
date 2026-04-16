import React from 'react';
import { Search, MapPin, Home, IndianRupee, Layers } from 'lucide-react';

const FilterBar = ({ filters, setFilters, onSearch }) => {
  
  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="bg-white shadow-md border-b sticky top-[72px] z-40 p-4">
      <div className="max-w-7xl mx-auto flex flex-wrap gap-4 items-center justify-between">
        
        {/* 1. Location Search */}
        <div className="flex-1 min-w-[200px] relative">
          <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
          <input 
            type="text"
            name="location"
            placeholder="Search City or Locality..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={handleChange}
          />
        </div>

        {/* 2. Category Filter (Land vs House) */}
        <div className="relative">
          <Layers className="absolute left-3 top-3 text-gray-400" size={18} />
          <select 
            name="category"
            className="pl-10 pr-8 py-2 border rounded-lg appearance-none bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={handleChange}
          >
            <option value="all">All Categories</option>
            <option value="house">House / Flat</option>
            <option value="land">Land / Plot</option>
          </select>
        </div>

        {/* 3. Type Filter (Rent vs Sell) */}
        <div className="relative">
          <Home className="absolute left-3 top-3 text-gray-400" size={18} />
          <select 
            name="type"
            className="pl-10 pr-8 py-2 border rounded-lg appearance-none bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={handleChange}
          >
            <option value="all">Any Purpose</option>
            <option value="rent">For Rent</option>
            <option value="sell">For Sale</option>
          </select>
        </div>

        {/* 4. Budget Filter */}
        <div className="relative">
          <IndianRupee className="absolute left-3 top-3 text-gray-400" size={18} />
          <select 
            name="budget"
            className="pl-10 pr-8 py-2 border rounded-lg appearance-none bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={handleChange}
          >
            <option value="max">Max Budget</option>
            <option value="500000">Under 5 Lakh</option>
            <option value="1000000">Under 10 Lakh</option>
            <option value="5000000">Under 50 Lakh</option>
            <option value="10000000">Under 1 Cr</option>
          </select>
        </div>

        {/* Search Button */}
        <button 
          onClick={onSearch}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition shadow-lg"
        >
          <Search size={18} /> Search
        </button>
      </div>
    </div>
  );
};

export default FilterBar;