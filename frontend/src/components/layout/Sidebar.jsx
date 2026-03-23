import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, CheckSquare, Calendar, Clock, Heart, BarChart3 } from 'lucide-react';
import './Sidebar.css'; // Assuming you have a CSS file

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/tasks', icon: CheckSquare, label: 'Tasks' },
    { path: '/calendar', icon: Calendar, label: 'Calendar' },
    { path: '/timetable', icon: Clock, label: 'Timetable' },
    { path: '/wellness', icon: Heart, label: 'Wellness' },
    { path: '/reports', icon: BarChart3, label: 'Reports' }
  ];

  return (
    <div className="sidebar">
      <ul className="sidebar-menu">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <li key={item.path}>
              <Link 
                to={item.path} 
                className={`sidebar-link ${isActive ? 'active' : ''}`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebar;