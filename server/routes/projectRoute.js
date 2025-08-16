// routes/projectRoutes.js
const express = require('express');
const router = express.Router();
const {
    createProject
} = require('../controllers/projectController');
const coreAuthMiddleware = require('../middlewares/coreAuthMiddleware');

router.post('/', coreAuthMiddleware, createProject);

module.exports = router;
