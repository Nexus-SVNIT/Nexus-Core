const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware.js');
const coreAuthMiddleware = require('../middlewares/coreAuthMiddleware.js');
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
router.get('/all', coreAuthMiddleware, getAllForms);
router.post('/create', coreAuthMiddleware, createForm);
router.get('/get-responses/:id', coreAuthMiddleware, getResponses);
router.patch('/update-status/:id', coreAuthMiddleware, updateFormStatus);
router.patch('/update-deadline/:id', coreAuthMiddleware,updateFormDeadline);
router.put('/update/:id', coreAuthMiddleware, updateForm);
router.post('/notify-subscribers/:formId', coreAuthMiddleware,notifyAllSubscribers);



module.exports = router;
