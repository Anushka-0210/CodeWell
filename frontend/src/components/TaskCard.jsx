import React, { useState, useEffect } from 'react';
import { Calendar, AlertCircle } from 'lucide-react';

const TaskCard = ({ task, onToggleComplete, onDelete, onUpdate }) => {
  // Calculate if task is urgent (within 24 hours)
  const isUrgent = () => {
    const deadline = new Date(task.deadline);
    const now = new Date();
    const hoursUntil = (deadline - now) / (1000 * 60 * 60);
    return hoursUntil <= 24 && hoursUntil > 0;
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setEditedTitle(task.title);
  }, [task.title]);

  // Format deadline date and time
  const formatDeadline = (dateString) => {
    const date = new Date(dateString);
    const options = {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    };
    return date.toLocaleString('en-US', options);
  };

  const handleEditSave = async () => {
    if (!editedTitle.trim()) {
      return;
    }

    if (!onUpdate) {
      setIsEditing(false);
      return;
    }

    setSaving(true);
    await onUpdate(task._id, { title: editedTitle.trim() });
    setSaving(false);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTitle(task.title);
    setIsEditing(false);
  };

  return (
    <div className={`task-item ${task.status} priority-${task.priority}`}>
      <div className="task-content">
        <input
          type="checkbox"
          className="task-checkbox"
          checked={task.status === 'completed'}
          onChange={() => onToggleComplete(task._id, task.status)}
        />
        
        <div className="task-details">
          {isEditing ? (
            <input
              className="task-title-input"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              disabled={saving}
            />
          ) : (
            <div className="task-title">{task.title}</div>
          )}
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
        {isEditing ? (
          <>
            <button
              className="save-btn"
              onClick={handleEditSave}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              className="cancel-btn"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              className="edit-btn"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
            <button 
              className="delete-btn" 
              onClick={() => onDelete(task._id)}
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskCard;