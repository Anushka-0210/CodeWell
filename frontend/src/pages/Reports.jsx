import React from 'react';
import { CheckCircle, Clock, TrendingUp, Award } from 'lucide-react';
import { calculateWellnessScore, calculateStressLevel } from '../utils/wellnessRules';
import '../styles/Reports.css';

const Reports = ({ tasks }) => {
  // Get current mood from localStorage
  const currentMood = localStorage.getItem('currentMood') || 'neutral';

  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const pendingTasks = tasks.filter(task => task.status === 'pending').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Calculate tasks by priority
  const highPriorityTasks = tasks.filter(task => task.priority === 'high').length;
  const mediumPriorityTasks = tasks.filter(task => task.priority === 'medium').length;
  const lowPriorityTasks = tasks.filter(task => task.priority === 'low').length;

  // Calculate wellness score
  const wellnessScore = calculateWellnessScore(tasks, currentMood, completedTasks);
  
  // Calculate stress level
  const stressData = calculateStressLevel(tasks);

  // Generate weekly overview (simulated data for 7 days)
  const generateWeeklyOverview = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map((day, index) => {
      // Simulate task completion for each day
      const tasksForDay = Math.floor(Math.random() * 5) + 1;
      const completedForDay = Math.floor(Math.random() * tasksForDay);
      
      return {
        day,
        total: tasksForDay,
        completed: completedForDay,
        status: completedForDay === tasksForDay ? 'completed' : 'pending'
      };
    });
  };

  const weeklyData = generateWeeklyOverview();

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h1>Performance Reports</h1>
        <p>Track your progress and wellness metrics</p>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="summary-icon">
            <CheckCircle size={48} color="#4CAF50" />
          </div>
          <div className="summary-value">{completedTasks}</div>
          <div className="summary-label">Completed Tasks</div>
          <div className="summary-trend positive">
            +{completionRate}% completion rate
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">
            <Clock size={48} color="#F39C12" />
          </div>
          <div className="summary-value">{pendingTasks}</div>
          <div className="summary-label">Pending Tasks</div>
          <div className="summary-trend">
            {pendingTasks > 5 ? 'High workload' : 'Manageable workload'}
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">
            <TrendingUp size={48} color="#2196F3" />
          </div>
          <div className="summary-value">{completionRate}%</div>
          <div className="summary-label">Completion Rate</div>
          <div className={`summary-trend ${completionRate >= 60 ? 'positive' : 'negative'}`}>
            {completionRate >= 60 ? 'Great progress!' : 'Keep pushing!'}
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">
            <Award size={48} color="#9C27B0" />
          </div>
          <div className="summary-value">{wellnessScore.score}</div>
          <div className="summary-label">Wellness Score</div>
          <div className="summary-trend positive">
            {wellnessScore.rating}
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        {/* Task Completion Chart */}
        <div className="chart-card">
          <h2>Task Completion Overview</h2>
          <div className="completion-chart">
            <div className="chart-circle">
              <svg width="200" height="200">
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="#E0E0E0"
                  strokeWidth="20"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="#4CAF50"
                  strokeWidth="20"
                  strokeDasharray={`${completionRate * 5.03} 503`}
                  strokeLinecap="round"
                  transform="rotate(-90 100 100)"
                />
              </svg>
              <div className="chart-percentage">
                <div className="percentage-value">{completionRate}%</div>
                <div className="percentage-label">Complete</div>
              </div>
            </div>
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="chart-card">
          <h2>Tasks by Priority</h2>
          <div className="chart-placeholder">
            <div style={{ width: '100%', padding: '20px' }}>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginBottom: '8px',
                  fontSize: '0.9rem',
                  color: 'var(--text-dark)'
                }}>
                  <span>High Priority</span>
                  <span>{highPriorityTasks} tasks</span>
                </div>
                <div style={{ 
                  height: '20px', 
                  background: '#E0E0E0', 
                  borderRadius: '10px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    height: '100%', 
                    width: `${totalTasks > 0 ? (highPriorityTasks / totalTasks) * 100 : 0}%`, 
                    background: '#E74C3C',
                    transition: 'width 0.5s ease'
                  }}></div>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginBottom: '8px',
                  fontSize: '0.9rem',
                  color: 'var(--text-dark)'
                }}>
                  <span>Medium Priority</span>
                  <span>{mediumPriorityTasks} tasks</span>
                </div>
                <div style={{ 
                  height: '20px', 
                  background: '#E0E0E0', 
                  borderRadius: '10px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    height: '100%', 
                    width: `${totalTasks > 0 ? (mediumPriorityTasks / totalTasks) * 100 : 0}%`, 
                    background: '#F39C12',
                    transition: 'width 0.5s ease'
                  }}></div>
                </div>
              </div>

              <div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginBottom: '8px',
                  fontSize: '0.9rem',
                  color: 'var(--text-dark)'
                }}>
                  <span>Low Priority</span>
                  <span>{lowPriorityTasks} tasks</span>
                </div>
                <div style={{ 
                  height: '20px', 
                  background: '#E0E0E0', 
                  borderRadius: '10px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    height: '100%', 
                    width: `${totalTasks > 0 ? (lowPriorityTasks / totalTasks) * 100 : 0}%`, 
                    background: '#27AE60',
                    transition: 'width 0.5s ease'
                  }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Overview */}
      <div className="weekly-overview">
        <h2>Weekly Performance</h2>
        <div className="week-days">
          {weeklyData.map((day, index) => (
            <div key={index} className="day-card">
              <div className="day-name">{day.day}</div>
              <div className="day-tasks">{day.completed}/{day.total}</div>
              <span className={`day-status ${day.status}`}>
                {day.status === 'completed' ? '✓ Done' : '⏳ Pending'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Wellness Score Section */}
      <div className="wellness-score-section">
        <h2>Wellness Score Breakdown</h2>
        
        <div className="score-display">
          <div className="score-circle">
            {wellnessScore.score}
          </div>
          <div className="score-details">
            <div className="score-title">{wellnessScore.rating}</div>
            <div className="score-description">
              Your wellness score is calculated based on stress levels, mood, and task completion.
              Keep maintaining a healthy balance between productivity and self-care.
            </div>
          </div>
        </div>

        <div className="score-factors">
          <div className="factor-card">
            <div className="factor-name">Stress Management</div>
            <div className="factor-bar">
              <div 
                className="factor-fill" 
                style={{ width: `${(wellnessScore.breakdown.stress / 25) * 100}%` }}
              ></div>
            </div>
            <div className="factor-value">
              {wellnessScore.breakdown.stress}/25 points
            </div>
          </div>

          <div className="factor-card">
            <div className="factor-name">Mood & Well-being</div>
            <div className="factor-bar">
              <div 
                className="factor-fill" 
                style={{ width: `${(wellnessScore.breakdown.mood / 25) * 100}%` }}
              ></div>
            </div>
            <div className="factor-value">
              {wellnessScore.breakdown.mood}/25 points
            </div>
          </div>

          <div className="factor-card">
            <div className="factor-name">Task Completion</div>
            <div className="factor-bar">
              <div 
                className="factor-fill" 
                style={{ width: `${(wellnessScore.breakdown.completion / 25) * 100}%` }}
              ></div>
            </div>
            <div className="factor-value">
              {wellnessScore.breakdown.completion}/25 points
            </div>
          </div>
        </div>
      </div>

      {/* Export Section */}
      <div className="export-section">
        <button className="export-btn" onClick={() => alert('Export feature coming soon!')}>
          <TrendingUp size={20} />
          Export Report
        </button>
      </div>
    </div>
  );
};

export default Reports;
