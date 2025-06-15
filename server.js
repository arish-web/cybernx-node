const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
require('dotenv').config();

dotenv.config();

const app = express(); // ✅ Declare first

// ✅ Then use middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoute'));
app.use('/api/signUp', require('./routes/SignUpRoute'));
app.use('/api/job', require('./routes/jobRoute')); 
app.use('/api/applyjob', require('./routes/applyJobRoute'));
app.use('/api/delete', require('./routes/deleteRoute'));

 
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

mongoose.connect(process.env.MONGO_URI)

.then(() => {
  console.log("✅ MongoDB connected successfully");
  app.listen(5000, () => console.log("🚀 Server running on port 5000"));
})
.catch(err => {
  console.error("❌ MongoDB connection failed:", err.message);
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error("💥 Error caught by middleware:", err.stack);
  res.status(500).json({ message: "Something went wrong on server", error: err.message });
});


