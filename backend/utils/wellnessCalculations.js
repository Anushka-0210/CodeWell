// Calculate stress level based on tasks
const calculateStressLevel = (tasks) => {
  const pendingTasks = tasks.filter((task) => task.status === 'pending');
  const highPriorityTasks = pendingTasks.filter(
    (task) => task.priority === 'high'
  );

  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const urgentTasks = pendingTasks.filter((task) => {
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

  // Rule 3: Urgent deadlines
  if (urgentTasks.length > 0) {
    stressScore += 35;
    factors.push(`${urgentTasks.length} urgent deadline(s)`);
  }

  // Rule 4: Overdue tasks
  const overdueTasks = pendingTasks.filter((task) => {
    const taskDeadline = new Date(task.deadline);
    return taskDeadline < now;
  });

  if (overdueTasks.length > 0) {
    stressScore += 40;
    factors.push(`${overdueTasks.length} overdue task(s)`);
  }

  // Determine stress level
  if (stressScore >= 60) {
    stressLevel = 'high';
  } else if (stressScore >= 30) {
    stressLevel = 'medium';
  }

  return {
    level: stressLevel,
    score: stressScore,
    factors: factors.length > 0 ? factors : ['No major stress factors'],
    pendingCount: pendingTasks.length,
    urgentCount: urgentTasks.length,
    highPriorityCount: highPriorityTasks.length,
  };
};

// Calculate wellness score
const calculateWellnessScore = (tasks, mood, completedThisWeek) => {
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
  const completionRate =
    tasks.length > 0
      ? (tasks.filter((t) => t.status === 'completed').length / tasks.length) *
        100
      : 0;

  if (completionRate >= 70) {
    score += 25;
  } else if (completionRate >= 40) {
    score += 15;
  } else {
    score += 5;
  }

  score = Math.min(100, Math.max(0, score));

  return {
    score: Math.round(score),
    breakdown: {
      stress:
        stressData.level === 'low' ? 25 : stressData.level === 'medium' ? 15 : 5,
      mood: mood === 'happy' ? 25 : mood === 'neutral' ? 15 : 5,
      completion: completionRate >= 70 ? 25 : completionRate >= 40 ? 15 : 5,
    },
    rating: score >= 75 ? 'Excellent' : score >= 50 ? 'Good' : 'Needs Attention',
  };
};

module.exports = {
  calculateStressLevel,
  calculateWellnessScore,
};
