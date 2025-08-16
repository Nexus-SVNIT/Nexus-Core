const express = require('express');
const coreAuthMiddleware = require('../middlewares/coreAuthMiddleware.js');
const { getAllEvents, getSingleEvent, addEvent, updateEvent, deleteEvent } = require('../controllers/eventController.js');

const router = express.Router();

router.get('/', getAllEvents);
router.get('/:id', getSingleEvent);
router.post('/',coreAuthMiddleware, addEvent);
router.patch('/:id', coreAuthMiddleware, updateEvent);
router.delete('/:id', coreAuthMiddleware, deleteEvent);

module.exports = router;