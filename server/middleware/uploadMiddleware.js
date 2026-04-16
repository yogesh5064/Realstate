const multer = require('multer');
const path = require('path');

// Storage engine: Batata hai file kahan aur kis naam se save hogi
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// File filter: Sirf images allow karne ke liye
const checkFileTypes = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    // 🔥 Required Change: String ki jagah Error Object pass kiya
    return cb(new Error('Images Only!'), false); 
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5000000 }, // Max 5MB
  fileFilter: (req, file, cb) => checkFileTypes(req, file, cb)
});

module.exports = upload;