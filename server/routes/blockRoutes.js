const express = require('express');
const router = express.Router();
const { getBlocks, createBlock, updateBlock, deleteBlock } = require('../controllers/blockController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(protect, getBlocks).post(protect, admin, createBlock);
router.route('/:id').put(protect, admin, updateBlock).delete(protect, admin, deleteBlock);

module.exports = router;
