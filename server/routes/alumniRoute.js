const express = require('express');
const { getPendingAlumniDetails, toggleVerification, getAllAlumniDetails ,verifyAlumniEmail, getAllCompaniesAndExpertise} = require('../controllers/alumniController.js');
const coreAuthMiddleware = require('../middlewares/coreAuthMiddleware.js');
const router = express.Router();

router.get('/', getAllAlumniDetails);
router.get('/get-companies-and-expertise', getAllCompaniesAndExpertise);

router.patch('/:id', coreAuthMiddleware, toggleVerification);
router.get('/pending', coreAuthMiddleware, getPendingAlumniDetails);

module.exports = router;
