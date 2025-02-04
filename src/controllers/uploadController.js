// const path = require('path');
// const { initializeYouTube } = require('../services/youtubeService');
// const fs = require('fs');

// const uploadVideo = async (req, res) => {
//   try {
//     console.log('Upload request received');

//     if (!req.file) {
//       console.error('No file in request');
//       return res.status(400).json({ error: 'No file found' });
//     }

//     console.log('File details:', {
//       name: req.file.originalname,
//       size: req.file.size,
//       type: req.file.mimetype
//     });

//     // Validate file size
//     if (req.file.size > 500 * 1024 * 1024) {
//       return res.status(400).json({ error: 'File size too large (max 500MB)' });
//     }

//     // Validate file type
//     if (!req.file.mimetype.startsWith('video/')) {
//       return res.status(400).json({ error: 'Invalid file type (must be video)' });
//     }

//     // Check if file was saved
//     const filePath = path.join(__dirname, '../../uploads', req.file.filename);
//     if (!fs.existsSync(filePath)) {
//       console.error('File not saved:', filePath);
//       return res.status(500).json({ error: 'File upload failed' });
//     }

//     console.log('File saved successfully:', filePath);

//     // Return success response
//     res.json({ 
//       success: true, 
//       videoId: req.file.filename,
//       message: 'Video uploaded successfully'
//     });

//   } catch (error) {
//     console.error('Upload error:', error);
//     res.status(500).json({ 
//       error: 'Error uploading video',
//       details: error.message 
//     });
//   }
// };

// module.exports = {
//   uploadVideo
// }; 


const path = require('path');
const { initializeYouTube } = require('../services/youtubeService');
const fs = require('fs');

const uploadVideo = async (req, res) => {
  try {
    console.log('Upload request received');

    if (!req.file) {
      console.error('No file in request');
      return res.status(400).json({ error: 'No file found' });
    }

    console.log('File details:', {
      name: req.file.originalname,
      size: req.file.size,
      type: req.file.mimetype,
      path: req.file.path
    });

    // Validate file size
    if (req.file.size > 500 * 1024 * 1024) {
      return res.status(400).json({ error: 'File size too large (max 500MB)' });
    }

    // Validate file type
    if (!req.file.mimetype.startsWith('video/')) {
      return res.status(400).json({ error: 'Invalid file type (must be video)' });
    }

    // Check if file was saved
    const filePath = path.join(__dirname, '../../uploads', req.file.filename);
    if (!fs.existsSync(filePath)) {
      console.error('File not saved:', filePath);
      return res.status(500).json({ error: 'File upload failed' });
    }

    console.log('File saved successfully:', filePath);

    // Return success response
    res.json({ 
      success: true, 
      videoId: req.file.filename,
      message: 'Video uploaded successfully',
      path: filePath
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: 'Error uploading video',
      details: error.message 
    });
  }
};

module.exports = {
  uploadVideo
}; 
