const express = require('express');
const router = express.Router();
const { addJob, getJobs, updateJob, getJobById } = require('../controllers/authController');

// AddJob
router.post('/addjob', addJob);

// Get all jobs
router.get('/getjob', getJobs);

// update 
router.put('/updatejob/:id', updateJob);

// single get
router.get('/addjob/:id', getJobById);


module.exports = router;

