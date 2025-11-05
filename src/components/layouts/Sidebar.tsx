import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar: React.FC = () => {
  const { canAccessAdmin } = useAuth();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/invoices', label: 'Invoices', icon: '📄' },
    { path: '/clients', label: 'Clients', icon: '👥' },
    { path: '/expenses', label: 'Expenses', icon: '💰' },
    { path: '/reports', label: 'Reports', icon: '📈' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className="sidebar bg-light border-end" style={{ width: '250px', minHeight: '100vh' }}>
      <nav className="nav flex-column p-3">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active bg-primary text-white rounded' : 'text-dark'}`
            }
          >
            <span className="me-2">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}

        {canAccessAdmin && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active bg-primary text-white rounded' : 'text-dark'}`
            }
          >
            <span className="me-2">🔧</span>
            Admin
          </NavLink>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
