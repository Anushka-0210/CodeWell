// MoodLog Model
// Schema for MoodLog collection in database

const moodLogSchema = {
  _id: "ObjectId",
  userId: "ObjectId (reference to User)",
  moodLevel: "Number (1-10)",
  stressLevel: "Number (1-10)",
  notes: "String",
  activities: "Array of Strings",
  timestamp: "Date (default: current date)"
};

// TODO: Implement using MongoDB, Mongoose, or your preferred database

// Example with Mongoose:
/*
const mongoose = require('mongoose');

const moodLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  moodLevel: { type: Number, required: true, min: 1, max: 10 },
  stressLevel: { type: Number, required: true, min: 1, max: 10 },
  notes: String,
  activities: [String],
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MoodLog', moodLogSchema);
*/
