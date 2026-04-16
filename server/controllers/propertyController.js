const Property = require('../models/Property');
const User = require('../models/User');

// @desc    Create new property (Protected)
exports.createProperty = async (req, res) => {
  try {
    console.log("--- New Property Request Received ---");
    
    // 1. User Auth Check
    const sellerId = req.user?.id || req.user?._id;
    if (!sellerId) {
      console.log("❌ Error: No Seller ID found in request");
      return res.status(401).json({ message: "User not authorized" });
    }

    // 2. Data Extraction
    const { title, description, price, location, category, type, bhk, area, phone } = req.body;
    console.log("📝 Data Received from Frontend:", { title, price, location, phone });

    // 3. Backend Validation (Essential Fields)
    if (!title || !description || !price || !location || !phone) {
      console.log("⚠️ Validation Failed: Missing Fields");
      return res.status(400).json({ message: "All mandatory fields must be filled!" });
    }

    // 4. Handle Images (Multer extracts these)
    const imagePaths = req.files ? req.files.map(file => file.filename) : [];
    console.log("🖼️ Images processed count:", imagePaths.length);

    // 5. Create New Property Instance
    const newProperty = new Property({
      seller: sellerId,
      title: title.trim(),
      description: description.trim(),
      price: Number(price),
      location: location.trim(),
      category: category || 'house',
      type: type || 'sell',
      phone: phone.trim(),
      bhk: category === 'house' ? (Number(bhk) || 0) : undefined,
      area: Number(area) || 0,
      images: imagePaths,
    });

    console.log("💾 Attempting to save to MongoDB...");

    // 6. Save to Database
    const savedProperty = await newProperty.save();
    
    console.log("✅ DB Success: Property ID", savedProperty.projectId);
    res.status(201).json(savedProperty);

  } catch (err) {
    console.log("❌ ASLI ERROR LOG:", err.message);
    
    if (err.code === 11000) {
      return res.status(400).json({ message: "Unique ID error, please try again." });
    }

    res.status(500).json({ 
      message: "Server Error during save", 
      error: err.message 
    });
  }
};

// @desc    Get all properties (Public with Filters)
exports.getAllProperties = async (req, res) => {
  try {
    const { category, location, minPrice, maxPrice } = req.query;
    let query = { status: 'available' };

    if (category) query.category = category;
    if (location) query.location = { $regex: location, $options: 'i' };
    if (minPrice || maxPrice) {
      query.price = { $gte: Number(minPrice) || 0, $lte: Number(maxPrice) || Infinity };
    }

    const properties = await Property.find(query)
      .populate('seller', 'name email phone')
      .sort({ createdAt: -1 });
      
    res.status(200).json(properties);
  } catch (err) {
    console.log("❌ Fetch Error:", err.message);
    res.status(500).json({ message: "Fetch Error", error: err.message });
  }
};

// @desc    Update/Edit Property (Photos Edit Feature Added Here)
exports.updateProperty = async (req, res) => {
  try {
    console.log("--- Update Request for ID:", req.params.id, "---");
    
    let property = await Property.findById(req.params.id);
    if (!property) {
      console.log("❌ Property Not Found");
      return res.status(404).json({ message: "Property not found" });
    }

    // Auth Check
    const userId = req.user.id || req.user._id;
    if (property.seller.toString() !== userId.toString() && req.user.role !== 'admin') {
      console.log("❌ Unauthorized Update Attempt");
      return res.status(401).json({ message: "Not authorized" });
    }

    // --- PHOTO EDIT LOGIC (New Feature) ---
    let updateData = { ...req.body };
    
    // Check if new images are being uploaded
    if (req.files && req.files.length > 0) {
      console.log("🆕 New Photos detected, updating images array...");
      updateData.images = req.files.map(file => file.filename);
    } else {
      console.log("ℹ️ No new photos uploaded, keeping old ones.");
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    console.log("✅ Property Updated Successfully");
    res.status(200).json(updatedProperty);
  } catch (err) {
    console.log("❌ Update Error:", err.message);
    res.status(500).json({ message: "Update Error", error: err.message });
  }
};

// @desc    Get logged-in user's properties (My Listings)
exports.getMyProperties = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    console.log("🔍 Fetching properties for user:", userId);
    
    const properties = await Property.find({ seller: userId }).sort({ createdAt: -1 });
    res.status(200).json(properties);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// @desc    Delete property listing
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found" });

    const userId = req.user.id || req.user._id;
    if (property.seller.toString() !== userId.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: "Not authorized" });
    }

    await property.deleteOne();
    console.log("🗑️ Property Deleted");
    res.status(200).json({ message: "Property deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete Error", error: err.message });
  }
};

// @desc    Toggle Property Status (Available / Sold)
exports.togglePropertyStatus = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found" });

    const userId = req.user.id || req.user._id;
    if (property.seller.toString() !== userId.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: "Unauthorized" });
    }

    property.status = property.status === 'sold' ? 'available' : 'sold';
    await property.save();
    console.log("🔄 Status Toggled to:", property.status);
    res.status(200).json(property);
  } catch (err) {
    res.status(500).json({ message: "Status Toggle Error", error: err.message });
  }
};

// @desc    Toggle Wishlist (Add/Remove)
exports.toggleWishlist = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const propertyId = req.params.id;
    const user = await User.findById(userId);
    
    if (user.wishlist.includes(propertyId)) {
      user.wishlist = user.wishlist.filter(id => id.toString() !== propertyId);
      await user.save();
      console.log("❤️ Removed from Wishlist");
      return res.status(200).json({ message: "Removed", wishlist: user.wishlist });
    } else {
      user.wishlist.push(propertyId);
      await user.save();
      console.log("💖 Added to Wishlist");
      return res.status(200).json({ message: "Added", wishlist: user.wishlist });
    }
  } catch (err) {
    res.status(500).json({ message: "Wishlist Error", error: err.message });
  }
};

// @desc    Get All Wishlisted Properties for User
exports.getWishlist = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const user = await User.findById(userId).populate('wishlist');
    console.log("📚 Fetching User Wishlist...");
    res.status(200).json(user ? user.wishlist : []);
  } catch (err) {
    res.status(500).json({ message: "Wishlist Fetch Error", error: err.message });
  }
};