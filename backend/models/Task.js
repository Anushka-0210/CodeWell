const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a task title'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending',
    },
    deadline: {
      type: Date,
      required: [true, 'Please provide a deadline'],
    },
    completedAt: {
      type: Date,
    },
    // Track whether reminder emails were sent for this task
    reminder24Sent: {
      type: Boolean,
      default: false,
    },
    reminder1Sent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Update completedAt when status changes to completed
taskSchema.pre('save', function (next) {
  if (this.isModified('status') && this.status === 'completed') {
    this.completedAt = new Date();
  }
  next();
});

module.exports = mongoose.model('Task', taskSchema);
