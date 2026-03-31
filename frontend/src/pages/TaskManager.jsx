import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import TaskCard from '../components/TaskCard';
import { createTask, deleteTask as deleteTaskAPI, toggleTaskStatus as toggleTaskAPI, updateTask as updateTaskAPI } from '../api/taskService';
import '../styles/Tasks.css';

const TaskManager = ({ tasks, setTasks }) => {
  const [filter, setFilter] = useState('all');
  const [newTask, setNewTask] = useState({
    title: '',
    priority: 'medium',
    deadline: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle form input changes
  const handleInputChange = (e) => {
    setNewTask({
      ...newTask,
      [e.target.name]: e.target.value
    });
  };

  // Add new task
  const handleAddTask = async (e) => {
    e.preventDefault();
    
    if (!newTask.title || !newTask.deadline) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await createTask({
        title: newTask.title,
        priority: newTask.priority,
        deadline: newTask.deadline,
      });

      if (response.success) {
        // Add new task to the list
        setTasks([response.data, ...tasks]);
        
        // Reset form
        setNewTask({
          title: '',
          priority: 'medium',
          deadline: ''
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  // Toggle task completion
  const handleToggleComplete = async (taskId, currentStatus) => {
    try {
      const response = await toggleTaskAPI(taskId, currentStatus);
      
      if (response.success) {
        // Update task in the list
        setTasks(tasks.map(task => 
          task._id === taskId ? { ...task, ...response.data } : task
        ));
      }
    } catch (err) {
      console.error('Failed to toggle task:', err);
      alert('Failed to update task status');
    }
  };

  // Delete task
  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const response = await deleteTaskAPI(taskId);
        
        if (response.success) {
          // Remove task from list
          setTasks(tasks.filter(task => task._id !== taskId));
        }
      } catch (err) {
        console.error('Failed to delete task:', err);
        alert('Failed to delete task');
      }
    }
  };

  // Update task title or details
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
      alert('Failed to update task');
    }
  };

  // Filter tasks
  const getFilteredTasks = () => {
    switch (filter) {
      case 'pending':
        return tasks.filter(task => task.status === 'pending');
      case 'completed':
        return tasks.filter(task => task.status === 'completed');
      case 'high':
        return tasks.filter(task => task.priority === 'high');
      case 'medium':
        return tasks.filter(task => task.priority === 'medium');
      case 'low':
        return tasks.filter(task => task.priority === 'low');
      default:
        return tasks;
    }
  };

  const filteredTasks = getFilteredTasks();

  return (
    <div className="task-manager-container">
      <div className="task-manager-header">
        <h1>Task Manager</h1>
        <p>Organize and track your tasks effectively</p>
      </div>

      {/* Add Task Form */}
      <div className="add-task-section">
        <h2>Add New Task</h2>
        
        {error && (
          <div style={{
            background: '#FADBD8',
            color: '#E74C3C',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '15px',
            fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}

        <form className="task-form" onSubmit={handleAddTask}>
          <div className="form-field">
            <label htmlFor="title">Task Title</label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Enter task title"
              value={newTask.title}
              onChange={handleInputChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-field">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              name="priority"
              value={newTask.priority}
              onChange={handleInputChange}
              disabled={loading}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="deadline">Deadline</label>
            <input
              type="datetime-local"
              id="deadline"
              name="deadline"
              value={newTask.deadline}
              onChange={handleInputChange}
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="add-task-btn" disabled={loading}>
            <Plus size={20} />
            {loading ? 'Adding...' : 'Add Task'}
          </button>
        </form>
      </div>

      {/* Task List */}
      <div className="task-list-section">
        <h2>Your Tasks ({filteredTasks.length})</h2>
        
        {/* Filter Buttons */}
        <div className="task-filters">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Tasks
          </button>
          <button 
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button 
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
          <button 
            className={`filter-btn ${filter === 'high' ? 'active' : ''}`}
            onClick={() => setFilter('high')}
          >
            High Priority
          </button>
          <button 
            className={`filter-btn ${filter === 'medium' ? 'active' : ''}`}
            onClick={() => setFilter('medium')}
          >
            Medium Priority
          </button>
          <button 
            className={`filter-btn ${filter === 'low' ? 'active' : ''}`}
            onClick={() => setFilter('low')}
          >
            Low Priority
          </button>
        </div>

        {/* Task Items */}
        <div className="task-list">
          {filteredTasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <p>No tasks found. Add a new task to get started!</p>
            </div>
          ) : (
            filteredTasks.map(task => (
              <TaskCard
                key={task._id}
                task={task}
                onToggleComplete={handleToggleComplete}
                onDelete={handleDeleteTask}
                onUpdate={handleUpdateTask}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskManager;
