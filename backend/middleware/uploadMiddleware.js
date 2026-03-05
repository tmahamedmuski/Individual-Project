const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

// Configure Cloudinary
const isCloudinaryConfigured = process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET &&
    process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name';

if (isCloudinaryConfigured) {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
    console.log('[UploadMiddleware] Cloudinary configured successfully.');
} else {
    console.warn('[UploadMiddleware] Cloudinary credentials missing or placeholder. Falling back to local storage.');
}

const createCloudinaryStorage = (folderName) => {
    if (isCloudinaryConfigured) {
        return new CloudinaryStorage({
            cloudinary: cloudinary,
            params: async (req, file) => {
                const isPdf = file.mimetype === 'application/pdf';
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);

                return {
                    folder: `project-run/${folderName}`,
                    public_id: `${file.fieldname}-${uniqueSuffix}`,
                    format: isPdf ? 'pdf' : undefined,
                    resource_type: isPdf ? 'raw' : 'image',
                };
            },
        });
    } else {
        // Fallback to memory storage for Base64
        console.log(`[UploadMiddleware] Using memoryStorage for ${folderName}`);
        return multer.memoryStorage();
    }
};

// Configure specific storages
const nicPhotoStorage = createCloudinaryStorage('nic-photos');
const workingPhotoStorage = createCloudinaryStorage('working-photos');
const gpLetterStorage = createCloudinaryStorage('gp-letters');
const profilePictureStorage = createCloudinaryStorage('profile-pictures');

// File filter
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only image and PDF files are allowed!'), false);
    }
};

// Multer instances
const upload = multer({
    storage: nicPhotoStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: fileFilter
});

const uploadProfilePicture = multer({
    storage: profilePictureStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: fileFilter
});

// Dynamic registration upload
// Dynamic registration upload
let registrationStorage;
if (isCloudinaryConfigured) {
    registrationStorage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: async (req, file) => {
            console.log(`[Multer-Cloudinary] Processing file: ${file.fieldname}`);
            try {
                let folder = 'project-run/others';
                if (file.fieldname === 'nicPhoto') folder = 'project-run/nic-photos';
                else if (file.fieldname === 'workingPhotos') folder = 'project-run/working-photos';
                else if (file.fieldname === 'gpLetters') folder = 'project-run/gp-letters';

                const isPdf = file.mimetype === 'application/pdf';
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);

                return {
                    folder: folder,
                    public_id: `${file.fieldname}-${uniqueSuffix}`,
                    resource_type: isPdf ? 'raw' : 'image',
                };
            } catch (error) {
                console.error('[Multer-Cloudinary] Error in params:', error);
                throw error;
            }
        },
    });
} else {
    // Fallback to memory storage for Base64
    console.log('[UploadMiddleware] Using memoryStorage for registration');
    registrationStorage = multer.memoryStorage();
}

const uploadRegistration = multer({
    storage: registrationStorage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: fileFilter
}).fields([
    { name: 'nicPhoto', maxCount: 1 },
    { name: 'workingPhotos', maxCount: 10 },
    { name: 'gpLetters', maxCount: 10 }
]);

module.exports = upload;
module.exports.uploadRegistration = uploadRegistration;
module.exports.uploadProfilePicture = uploadProfilePicture;
module.exports.cloudinary = cloudinary;
module.exports.isCloudinaryConfigured = isCloudinaryConfigured;
