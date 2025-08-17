const express = require('express');
const { 
  getAllForms, 
  createForm, 
  getResponses, 
  getFormFields, 
  updateFormStatus,
  updateFormDeadline,
  notifyAllSubscribers,
  updateForm,
} = require('../controllers/formController.js');

const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// Routes
router.get('/:id', getFormFields);
router.get('/all', getAllForms);
router.post('/create', createForm);
router.get('/get-responses/:id', getResponses);
router.patch('/update-status/:id', updateFormStatus);
router.patch('/update-deadline/:id', updateFormDeadline);
router.put('/update/:id', updateForm);
router.post('/notify-subscribers/:formId', notifyAllSubscribers);



module.exports = router;
