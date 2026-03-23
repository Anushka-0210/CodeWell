import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Calendar as CalendarIcon } from 'lucide-react';
import '../styles/Calendar.css';

const CalendarPage = ({ tasks = [] }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Get tasks for a specific date
  const getTasksForDate = (date) => {
    const dateString = date.toDateString();
    return tasks.filter(task => {
      const taskDate = new Date(task.deadline).toDateString();
      return taskDate === dateString;
    });
  };

  // Check if a date has tasks
  const hasTasksOnDate = (date) => {
    return getTasksForDate(date).length > 0;
  };

  // Custom tile content to show dots on dates with tasks
  const tileContent = ({ date, view }) => {
    if (view === 'month' && hasTasksOnDate(date)) {
      return <div className="task-indicator"></div>;
    }
    return null;
  };

  // Custom tile class to highlight dates with tasks
  const tileClassName = ({ date, view }) => {
    if (view === 'month' && hasTasksOnDate(date)) {
      return 'react-calendar__tile--hasTask';
    }
    return null;
  };

  const selectedDateTasks = getTasksForDate(selectedDate);

  // Format date for display
  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <div className="calendar-page-container">
      <div className="calendar-page-header">
        <h1>Calendar</h1>
        <p>View your tasks organized by date</p>
      </div>

      <div className="calendar-layout">
        {/* Calendar Section */}
        <div className="calendar-section">
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileContent={tileContent}
            tileClassName={tileClassName}
          />

          {/* Legend */}
          <div className="calendar-legend">
            <h3>Legend</h3>
            <div className="legend-items">
              <div className="legend-item">
                <div className="legend-color" style={{ background: '#FFF9C4' }}></div>
                <span>Today</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ background: '#D5F5E3' }}></div>
                <span>Has Tasks</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ background: 'var(--primary-blue)' }}></div>
                <span>Selected Date</span>
              </div>
            </div>
          </div>
        </div>

        {/* Task Details Section */}
        <div className="task-details-section">
          <h2>Tasks</h2>
          <div className="selected-date">
            <CalendarIcon size={18} />
            {formatDate(selectedDate)}
          </div>

          <div className="date-tasks-list">
            {selectedDateTasks.length === 0 ? (
              <div className="no-tasks-message">
                <div className="no-tasks-icon">📅</div>
                <p>No tasks scheduled for this date</p>
              </div>
            ) : (
              selectedDateTasks.map(task => (
                <div key={task.id} className="date-task-item">
                  <div className="date-task-title">{task.title}</div>
                  <div className="date-task-info">
                    <span className={`priority-badge ${task.priority}`}>
                      {task.priority}
                    </span>
                    <span className={`task-status ${task.status}`}>
                      {task.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Additional CSS for task indicator */}
      <style jsx>{`
        .task-indicator {
          width: 6px;
          height: 6px;
          background: var(--primary-blue);
          border-radius: 50%;
          margin: 2px auto 0;
        }
      `}</style>
    </div>
  );
};

export default CalendarPage;