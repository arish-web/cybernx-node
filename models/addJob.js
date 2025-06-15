const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, enum: ['Full-time', 'Part-time', 'Internship', 'Contract'], required: true },
  category: { type: String, required: true },
  salary: { type: String, required: true },
  postedDate: { type: String, required: true },
  description: { type: String, required: true },
  requirements: { type: [String], required: true },
  //
   isDeleted: { type: Boolean, default: false },
  // 
}, { timestamps: true });



module.exports = mongoose.model('Job', jobSchema);
