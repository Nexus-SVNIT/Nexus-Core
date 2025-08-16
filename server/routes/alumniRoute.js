const express = require('express');
const { getAllAlumniDetails, getAllCompaniesAndExpertise, getPendingAlumni, verifyAlumni, rejectAlumni} = require('../controllers/alumniController.js');
const router = express.Router();

router.get('/', getAllAlumniDetails);
router.get('/get-companies-and-expertise', getAllCompaniesAndExpertise);

router.get('/pending', getPendingAlumni);
router.post('/verify/:id', verifyAlumni);
router.post('/reject/:id', rejectAlumni);

module.exports = router;
