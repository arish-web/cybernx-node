const mongoose = require('mongoose');
notepad models\application.js


const applicationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'rejected', 'accepted'],
      default: 'pending',
    },
    appliedDate: { type: Date, default: Date.now },
    coverLetter: { type: String, default: '' },
    resume: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Application', applicationSchema);
