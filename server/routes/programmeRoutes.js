const express = require('express');
const router = express.Router();
const { getProgrammes, createProgramme, updateProgramme, deleteProgramme } = require('../controllers/programmeController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(protect, getProgrammes).post(protect, admin, createProgramme);
router.route('/:id').put(protect, admin, updateProgramme).delete(protect, admin, deleteProgramme);

module.exports = router;
