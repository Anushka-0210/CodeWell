const cron = require('node-cron');
const Task = require('../models/Task');
const User = require('../models/User');
const { sendEmail } = require('../config/nodemailer');

const ONE_HOUR_MS = 60 * 60 * 1000;
const TWENTY_FOUR_HOURS_MS = 24 * ONE_HOUR_MS;

const formatRemainingTime = (milliseconds) => {
  const minutes = Math.floor(milliseconds / (60 * 1000));
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours > 0) {
    return `${hours}h ${remainingMinutes}m`;
  }

  return `${remainingMinutes}m`;
};

const formatDeadline = (date) => {
  return new Date(date).toLocaleString();
};

const buildReminderEmail = (task, user, type, timeLeft) => {
  const subject = `Task Reminder: ${task.title} is due in ${timeLeft}`;
  const deadlineText = formatDeadline(task.deadline);

  const html = `
    <p>Hi ${user.name || 'there'},</p>
    <p>This is a reminder that your task <strong>${task.title}</strong> is due soon.</p>
    <ul>
      <li><strong>Deadline:</strong> ${deadlineText}</li>
      <li><strong>Remaining time:</strong> ${timeLeft}</li>
      <li><strong>Reminder type:</strong> ${type}</li>
    </ul>
    <p>Please complete the task before the deadline.</p>
    <p>Thanks,<br/>Planora</p>
  `;

  return {
    subject,
    html,
    text: `Task: ${task.title}\nDeadline: ${deadlineText}\nRemaining time: ${timeLeft}\nReminder: ${type}`,
  };
};

const sendTaskReminderEmail = async (task, user, reminderType) => {
  if (!user || !user.email) {
    console.warn(`⚠️  Task ${task._id} has no valid user email; skipping reminder.`);
    return;
  }

  const timeLeft = formatRemainingTime(task.deadline - new Date());
  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: user.email,
    subject: buildReminderEmail(task, user, reminderType, timeLeft).subject,
    text: buildReminderEmail(task, user, reminderType, timeLeft).text,
    html: buildReminderEmail(task, user, reminderType, timeLeft).html,
  };

  try {
    await sendEmail(mailOptions);
    console.log(`✅ Sent ${reminderType} reminder for task '${task.title}' to ${user.email}`);
  } catch (error) {
    console.error(`❌ Failed to send reminder for task '${task.title}':`, error.message);
    throw error;
  }
};

const getTaskUser = async (task) => {
  if (task.user && task.user.email) {
    return task.user;
  }

  if (task.user) {
    return await User.findById(task.user).select('name email');
  }

  return null;
};

const processTaskReminders = async () => {
  const now = new Date();
  const windowEnd = new Date(now.getTime() + TWENTY_FOUR_HOURS_MS);

  const tasks = await Task.find({
    status: 'pending',
    $or: [
      {
        deadline: { $gt: now, $lte: new Date(now.getTime() + ONE_HOUR_MS) },
        reminder1Sent: false,
      },
      {
        deadline: { $gt: new Date(now.getTime() + ONE_HOUR_MS), $lte: windowEnd },
        reminder24Sent: false,
      },
    ],
  }).populate('user', 'name email');

  if (!tasks.length) {
    return;
  }

  for (const task of tasks) {
    const diffMs = task.deadline.getTime() - now.getTime();

    if (diffMs <= 0) {
      continue;
    }

    try {
      const user = await getTaskUser(task);
      if (!user || !user.email) {
        console.warn(`⚠️  No registered email found for task ${task._id}; skipping reminder.`);
        continue;
      }

      if (diffMs <= ONE_HOUR_MS && !task.reminder1Sent) {
        await sendTaskReminderEmail(task, user, '1-hour');
        task.reminder1Sent = true;
      } else if (diffMs <= TWENTY_FOUR_HOURS_MS && diffMs > ONE_HOUR_MS && !task.reminder24Sent) {
        await sendTaskReminderEmail(task, user, '24-hour');
        task.reminder24Sent = true;
      }

      if (task.isModified('reminder24Sent') || task.isModified('reminder1Sent')) {
        await task.save();
      }
    } catch (error) {
      console.error(`⚠️  Reminder error for task ${task._id}:`, error.message);
    }
  }
};

const startTaskReminderScheduler = () => {
  cron.schedule('* * * * *', async () => {
    try {
      await processTaskReminders();
    } catch (error) {
      console.error('❌ Task reminder scheduler error:', error.message);
    }
  });

  console.log('📅 Task reminder scheduler started: checking deadlines every minute.');
};

module.exports = {
  startTaskReminderScheduler,
  processTaskReminders,
};
