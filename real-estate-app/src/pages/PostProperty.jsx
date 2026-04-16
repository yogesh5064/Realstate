import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, X, Loader2 } from 'lucide-react';
import API from '../api';

const PostProperty = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]); 
  const [imageFiles, setImageFiles] = useState([]); 

  const [formData, setFormData] = useState({
    title: '',
    price: '',
    area: '',
    location: '',
    category: 'house',
    type: 'sell',
    bhk: '',
    description: '',
    phone: '', // 1. Phone state mein hai
  });

  useEffect(() => {
    const fetchUserPhone = async () => {
      try {
        const { data } = await API.get('/auth/profile');
        if (data.phone) {
          setFormData(prev => ({ ...prev, phone: data.phone }));
        }
      } catch (err) {
        console.error("Error fetching user data", err);
      }
    };
    fetchUserPhone();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) {
      alert("Max 5 images allowed");
      return;
    }
    setImageFiles([...imageFiles, ...files]);
    const previews = files.map(file => URL.createObjectURL(file));
    setImages([...images, ...previews]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setImageFiles(imageFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.phone) {
      alert("Mobile number dalna zaroori hai!");
      return;
    }

    setLoading(true);
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });
    imageFiles.forEach(file => {
      data.append('images', file);
    });

    try {
      await API.post('/properties', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert("Property Listed Successfully!");
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto my-10 p-8 bg-white shadow-2xl rounded-3xl border border-gray-100 font-sans">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-gray-800 tracking-tight">Post Your Property</h2>
        <p className="text-gray-500 font-medium">Add your property details below</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <button type="button" onClick={() => setFormData({...formData, category: 'house'})}
            className={`p-4 rounded-2xl border-2 font-bold transition-all ${formData.category === 'house' ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-lg' : 'border-gray-100 text-gray-400'}`}>
            🏠 House / Flat
          </button>
          <button type="button" onClick={() => setFormData({...formData, category: 'land'})}
            className={`p-4 rounded-2xl border-2 font-bold transition-all ${formData.category === 'land' ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-lg' : 'border-gray-100 text-gray-400'}`}>
            🌳 Land / Plot
          </button>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-bold text-gray-700">Property Photos (Max 5)</label>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
            {images.map((src, index) => (
              <div key={index} className="relative h-20 w-20 rounded-xl overflow-hidden border">
                <img src={src} className="h-full w-full object-cover" alt="preview" />
                <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5"><X size={12} /></button>
              </div>
            ))}
            {images.length < 5 && (
              <label className="h-20 w-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition">
                <Camera size={20} className="text-gray-400" />
                <input type="file" multiple onChange={handleImageChange} className="hidden" accept="image/*" />
              </label>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <input type="text" name="title" placeholder="Property Title" required onChange={handleChange} className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-500" />
          
          <div className="grid grid-cols-2 gap-4">
            <input type="number" name="price" placeholder="Price (₹)" required onChange={handleChange} className="p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="number" name="area" placeholder="Area (sq.ft)" required onChange={handleChange} className="p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          {/* 🔥 PHONE INPUT (HAMESHA DIKHEGA) */}
          <input type="tel" name="phone" value={formData.phone} placeholder="Contact Number" required onChange={handleChange} 
            className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-500 font-bold" />

          {formData.category === 'house' && (
            <select name="bhk" onChange={handleChange} className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-500" required>
              <option value="">Select BHK</option>
              <option value="1">1 BHK</option>
              <option value="2">2 BHK</option>
              <option value="3">3 BHK</option>
              <option value="4">4+ BHK</option>
            </select>
          )}

          <input type="text" name="location" placeholder="City / Locality" required onChange={handleChange} className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-500" />
          
          <textarea name="description" placeholder="Write more details about your property..." onChange={handleChange} className="w-full p-4 bg-gray-50 rounded-2xl h-32 border-none outline-none focus:ring-2 focus:ring-blue-500"></textarea>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-700 shadow-xl transition-all flex items-center justify-center gap-2">
          {loading ? <><Loader2 className="animate-spin" /> Publishing...</> : "List Property Now"}
        </button>
      </form>
    </div>
  );
};

export default PostProperty;