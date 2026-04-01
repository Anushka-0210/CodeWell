import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import TaskManager from './pages/TaskManager';
import CalendarPage from './pages/CalendarPage';
import Timetable from './pages/Timetable';
import Wellness from './pages/Wellness';
import Reports from './pages/Reports';
import LandingPage from './pages/landing/LandingPage';
import { dummyTasks } from './utils/dummyData';
import './styles/App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tasks, setTasks] = useState([]);

  const normalizeTask = (task) => {
    const baseId = task._id ?? task.id ?? String(Date.now() + Math.random());
    return {
      ...task,
      _id: task._id ?? task.id ?? baseId,
      id: task.id ?? task._id ?? baseId,
    };
  };

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    setIsAuthenticated(authStatus === 'true');

    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks);
      setTasks(parsedTasks.map(normalizeTask));
    } else {
      const normalizedTasks = dummyTasks.map(normalizeTask);
      setTasks(normalizedTasks);
      localStorage.setItem('tasks', JSON.stringify(normalizedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
  };

  const ProtectedRoute = ({ children }) => (isAuthenticated ? children : <Navigate to="/login" />);

  return (
    <Router>
      <div className="app-container">
        {isAuthenticated && <Navbar onLogout={handleLogout} />}
        <div className="app-layout">
          {isAuthenticated && <Sidebar />}

          <main className={isAuthenticated ? 'main-content' : 'main-content login-page'}>
            <Routes>
              <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} />
              <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register onLogin={handleLogin} />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard tasks={tasks} /></ProtectedRoute>} />
              <Route path="/tasks" element={<ProtectedRoute><TaskManager tasks={tasks} setTasks={setTasks} /></ProtectedRoute>} />
              <Route path="/calendar" element={<ProtectedRoute><CalendarPage tasks={tasks} /></ProtectedRoute>} />
              <Route path="/timetable" element={<ProtectedRoute><Timetable tasks={tasks} setTasks={setTasks} /></ProtectedRoute>} />
              <Route path="/wellness" element={<ProtectedRoute><Wellness tasks={tasks} /></ProtectedRoute>} />
              <Route path="/reports" element={<ProtectedRoute><Reports tasks={tasks} /></ProtectedRoute>} />
              <Route path="/landing" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LandingPage />} />
              <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LandingPage />} />
              <Route path="*" element={<Navigate to={isAuthenticated ? '/dashboard' : '/landing'} />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
