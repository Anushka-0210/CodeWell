const cron = require('node-cron');
const { sendReminder } = require('./emailService');

const scheduledTasks = new Map();
const ONE_HOUR_MS = 60 * 60 * 1000;
const TWENTY_FOUR_HOURS_MS = 24 * ONE_HOUR_MS;
const TEN_MINUTES_MS = 10 * 60 * 1000;

const formatDeadline = (deadline) => new Date(deadline).toLocaleString();

const buildReminderPayload = (task, type) => {
  const deadlineText = formatDeadline(task.deadline);
  const subject = type === 'high-priority'
    ? `High priority reminder: ${task.title} is due soon`
    : `Task reminder: ${task.title} is due in 24 hours`;

  const text = `Hello,

Your task "${task.title}" is due on ${deadlineText}.

Priority: ${task.priority}
Reminder type: ${type}

${task.description ? `Details: ${task.description}

` : ''}Please complete it before the deadline.

Thanks,
Planora`;

  const html = `
    <p>Hello,</p>
    <p>Your task <strong>${task.title}</strong> is due on <strong>${deadlineText}</strong>.</p>
    <p><strong>Priority:</strong> ${task.priority}</p>
    <p><strong>Reminder type:</strong> ${type}</p>
    ${task.description ? `<p><strong>Details:</strong> ${task.description}</p>` : ''}
    <p>Please complete it before the deadline.</p>
    <p>Thanks,<br/>Planora</p>
  `;

  return {
    subject,
    text,
    html,
  };
};

const sendTaskReminder = async (task, userEmail, type) => {
  const payload = buildReminderPayload(task, type);
  try {
    await sendReminder({
      to: userEmail,
      subject: payload.subject,
      text: payload.text,
      html: payload.html,
    });
    console.log(`✅ Sent ${type} reminder for task ${task.id} to ${userEmail}`);
  } catch (error) {
    console.error(`❌ Failed to send ${type} reminder for task ${task.id}:`, error.message);
  }
};

const processScheduledTasks = async () => {
  const now = Date.now();

  for (const [taskId, entry] of scheduledTasks.entries()) {
    const { task, userEmail, reminder24hSent, lastHighReminderAt } = entry;
    const deadline = task.deadline.getTime();

    if (now >= deadline) {
      scheduledTasks.delete(taskId);
      continue;
    }

    const timeUntilDeadline = deadline - now;
    const inWindow = timeUntilDeadline <= TWENTY_FOUR_HOURS_MS && timeUntilDeadline > 0;

    if (!reminder24hSent && timeUntilDeadline <= TWENTY_FOUR_HOURS_MS) {
      await sendTaskReminder(task, userEmail, '24-hour');
      entry.reminder24hSent = true;
    }

    if (task.priority === 'High' && inWindow) {
      const shouldSendHigh = !lastHighReminderAt || now - lastHighReminderAt >= TEN_MINUTES_MS;
      if (shouldSendHigh) {
        await sendTaskReminder(task, userEmail, 'high-priority');
        entry.lastHighReminderAt = now;
      }
    }
  }
};

cron.schedule('* * * * *', processScheduledTasks, {
  scheduled: true,
});

const scheduleTask = (task, userEmail) => {
  cancelTask(task.id);

  const normalizedTask = {
    id: task.id,
    title: task.title,
    priority: task.priority,
    deadline: new Date(task.deadline),
    description: task.description || '',
  };

  if (Number.isNaN(normalizedTask.deadline.getTime())) {
    throw new Error('Invalid deadline date');
  }

  scheduledTasks.set(task.id, {
    task: normalizedTask,
    userEmail,
    reminder24hSent: false,
    lastHighReminderAt: null,
  });

  return {
    reminder24h: normalizedTask.deadline.getTime() - Date.now() > TWENTY_FOUR_HOURS_MS,
    highPriorityRepeats: normalizedTask.priority === 'High',
    repeatInterval: normalizedTask.priority === 'High'
      ? 'every 10 minutes in the 24h window'
      : null,
  };
};

const cancelTask = (taskId) => {
  return scheduledTasks.delete(taskId);
};

const updateTask = (task, userEmail) => {
  cancelTask(task.id);
  return scheduleTask(task, userEmail);
};

const completeTask = (taskId) => {
  return cancelTask(taskId);
};

const listScheduled = () => {
  return Array.from(scheduledTasks.values()).map((entry) => ({
    taskId: entry.task.id,
    title: entry.task.title,
    priority: entry.task.priority,
    deadline: entry.task.deadline.toISOString(),
    userEmail: entry.userEmail,
    reminder24hSent: entry.reminder24hSent,
    lastHighReminderAt: entry.lastHighReminderAt ? new Date(entry.lastHighReminderAt).toISOString() : null,
  }));
};

module.exports = {
  scheduleTask,
  cancelTask,
  updateTask,
  completeTask,
  listScheduled,
};
