const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create upload directories if they don't exist
const workingPhotosDir = path.join(__dirname, '../uploads/working-photos');
const gpLettersDir = path.join(__dirname, '../uploads/gp-letters');

[workingPhotosDir, gpLettersDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Configure storage for working photos
const workingPhotosStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, workingPhotosDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'working-' + uniqueSuffix + ext);
    }
});

// Configure storage for GP letters
const gpLettersStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, gpLettersDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'gp-' + uniqueSuffix + ext);
    }
});

// File filter - allow images and PDFs
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only image and PDF files are allowed!'), false);
    }
};

// Configure multer for working photos (images only)
const uploadWorkingPhotos = multer({
    storage: workingPhotosStorage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed for working photos!'), false);
        }
    }
});

// Configure multer for GP letters (PDFs and images)
const uploadGPLetters = multer({
    storage: gpLettersStorage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: fileFilter
});

module.exports = {
    uploadWorkingPhotos,
    uploadGPLetters
};
