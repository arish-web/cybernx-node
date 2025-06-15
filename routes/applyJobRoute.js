const express = require('express');
const router = express.Router();
const { applyForJob, getApplications, getApplicationsByCompany } = require('../controllers/authController');

// apply for job
router.post('/apply', applyForJob);

// get application
router.get('/user/:userId', getApplications)

// get application by company
router.get('/company-applications', getApplicationsByCompany);


module.exports = router;

