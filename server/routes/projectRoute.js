// routes/projectRoutes.js
const express = require('express');
const router = express.Router();
const {
    createProject
} = require('../controllers/projectController');

router.post('/', createProject);

module.exports = router;
