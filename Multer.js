const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Set up storage engine
const storage = multer.diskStorage({
    destination: './Uploads/', // Set upload folder
    filename: (req, file, cb) => {
        const userId = req.body.userId; // Get userId from request body
        if (!userId) {
            return cb(new Error('No userId provided'));
        }
        cb(null, `${userId}-${Date.now()}-${file.originalname}`);
    }
});

// Initialize upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // Limit file size to 1MB
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
}).single('profilePic');

// Check file type
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

// Handle file upload
router.post('/upload', (req, res) => {
    console.log('userId: ',req.body.userId)
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).send(err.message);
        }
        if (!req.file) {
            return res.status(400).send('No file selected!');
        }

        const userId = req.body.userId;  // Get userId from the request body
        const originalFilename = req.file.originalname;
        const filename = `${userId}-${Date.now()}-${originalFilename}`;

        // Move the file to the correct path with the new filename
        const newPath = path.join(__dirname, 'Uploads', filename);
        fs.rename(req.file.path, newPath, (err) => {
            if (err) {
                return res.status(500).send('Error saving file');
            }
            res.status(200).send({ filePath: `Uploads/${filename}` });
        });
    });
});

module.exports = router;
