import React from 'react';
import { Calendar, AlertCircle } from 'lucide-react';

const TaskCard = ({ task, onToggleComplete, onDelete }) => {
  // Calculate if task is urgent (within 24 hours)
  const isUrgent = () => {
    const deadline = new Date(task.deadline);
    const now = new Date();
    const hoursUntil = (deadline - now) / (1000 * 60 * 60);
    return hoursUntil <= 24 && hoursUntil > 0;
  };

  // Format deadline date
  const formatDeadline = (dateString) => {
    const date = new Date(dateString);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <div className={`task-item ${task.status} priority-${task.priority}`}>
      <div className="task-content">
        <input
          type="checkbox"
          className="task-checkbox"
          checked={task.status === 'completed'}
          onChange={() => onToggleComplete(task.id)}
        />
        
        <div className="task-details">
          <div className="task-title">{task.title}</div>
          <div className="task-meta">
            <span className={`priority-badge ${task.priority}`}>
              {task.priority}
            </span>
            
            <span className="task-deadline">
              <Calendar size={14} />
              {formatDeadline(task.deadline)}
              {isUrgent() && <AlertCircle size={14} color="#E74C3C" />}
            </span>
            
            <span className={`task-status ${task.status}`}>
              {task.status}
            </span>
          </div>
        </div>
      </div>

      <div className="task-actions">
        <button 
          className="delete-btn" 
          onClick={() => onDelete(task.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
