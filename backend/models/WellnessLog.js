const mongoose = require('mongoose');

const wellnessLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    mood: {
      type: String,
      enum: ['happy', 'neutral', 'sad'],
      required: true,
    },
    stressLevel: {
      type: String,
      enum: ['low', 'medium', 'high'],
      required: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('WellnessLog', wellnessLogSchema);
