// Rule-Based Logic for Wellness System

/**
 * Calculate stress level based on pending tasks
 * @param {Array} tasks - Array of task objects
 * @returns {Object} - Stress level and details
 */
export const calculateStressLevel = (tasks) => {
  const pendingTasks = tasks.filter(task => task.status === 'pending');
  const highPriorityTasks = pendingTasks.filter(task => task.priority === 'high');
  
  // Get tasks due within 24 hours
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const urgentTasks = pendingTasks.filter(task => {
    const taskDeadline = new Date(task.deadline);
    return taskDeadline <= tomorrow;
  });

  let stressLevel = 'low';
  let stressScore = 0;
  let factors = [];

  // Rule 1: Too many pending tasks (>5)
  if (pendingTasks.length > 5) {
    stressScore += 30;
    factors.push(`${pendingTasks.length} pending tasks`);
  }

  // Rule 2: High priority tasks
  if (highPriorityTasks.length > 2) {
    stressScore += 25;
    factors.push(`${highPriorityTasks.length} high priority tasks`);
  }

  // Rule 3: Urgent deadlines (within 24 hours)
  if (urgentTasks.length > 0) {
    stressScore += 35;
    factors.push(`${urgentTasks.length} urgent deadline(s)`);
  }

  // Rule 4: Overdue tasks
  const overdueTasks = pendingTasks.filter(task => {
    const taskDeadline = new Date(task.deadline);
    return taskDeadline < now;
  });

  if (overdueTasks.length > 0) {
    stressScore += 40;
    factors.push(`${overdueTasks.length} overdue task(s)`);
  }

  // Determine stress level based on score
  if (stressScore >= 60) {
    stressLevel = 'high';
  } else if (stressScore >= 30) {
    stressLevel = 'medium';
  }

  return {
    level: stressLevel,
    score: stressScore,
    factors: factors.length > 0 ? factors : ['No major stress factors detected'],
    pendingCount: pendingTasks.length,
    urgentCount: urgentTasks.length,
    highPriorityCount: highPriorityTasks.length
  };
};

/**
 * Generate wellness messages based on mood and stress
 * @param {String} mood - Current mood (happy/neutral/sad)
 * @param {Object} stressData - Stress level data
 * @returns {Array} - Array of wellness message objects
 */
export const generateWellnessMessages = (mood, stressData) => {
  const messages = [];

  // Rule 1: Mood-based messages
  if (mood === 'sad') {
    messages.push({
      type: 'warning',
      title: 'Take Care of Yourself',
      text: "It's okay to feel down sometimes. Consider taking a break, talking to someone, or doing an activity you enjoy. Your mental health matters most.",
      icon: '💙'
    });
  } else if (mood === 'happy') {
    messages.push({
      type: 'positive',
      title: 'Great Energy!',
      text: "You're feeling positive! This is a great time to tackle important tasks while maintaining your balance.",
      icon: '✨'
    });
  }

  // Rule 2: High stress warning
  if (stressData.level === 'high') {
    messages.push({
      type: 'warning',
      title: 'High Stress Detected',
      text: `You have ${stressData.pendingCount} pending tasks with ${stressData.urgentCount} urgent deadline(s). Consider breaking tasks into smaller steps and taking regular breaks.`,
      icon: '⚠️'
    });
  }

  // Rule 3: Urgent deadline reminder
  if (stressData.urgentCount > 0) {
    messages.push({
      type: 'info',
      title: 'Upcoming Deadlines',
      text: `You have ${stressData.urgentCount} task(s) due within 24 hours. Prioritize these tasks and avoid multitasking.`,
      icon: '⏰'
    });
  }

  // Rule 4: Positive reinforcement for low stress
  if (stressData.level === 'low' && mood !== 'sad') {
    messages.push({
      type: 'positive',
      title: 'Well Balanced!',
      text: "Your workload looks manageable. Keep maintaining this healthy balance between work and rest.",
      icon: '🌟'
    });
  }

  return messages;
};

/**
 * Check if break reminder is needed
 * @param {Number} minutesWorked - Minutes of continuous work
 * @returns {Boolean} - Whether break is needed
 */
export const shouldShowBreakReminder = (minutesWorked) => {
  // Rule: Continuous work > 120 minutes (2 hours)
  return minutesWorked >= 120;
};

/**
 * Calculate wellness score
 * @param {Array} tasks - All tasks
 * @param {String} mood - Current mood
 * @param {Number} completedThisWeek - Tasks completed this week
 * @returns {Object} - Wellness score and breakdown
 */
export const calculateWellnessScore = (tasks, mood, completedThisWeek) => {
  let score = 50; // Base score
  
  const stressData = calculateStressLevel(tasks);
  
  // Factor 1: Stress level (max 25 points)
  if (stressData.level === 'low') {
    score += 25;
  } else if (stressData.level === 'medium') {
    score += 15;
  } else {
    score += 5;
  }

  // Factor 2: Mood (max 25 points)
  if (mood === 'happy') {
    score += 25;
  } else if (mood === 'neutral') {
    score += 15;
  } else {
    score += 5;
  }

  // Factor 3: Task completion rate (max 25 points)
  const completionRate = tasks.length > 0 
    ? (tasks.filter(t => t.status === 'completed').length / tasks.length) * 100 
    : 0;
  
  if (completionRate >= 70) {
    score += 25;
  } else if (completionRate >= 40) {
    score += 15;
  } else {
    score += 5;
  }

  // Ensure score is between 0 and 100
  score = Math.min(100, Math.max(0, score));

  return {
    score: Math.round(score),
    breakdown: {
      stress: stressData.level === 'low' ? 25 : (stressData.level === 'medium' ? 15 : 5),
      mood: mood === 'happy' ? 25 : (mood === 'neutral' ? 15 : 5),
      completion: completionRate >= 70 ? 25 : (completionRate >= 40 ? 15 : 5)
    },
    rating: score >= 75 ? 'Excellent' : (score >= 50 ? 'Good' : 'Needs Attention')
  };
};
