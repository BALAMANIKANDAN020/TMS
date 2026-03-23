const express = require('express');
const router = express.Router();
const { getRooms, createRoom, updateRoom, deleteRoom } = require('../controllers/roomController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(protect, getRooms).post(protect, admin, createRoom);
router.route('/:id').put(protect, admin, updateRoom).delete(protect, admin, deleteRoom);

module.exports = router;
