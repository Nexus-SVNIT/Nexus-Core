const express = require('express');
const { getAllAlumniDetails, getAllCompaniesAndExpertise, getPendingAlumni, verifyAlumni, rejectAlumni} = require('../controllers/alumniController.js');
const coreAuthMiddleware = require('../middlewares/coreAuthMiddleware.js');
const router = express.Router();

router.get('/', getAllAlumniDetails);
router.get('/get-companies-and-expertise', getAllCompaniesAndExpertise);

router.get('/pending', coreAuthMiddleware, getPendingAlumni);
router.post('/verify/:id', coreAuthMiddleware, verifyAlumni);
router.post('/reject/:id', coreAuthMiddleware, rejectAlumni);

module.exports = router;
