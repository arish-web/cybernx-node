const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Job = require('../models/addJob');
const Application = require('../models/Application'); 



const JWT_SECRET = process.env.JWT_SECRET;

// REGISTER CONTROLLER
const registerUser = async (req, res) => {
  const { name, email, password, role, company } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ msg: 'Please fill in all fields' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashedPassword, role, company });

    res.status(201).json({
      // token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// LOGIN CONTROLLER
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: 'Please provide email and password' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "No account found with the provided email." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ADDJOB CONTROLLER
const addJob = async (req, res) => {
  const {
    title,
    company,
    location,
    type,
    category,
    salary,
    postedDate,
    description,
    requirements
  } = req.body;

  try {
    const newJob = new Job({
      title,
      company,
      location,
      type,
      category,
      salary,
      postedDate,
      description,
      requirements,
    });

    const savedJob = await newJob.save();

    res.status(201).json(savedJob);
  } catch (err) {
    console.error('Add job error:', err.message);
    res.status(500).json({ msg: 'Server error while adding job' });
  }
};

// DELETEJOB CONTROLLER
const softDeleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }

    res.status(200).json({ msg: 'Job soft deleted', job });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to delete job' });
  }
};

// GETJOB CONTROLLER
const getJobs = async (req, res) => {
  try {
    // const jobs = await Job.find();
    // const jobs = await Job.find({ isDeleted: false });
    const jobs = await Job.find({ isDeleted: { $ne: true } }); // ✅ Only non-deleted jobs
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch jobs' });
  }
};

// SINGLE GET
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job || job.isDeleted) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (err) {
    res.status(400).json({ error: 'Invalid job ID' });
  }
};

// UPDATE JOB
const updateJob = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const updatedJob = await Job.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.status(200).json(updatedJob);
  } catch (error) {
    console.error('Update job failed:', error);
    res.status(500).json({ message: 'Server error while updating job' });
  }
};

// APPLY JOB
const applyForJob = async (req, res) => {
  const { userId, jobId, status, appliedDate, coverLetter, resume } = req.body;

  try {
    if (!userId || !jobId) {
      return res.status(400).json({ message: "Missing userId or jobId" });
    }

    const newApplication = new Application({
      user: userId,
      job: jobId,
      status,
      appliedDate,
      coverLetter,
      resume,
    });

    await newApplication.save();

    return res.status(201).json({ message: "Application successful", application: newApplication });
  } catch (err) {
    console.error("Application error:", err);
    return res.status(500).json({ message: "Application failed", error: err.message });
  }
};

// GET THE APPLICATION BY USERID
 const getApplications = async (req, res) => {
  try {
    const applications = await Application.find({ user: req.params.userId }).populate('job');
    res.json(applications);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

const getApplicationsByCompany = async (req, res) => {
  try {
    const { company } = req.query;

    if (!company) return res.status(400).json({ msg: "Company is required" });

    // 1. Find jobs posted by this company
    const jobs = await Job.find({ company });

    const jobIds = jobs.map(job => job._id);

    // 2. Get applications for those jobs, and populate job & user data
    const applications = await Application.find({ job: { $in: jobIds } })
      .populate('job')    // populate job title etc.
      .populate('user');  // populate applicant info

    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// EXPORT CONTROLLERS
module.exports = {
  registerUser,
  loginUser,
  addJob, 
  getJobs,
  softDeleteJob,
  updateJob,
  getJobById,
  applyForJob,
  getApplications,
  getApplicationsByCompany
};


