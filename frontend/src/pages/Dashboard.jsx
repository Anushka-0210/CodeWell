import React, { useEffect } from 'react';
import { CheckCircle, Clock, Activity } from 'lucide-react';
import { initializeNotifications } from '../utils/notifications';
import { calculateStressLevel } from '../utils/wellnessRules';
import '../styles/Dashboard.css';

const Dashboard = ({ tasks }) => {
  // Get current time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Get user name from localStorage or use default
  const userName = localStorage.getItem('userName') || 'Developer';

  // Calculate tasks due today
  const getTasksDueToday = () => {
    const today = new Date().toDateString();
    return tasks.filter(task => {
      const taskDate = new Date(task.deadline).toDateString();
      return taskDate === today && task.status === 'pending';
    });
  };

  // Calculate upcoming deadlines (next 7 days)
  const getUpcomingDeadlines = () => {
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return tasks.filter(task => {
      const taskDate = new Date(task.deadline);
      return taskDate >= now && taskDate <= nextWeek && task.status === 'pending';
    });
  };

  // Calculate stress level
  const stressData = calculateStressLevel(tasks);

  // Calculate weekly progress
  const calculateWeeklyProgress = () => {
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const totalTasks = tasks.length;
    
    if (totalTasks === 0) return 0;
    return Math.round((completedTasks / totalTasks) * 100);
  };

  const tasksDueToday = getTasksDueToday();
  const upcomingDeadlines = getUpcomingDeadlines();
  const weeklyProgress = calculateWeeklyProgress();

  // Request notification permission on component mount
  useEffect(() => {
    initializeNotifications();
  }, []);

  return (
    <div className="dashboard-container">
      {/* Greeting Section */}
      <div className="dashboard-greeting">
        <h1>{getGreeting()}, {userName}! 👋</h1>
        <p>Here's your wellness overview for today</p>
      </div>

      {/* Overview Cards */}
      <div className="overview-cards">
        {/* Tasks Due Today */}
        <div className="overview-card tasks">
          <div className="card-header">
            <span className="card-title">Tasks Due Today</span>
            <CheckCircle className="card-icon" color="#6B9BD1" />
          </div>
          <div className="card-value">{tasksDueToday.length}</div>
          <div className="card-subtitle">
            {tasksDueToday.length === 0 
              ? 'Great! No tasks due today' 
              : 'Focus on completing these'}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="overview-card deadlines">
          <div className="card-header">
            <span className="card-title">Upcoming (7 Days)</span>
            <Clock className="card-icon" color="#F7DC6F" />
          </div>
          <div className="card-value">{upcomingDeadlines.length}</div>
          <div className="card-subtitle">
            {upcomingDeadlines.length === 0 
              ? 'No upcoming deadlines' 
              : 'Plan ahead for success'}
          </div>
        </div>

        {/* Stress Level */}
        <div className="overview-card stress">
          <div className="card-header">
            <span className="card-title">Stress Level</span>
            <Activity className="card-icon" color="#7EC8A3" />
          </div>
          <div className="card-value" style={{ fontSize: '2rem' }}>
            {stressData.level.charAt(0).toUpperCase() + stressData.level.slice(1)}
          </div>
          <span className={`stress-badge ${stressData.level}`}>
            {stressData.level === 'low' && '😌 Relaxed'}
            {stressData.level === 'medium' && '😐 Moderate'}
            {stressData.level === 'high' && '😰 High'}
          </span>
        </div>
      </div>

      {/* Weekly Progress */}
      <div className="progress-section">
        <h2>Weekly Progress</h2>
        <div className="progress-bar-container">
          <div 
            className="progress-bar" 
            style={{ width: `${weeklyProgress}%` }}
          >
            {weeklyProgress > 10 && `${weeklyProgress}%`}
          </div>
        </div>
        <div className="progress-details">
          <span>Completed: {tasks.filter(t => t.status === 'completed').length} tasks</span>
          <span>Total: {tasks.length} tasks</span>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="progress-section">
        <h2>💡 Quick Tips for Today</h2>
        <ul style={{ lineHeight: '2', color: 'var(--text-light)' }}>
          <li>Take a 5-minute break every hour to avoid burnout</li>
          <li>Prioritize high-priority tasks during your peak energy hours</li>
          <li>Stay hydrated and maintain good posture while working</li>
          <li>If feeling overwhelmed, break large tasks into smaller steps</li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
