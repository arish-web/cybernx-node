// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const dotenv = require('dotenv');
// app.use(express.json());

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Routes
// app.use('/api/auth', require('./routes/authRoutes'));
// // app.use('/api/jobs', require('./routes/jobRoutes'));
// // Add more as needed

// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => {
//   console.log("✅ MongoDB connected successfully");
//   app.listen(5000, () => console.log("🚀 Server running on port 5000"));
// })
// .catch(err => {
//   console.error("❌ MongoDB connection failed:", err.message);
// });

// app.use((err, req, res, next) => {
//   console.error("💥 Error caught by middleware:", err.stack);
//   res.status(500).json({ message: "Something went wrong on server", error: err.message });
// });




const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

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

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
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


