const express = require('express');
const multer = require('multer');
const path = require('path');
const { addTeamMember } = require('../controllers/teamMembersController');

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '/tmp'); // Use /tmp as the temporary directory for serverless environments
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post('/add', upload.single('image'), addTeamMember);

module.exports = router;
