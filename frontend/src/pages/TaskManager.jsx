import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import TaskCard from '../components/TaskCard';
import '../styles/Tasks.css';

const TaskManager = ({ tasks, setTasks }) => {
  const [filter, setFilter] = useState('all');
  const [newTask, setNewTask] = useState({
    title: '',
    priority: 'medium',
    deadline: ''
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    setNewTask({
      ...newTask,
      [e.target.name]: e.target.value
    });
  };

  // Add new task
  const handleAddTask = (e) => {
    e.preventDefault();
    
    if (!newTask.title || !newTask.deadline) {
      alert('Please fill in all fields');
      return;
    }

    const task = {
      id: Date.now(),
      title: newTask.title,
      priority: newTask.priority,
      deadline: newTask.deadline,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setTasks([...tasks, task]);
    
    // Reset form
    setNewTask({
      title: '',
      priority: 'medium',
      deadline: ''
    });
  };

  // Toggle task completion
  const handleToggleComplete = (taskId) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          status: task.status === 'completed' ? 'pending' : 'completed'
        };
      }
      return task;
    }));
  };

  // Delete task
  const handleDeleteTask = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter(task => task.id !== taskId));
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
            />
          </div>

          <div className="form-field">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              name="priority"
              value={newTask.priority}
              onChange={handleInputChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="deadline">Deadline</label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={newTask.deadline}
              onChange={handleInputChange}
              required
            />
          </div>

          <button type="submit" className="add-task-btn">
            <Plus size={20} />
            Add Task
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
                key={task.id}
                task={task}
                onToggleComplete={handleToggleComplete}
                onDelete={handleDeleteTask}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskManager;
