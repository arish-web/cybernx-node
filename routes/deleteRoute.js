const express = require('express');
const router = express.Router();
const { softDeleteJob } = require('../controllers/authController');

// Soft delete route
router.patch('/job/:id/delete', softDeleteJob);


module.exports = router;

