const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directories if they don't exist
const nicPhotosDir = path.join(__dirname, '../uploads/nic-photos');
const workingPhotosDir = path.join(__dirname, '../uploads/working-photos');
const gpLettersDir = path.join(__dirname, '../uploads/gp-letters');

[nicPhotosDir, workingPhotosDir, gpLettersDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Configure storage for NIC photos
const nicPhotoStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, nicPhotosDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'nic-' + uniqueSuffix + ext);
    }
});

// Configure storage for working photos
const workingPhotoStorage = multer.diskStorage({
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
const gpLetterStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, gpLettersDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'gp-' + uniqueSuffix + ext);
    }
});

// File filter - only allow images
const fileFilter = (req, file, cb) => {
    // Accept images only
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

// Configure multer for single NIC photo
const upload = multer({
    storage: nicPhotoStorage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: fileFilter
});

// Dynamic storage for registration (handles multiple file types based on field name)
const registrationStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        let destDir = nicPhotosDir;
        if (file.fieldname === 'nicPhoto') {
            destDir = nicPhotosDir;
        } else if (file.fieldname === 'workingPhotos') {
            destDir = workingPhotosDir;
        } else if (file.fieldname === 'gpLetters') {
            destDir = gpLettersDir;
        }
        console.log(`[Multer] Saving ${file.fieldname} to: ${destDir}`);
        cb(null, destDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        let prefix = 'nic-';
        if (file.fieldname === 'workingPhotos') {
            prefix = 'working-';
        } else if (file.fieldname === 'gpLetters') {
            prefix = 'gp-';
        }
        const filename = prefix + uniqueSuffix + ext;
        console.log(`[Multer] Generated filename: ${filename} for field: ${file.fieldname}`);
        cb(null, filename);
    }
});

// Configure multer for multiple files during registration
const uploadRegistration = multer({
    storage: registrationStorage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.fieldname === 'nicPhoto' || file.fieldname === 'workingPhotos') {
            // Only images for NIC and working photos
            if (file.mimetype.startsWith('image/')) {
                cb(null, true);
            } else {
                cb(new Error('Only image files are allowed!'), false);
            }
        } else if (file.fieldname === 'gpLetters') {
            // Images or PDFs for GP letters
            if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
                cb(null, true);
            } else {
                cb(new Error('Only image and PDF files are allowed for GP letters!'), false);
            }
        } else {
            cb(null, true);
        }
    }
}).fields([
    { name: 'nicPhoto', maxCount: 1 },
    { name: 'workingPhotos', maxCount: 10 },
    { name: 'gpLetters', maxCount: 10 }
]);

module.exports = upload;
module.exports.uploadRegistration = uploadRegistration;