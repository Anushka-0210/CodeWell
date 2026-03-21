import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, CheckSquare, Calendar, Clock, Heart, BarChart3, LogOut } from 'lucide-react';
import './Navbar.css';

const Navbar = ({ onLogout }) => {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/tasks', icon: CheckSquare, label: 'Tasks' },
    { path: '/calendar', icon: Calendar, label: 'Calendar' },
    { path: '/timetable', icon: Clock, label: 'Timetable' },
    { path: '/wellness', icon: Heart, label: 'Wellness' },
    { path: '/reports', icon: BarChart3, label: 'Reports' }
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Heart className="brand-icon" />
          <span className="brand-name">CodeWell</span>
        </div>

        <ul className="navbar-menu">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link 
                  to={item.path} 
                  className={`nav-link ${isActive ? 'active' : ''}`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <button className="logout-btn" onClick={onLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
