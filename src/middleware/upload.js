const multer = require('multer');
const path = require('path');
const fs = require('fs');

// क्लीनअप फंक्शन
const cleanupOldFiles = (directory) => {
  fs.readdir(directory, (err, files) => {
    if (err) {
      console.error('Error reading uploads directory:', err);
      return;
    }

    // 24 घंटे से पुरानी फाइल्स को डिलीट करें
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    files.forEach(file => {
      const filePath = path.join(directory, file);
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error('Error getting file stats:', err);
          return;
        }
        if (now - stats.mtime.getTime() > oneDay) {
          fs.unlink(filePath, err => {
            if (err) console.error('Error deleting old file:', err);
            else console.log('Deleted old file:', file);
          });
        }
      });
    });
  });
};

// हर 6 घंटे में क्लीनअप रन करें
setInterval(() => {
  cleanupOldFiles(path.join(__dirname, '../../uploads'));
}, 6 * 60 * 60 * 1000);

// अपलोड स्टोरेज कॉन्फ़िगरेशन
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    // अगर डायरेक्टरी नहीं है तो बनाएं
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // पहले चेक करें कि क्या फाइल पहले से मौजूद है
    const filename = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, filename);
  }
});

// फाइल फ़िल्टर - केवल वीडियो फाइलें स्वीकार करें
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed'));
    }
  },
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB
    files: 1 // Only allow 1 file
  }
});

// एरर हैंडलिंग के साथ मिडलवेयर
const uploadMiddleware = (req, res, next) => {
  console.log('Processing upload request');
  
  upload.single('video')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.error('Multer error:', err);
      return res.status(400).json({
        error: 'Upload error',
        details: err.message
      });
    } else if (err) {
      console.error('Upload middleware error:', err);
      return res.status(400).json({
        error: err.message || 'Unknown upload error'
      });
    }

    if (!req.file) {
      console.error('No file in request after multer');
      return res.status(400).json({
        error: 'No file uploaded'
      });
    }

    console.log('File processed by multer:', req.file.filename);
    next();
  });
};

module.exports = uploadMiddleware; 