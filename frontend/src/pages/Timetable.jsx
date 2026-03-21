import React from 'react';
import { Clock, Coffee, Lightbulb } from 'lucide-react';
import '../styles/Timetable.css';

const Timetable = ({ tasks }) => {
  // Generate auto-timetable based on tasks
  const generateTimetable = () => {
    const pendingTasks = tasks.filter(task => task.status === 'pending');
    const highPriorityTasks = pendingTasks.filter(task => task.priority === 'high');
    const mediumPriorityTasks = pendingTasks.filter(task => task.priority === 'medium');
    const lowPriorityTasks = pendingTasks.filter(task => task.priority === 'low');

    // Base timetable structure (6-8 hours work with breaks)
    const timetable = [
      {
        time: '09:00 - 09:30',
        title: 'Morning Planning',
        description: 'Review tasks, set priorities, and plan your day',
        type: 'focus',
        icon: <Lightbulb size={18} />
      },
      {
        time: '09:30 - 11:30',
        title: highPriorityTasks[0]?.title || 'Focus Work Session',
        description: highPriorityTasks[0] 
          ? `Priority: ${highPriorityTasks[0].priority} | Deadline: ${new Date(highPriorityTasks[0].deadline).toLocaleDateString()}`
          : 'Deep work on your most important task',
        type: 'work',
        icon: <Clock size={18} />
      },
      {
        time: '11:30 - 11:45',
        title: 'Break Time',
        description: 'Stretch, hydrate, and rest your eyes',
        type: 'break',
        icon: <Coffee size={18} />
      },
      {
        time: '11:45 - 13:00',
        title: highPriorityTasks[1]?.title || mediumPriorityTasks[0]?.title || 'Work Session',
        description: (highPriorityTasks[1] || mediumPriorityTasks[0])
          ? `Priority: ${(highPriorityTasks[1] || mediumPriorityTasks[0]).priority}`
          : 'Continue with important tasks',
        type: 'work',
        icon: <Clock size={18} />
      },
      {
        time: '13:00 - 14:00',
        title: 'Lunch Break',
        description: 'Take a proper break. Eat mindfully and relax',
        type: 'break',
        icon: <Coffee size={18} />
      },
      {
        time: '14:00 - 15:30',
        title: mediumPriorityTasks[1]?.title || 'Afternoon Work Session',
        description: mediumPriorityTasks[1]
          ? `Priority: ${mediumPriorityTasks[1].priority}`
          : 'Focus on medium priority tasks',
        type: 'work',
        icon: <Clock size={18} />
      },
      {
        time: '15:30 - 15:45',
        title: 'Wellness Break',
        description: 'Short walk, breathing exercises, or meditation',
        type: 'break',
        icon: <Coffee size={18} />
      },
      {
        time: '15:45 - 17:00',
        title: lowPriorityTasks[0]?.title || 'Final Work Session',
        description: lowPriorityTasks[0]
          ? `Priority: ${lowPriorityTasks[0].priority}`
          : 'Wrap up remaining tasks',
        type: 'work',
        icon: <Clock size={18} />
      },
      {
        time: '17:00 - 17:30',
        title: 'Day Review & Planning',
        description: 'Review completed tasks and plan for tomorrow',
        type: 'focus',
        icon: <Lightbulb size={18} />
      }
    ];

    return timetable;
  };

  const timetable = generateTimetable();

  // Calculate statistics
  const workSlots = timetable.filter(slot => slot.type === 'work').length;
  const breakSlots = timetable.filter(slot => slot.type === 'break').length;
  const totalHours = 8.5;

  return (
    <div className="timetable-container">
      <div className="timetable-header">
        <h1>Daily Timetable</h1>
        <p>Auto-generated schedule based on your tasks</p>
      </div>

      {/* Info Cards */}
      <div className="timetable-info">
        <div className="info-card">
          <div className="info-card-label">Total Hours</div>
          <div className="info-card-value">{totalHours}h</div>
        </div>
        <div className="info-card">
          <div className="info-card-label">Work Sessions</div>
          <div className="info-card-value">{workSlots}</div>
        </div>
        <div className="info-card">
          <div className="info-card-label">Break Slots</div>
          <div className="info-card-value">{breakSlots}</div>
        </div>
        <div className="info-card">
          <div className="info-card-label">Pending Tasks</div>
          <div className="info-card-value">
            {tasks.filter(t => t.status === 'pending').length}
          </div>
        </div>
      </div>

      {/* Timetable */}
      <div className="timetable-section">
        <h2>Today's Schedule</h2>
        <div className="timetable-grid">
          {timetable.map((slot, index) => (
            <div key={index} className={`time-slot ${slot.type}`}>
              <div className="slot-time">
                {slot.icon}
                {slot.time}
              </div>
              <div className="slot-details">
                <div className="slot-title">{slot.title}</div>
                <div className="slot-description">{slot.description}</div>
                <span className={`slot-tag ${slot.type}`}>
                  {slot.type === 'work' && 'Work Session'}
                  {slot.type === 'break' && 'Break Time'}
                  {slot.type === 'focus' && 'Focus Time'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Wellness Tips */}
      <div className="wellness-tips">
        <h3>⚡ Productivity & Wellness Tips</h3>
        <div className="tips-list">
          <div className="tip-item">
            <span className="tip-icon">🧠</span>
            <span>Work in focused 90-120 minute blocks for maximum productivity</span>
          </div>
          <div className="tip-item">
            <span className="tip-icon">☕</span>
            <span>Take regular breaks to prevent burnout and maintain focus</span>
          </div>
          <div className="tip-item">
            <span className="tip-icon">💧</span>
            <span>Stay hydrated throughout the day - aim for 8 glasses of water</span>
          </div>
          <div className="tip-item">
            <span className="tip-icon">🏃</span>
            <span>Include physical movement during breaks to boost energy</span>
          </div>
          <div className="tip-item">
            <span className="tip-icon">🌙</span>
            <span>Avoid work 2 hours before bedtime for better sleep quality</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timetable;
