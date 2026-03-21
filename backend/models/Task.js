// Task Model
// Schema for Task collection in database

const taskSchema = {
  _id: "ObjectId",
  userId: "ObjectId (reference to User)",
  title: "String (required)",
  description: "String",
  status: "String (pending, in-progress, completed)",
  priority: "String (low, medium, high)",
  dueDate: "Date",
  completedAt: "Date",
  createdAt: "Date (default: current date)",
  updatedAt: "Date (default: current date)"
};

// TODO: Implement using MongoDB, Mongoose, or your preferred database

// Example with Mongoose:
/*
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: String,
  status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  dueDate: Date,
  completedAt: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', taskSchema);
*/
