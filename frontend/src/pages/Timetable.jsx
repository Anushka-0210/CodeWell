import React, { useEffect, useState } from 'react';
import TaskCard from '../components/TaskCard';
import { createTask as createTaskAPI, deleteTask as deleteTaskAPI, toggleTaskStatus as toggleTaskAPI, updateTask as updateTaskAPI } from '../api/taskService';
import '../styles/Timetable.css';
import '../styles/Tasks.css';

const defaultPrefs = {
  startTime: '09:00',
  workBlock: 90,
  breakLength: 15,
  showLunch: true,
  taskName: ''
};

const Timetable = ({ tasks = [], setTasks }) => {
  const [prefs, setPrefs] = useState(defaultPrefs);
  const [error, setError] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('planoraTimetablePrefs');
    if (stored) {
      try {
        setPrefs(JSON.parse(stored));
      } catch (error) {
        console.warn('Failed to load saved timetable preferences', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('planoraTimetablePrefs', JSON.stringify(prefs));
  }, [prefs]);

  const updatePref = (name, value) => {
    setPrefs(prev => ({ ...prev, [name]: value }));
  };

  const sortedTasks = [...tasks].sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  const pendingCount = tasks.filter(task => task.status === 'pending').length;
  const completedCount = tasks.filter(task => task.status === 'completed').length;

  const handleUpdateTask = async (taskId, updates) => {
    try {
      const response = await updateTaskAPI(taskId, updates);

      if (response.success) {
        setTasks(tasks.map(task =>
          task._id === taskId ? { ...task, ...response.data } : task
        ));
      }
    } catch (err) {
      console.error('Failed to update task:', err);
      setError('Unable to update task name.');
    }
  };

  const handleToggleComplete = async (taskId, currentStatus) => {
    try {
      const response = await toggleTaskAPI(taskId, currentStatus);
      if (response.success) {
        setTasks(tasks.map(task =>
          task._id === taskId ? { ...task, ...response.data } : task
        ));
      }
    } catch (err) {
      console.error('Failed to toggle task:', err);
      setError('Unable to update task status.');
    }
  };

  const buildDeadlineFromStartTime = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    const deadline = new Date();
    deadline.setHours(hours, minutes, 0, 0);
    if (deadline < new Date()) {
      deadline.setDate(deadline.getDate() + 1);
    }
    return deadline.toISOString();
  };

  const handleAddTask = async () => {
    setError('');

    if (!prefs.taskName.trim()) {
      setError('Enter a task name before adding it to the timetable.');
      return;
    }

    try {
      const taskPayload = {
        title: prefs.taskName.trim(),
        deadline: buildDeadlineFromStartTime(prefs.startTime),
        priority: 'medium'
      };
      const response = await createTaskAPI(taskPayload);

      if (response.success) {
        setTasks([...tasks, response.data]);
        updatePref('taskName', '');
      }
    } catch (err) {
      console.error('Failed to add task:', err);
      setError('Unable to add task to timetable.');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to remove this task from your timetable?')) {
      return;
    }

    try {
      const response = await deleteTaskAPI(taskId);
      if (response.success) {
        setTasks(tasks.filter(task => task._id !== taskId));
      }
    } catch (err) {
      console.error('Failed to delete task:', err);
      setError('Unable to delete task.');
    }
  };



  return (
    <div className="timetable-container">
      <div className="timetable-header">
        <h1>Daily Timetable</h1>
        <p>Manage your tasks directly and personalize your day without an auto-generated schedule.</p>
      </div>

      <div className="personalization-panel">
        <div className="panel-header">
          <h2>Personalize Your Timetable</h2>
          <p>Choose your preferred start time, work session length, and lunch option.</p>
        </div>
        <div className="settings-grid">
          <div className="setting-row">
            <label className="setting-label" htmlFor="task-name">Task Name</label>
            <input
              id="task-name"
              type="text"
              value={prefs.taskName}
              placeholder="Enter a task name"
              onChange={e => updatePref('taskName', e.target.value)}
            />
          </div>
          <div className="setting-row">
            <label className="setting-label" htmlFor="start-time">Start Time</label>
            <select
              id="start-time"
              value={prefs.startTime}
              onChange={e => updatePref('startTime', e.target.value)}
            >
              <option value="06:00">06:00</option>
              <option value="07:00">07:00</option>
              <option value="08:00">08:00</option>
              <option value="09:00">09:00</option>
              <option value="10:00">10:00</option>
              <option value="11:00">11:00</option>
              <option value="12:00">12:00</option>
              <option value="13:00">13:00</option>
              <option value="14:00">14:00</option>
            </select>
          </div>
          <div className="setting-row">
            <label className="setting-label" htmlFor="work-block">Work Session Length</label>
            <select
              id="work-block"
              value={prefs.workBlock}
              onChange={e => updatePref('workBlock', Number(e.target.value))}
            >
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>60 minutes</option>
              <option value={90}>90 minutes</option>
              <option value={120}>120 minutes</option>
              <option value={150}>150 minutes</option>
              <option value={180}>180 minutes</option>
            </select>
          </div>
          <div className="setting-row">
            <label className="setting-label" htmlFor="break-length">Break Length</label>
            <select
              id="break-length"
              value={prefs.breakLength}
              onChange={e => updatePref('breakLength', Number(e.target.value))}
            >
              <option value={5}>5 minutes</option>
              <option value={10}>10 minutes</option>
              <option value={15}>15 minutes</option>
              <option value={20}>20 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
            </select>
          </div>
          <div className="setting-row add-button-row">
            <button className="primary-btn" type="button" onClick={handleAddTask}>ADD</button>
          </div>
          <div className="setting-row">
            <label className="setting-label setting-toggle">
              <input
                type="checkbox"
                checked={prefs.showLunch}
                onChange={e => updatePref('showLunch', e.target.checked)}
              />
              Show lunch break
            </label>
          </div>
        </div>
      </div>

      <div className="timetable-info">
        <div className="info-card">
          <div className="info-card-label">Total Tasks</div>
          <div className="info-card-value">{tasks.length}</div>
        </div>
        <div className="info-card">
          <div className="info-card-label">Pending Tasks</div>
          <div className="info-card-value">{pendingCount}</div>
        </div>
        <div className="info-card">
          <div className="info-card-label">Completed Tasks</div>
          <div className="info-card-value">{completedCount}</div>
        </div>
        <div className="info-card">
          <div className="info-card-label">Start Time</div>
          <div className="info-card-value">{prefs.startTime}</div>
        </div>
        <div className="info-card">
          <div className="info-card-label">Preferred Task</div>
          <div className="info-card-value">{prefs.taskName || 'Any task'}</div>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="timetable-section">
        <h2>Your Timetable Tasks</h2>
        <p className="section-note">Edit task titles directly below to keep the timetable matching your actual plan.</p>
        {tasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🗓️</div>
            <p>No tasks available. Add tasks from the Task Manager to build your timetable.</p>
          </div>
        ) : (
          <div className="task-list">
            {sortedTasks.map(task => (
              <TaskCard
                key={task._id}
                task={task}
                onToggleComplete={handleToggleComplete}
                onDelete={handleDeleteTask}
                onUpdate={handleUpdateTask}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Timetable;
