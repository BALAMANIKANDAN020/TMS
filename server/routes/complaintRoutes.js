const express = require('express');
const router = express.Router();
const { raiseComplaint, getComplaints, updateComplaint, deleteComplaint } = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getComplaints)
    .post(protect, raiseComplaint);

router.route('/:id')
    .put(protect, updateComplaint)
    .delete(protect, deleteComplaint);

module.exports = router;
