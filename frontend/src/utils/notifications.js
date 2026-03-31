// Browser Notification Utility Functions

/**
 * Request notification permission from user
 * @returns {Promise<String>} - Permission status
 */
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission;
  }

  return Notification.permission;
};

/**
 * Show a browser notification
 * @param {String} title - Notification title
 * @param {Object} options - Notification options
 */
export const showNotification = (title, options = {}) => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return;
  }

  if (Notification.permission === 'granted') {
    const notification = new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      ...options
    });

    // Auto-close notification after 5 seconds
    setTimeout(() => {
      notification.close();
    }, 5000);

    return notification;
  }
};

/**
 * Show deadline reminder notification
 * @param {Object} task - Task object
 */
export const showDeadlineReminder = (task) => {
  const deadline = new Date(task.deadline);
  const now = new Date();
  const hoursUntilDeadline = Math.round((deadline - now) / (1000 * 60 * 60));

  let body = '';
  if (hoursUntilDeadline <= 1) {
    body = `Due in less than 1 hour! Priority: ${task.priority}`;
  } else if (hoursUntilDeadline <= 24) {
    body = `Due in ${hoursUntilDeadline} hours. Priority: ${task.priority}`;
  } else {
    body = `Due on ${deadline.toLocaleDateString()}. Priority: ${task.priority}`;
  }

  showNotification(`📋 Task Reminder: ${task.title}`, {
    body: body,
    tag: `task-${task.id}`,
    requireInteraction: hoursUntilDeadline <= 1
  });
};

/**
 * Show break reminder notification
 * @param {Number} minutesWorked - Minutes of continuous work
 */
export const showBreakReminder = (minutesWorked) => {
  showNotification('⏰ Time for a Break!', {
    body: `You've been working for ${minutesWorked} minutes. Take a 15-minute break to refresh your mind.`,
    tag: 'break-reminder',
    requireInteraction: true
  });
};

/**
 * Show wellness notification
 * @param {String} message - Wellness message
 */
export const showWellnessNotification = (message) => {
  showNotification('💚 Wellness Reminder', {
    body: message,
    tag: 'wellness-reminder'
  });
};

/**
 * Check and send notifications for upcoming deadlines
 * @param {Array} tasks - Array of task objects
 */
export const checkUpcomingDeadlines = (tasks) => {
  const now = new Date();
  const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const upcomingTasks = tasks.filter(task => {
    if (task.status !== 'pending') return false;
    
    const taskDeadline = new Date(task.deadline);
    return taskDeadline >= now && taskDeadline <= next24Hours;
  });

  upcomingTasks.forEach(task => {
    showDeadlineReminder(task);
  });

  return upcomingTasks.length;
};

/**
 * Initialize notification system
 * Called on app load
 */
export const initializeNotifications = async () => {
  const permission = await requestNotificationPermission();
  
  if (permission === 'granted') {
    console.log('Notifications enabled');
    // Show welcome notification
    showNotification('🎉 Welcome to Planora', {
      body: 'Notifications are enabled. We\'ll remind you about deadlines and breaks.',
      tag: 'welcome'
    });
  } else {
    console.log('Notification permission denied');
  }

  return permission;
};
