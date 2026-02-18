import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaHome, FaExclamationCircle, FaProjectDiagram, FaMoneyBillWave, FaCalendarAlt, FaGift, FaBell, FaUser, FaSignOutAlt, FaBars, FaTimes, FaChevronDown, FaChevronRight, FaExclamationTriangle } from 'react-icons/fa';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState(['overview', 'management', 'community', 'account']);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        if (showLogoutModal) setShowLogoutModal(false);
        if (isMobileOpen) setIsMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [showLogoutModal, isMobileOpen]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    logout();
    navigate('/login');
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const isActive = (path) => location.pathname === path;

  const toggleSection = (section) => {
    setExpandedSections(prev =>
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    );
  };

  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

  const menuSections = [
    {
      id: 'overview',
      title: '📊 Overview',
      items: [
        { path: '/dashboard', icon: FaHome, label: 'Dashboard', roles: ['all'] }
      ]
    },
    {
      id: 'management',
      title: '🛠 Management',
      items: [
        { path: '/complaints', icon: FaExclamationCircle, label: 'Complaints', roles: ['all'] },
        { path: '/projects', icon: FaProjectDiagram, label: 'Projects', roles: ['admin', 'superadmin'] },
        { path: '/funds', icon: FaMoneyBillWave, label: 'Funds', roles: ['admin', 'superadmin'] }
      ]
    },
    {
      id: 'community',
      title: '📢 Community',
      items: [
        { path: '/events', icon: FaCalendarAlt, label: 'Events', roles: ['all'] },
        { path: '/schemes', icon: FaGift, label: 'Schemes', roles: ['all'] }
      ]
    },
    {
      id: 'account',
      title: '⚙ Account',
      items: [
        { path: '/notifications', icon: FaBell, label: 'Notifications', badge: 3, roles: ['all'] },
        { path: '/profile', icon: FaUser, label: 'Profile', roles: ['all'] }
      ]
    }
  ];

  const canAccessItem = (item) => {
    if (item.roles.includes('all')) return true;
    return item.roles.includes(user?.role);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Toggle Button */}
      <button
        onClick={() => {
          if (window.innerWidth < 1024) {
            setIsMobileOpen(!isMobileOpen);
          } else {
            setIsCollapsed(!isCollapsed);
          }
        }}
        className="fixed top-4 left-4 z-50 bg-blue-600 text-white p-3 rounded-lg shadow-lg hover:bg-blue-700 transition-all"
      >
        {(isMobileOpen || !isCollapsed) ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
      </button>

      {/* Sidebar */}
      <div className={`
        ${isCollapsed && !isMobileOpen ? 'lg:w-20' : 'lg:w-64'} 
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        w-64 bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 text-white min-h-screen 
        fixed left-0 top-0 shadow-2xl transition-all duration-300 z-40 overflow-y-auto
      `}>
        
        {/* Logo */}
        <div className={`p-6 border-b border-blue-700 mt-16 ${(isCollapsed && !isMobileOpen) ? 'text-center' : ''}`}>
          <Link to="/dashboard" className="flex items-center gap-3 hover:scale-105 transition-transform">
            <span className="text-4xl">🌾</span>
            {(!isCollapsed || isMobileOpen) && (
              <div>
                <h1 className="text-2xl font-bold">GramSathi</h1>
                <p className="text-xs text-blue-300">Village Management</p>
              </div>
            )}
          </Link>
        </div>

        {/* User Info */}
        {(!isCollapsed || isMobileOpen) && (
          <div className="p-4 border-b border-blue-700 bg-blue-900">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center overflow-hidden">
                {user?.profilePic ? (
                  <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <FaUser className="text-lg" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">{user?.name}</p>
                <p className="text-xs text-blue-300 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
        )}

        {/* Menu Sections */}
        <nav className="p-4 space-y-4">
          {menuSections.map((section) => {
            const visibleItems = section.items.filter(canAccessItem);
            if (visibleItems.length === 0) return null;

            return (
              <div key={section.id}>
                {(!isCollapsed || isMobileOpen) && (
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center justify-between text-blue-300 text-xs font-semibold uppercase mb-2 hover:text-white transition"
                  >
                    <span>{section.title}</span>
                    {expandedSections.includes(section.id) ? <FaChevronDown /> : <FaChevronRight />}
                  </button>
                )}
                
                {((isCollapsed && !isMobileOpen) || expandedSections.includes(section.id)) && (
                  <div className="space-y-1">
                    {visibleItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                            isActive(item.path)
                              ? 'bg-white text-blue-800 shadow-lg border-l-4 border-yellow-400'
                              : 'hover:bg-blue-700 hover:translate-x-1 hover:border-l-4 hover:border-blue-400'
                          }`}
                          title={(isCollapsed && !isMobileOpen) ? item.label : ''}
                        >
                          <Icon className={`text-lg ${isActive(item.path) ? 'text-blue-600' : 'group-hover:scale-110 transition-transform'}`} />
                          {(!isCollapsed || isMobileOpen) && (
                            <>
                              <span className={`font-medium flex-1 ${isActive(item.path) ? 'font-bold' : ''}`}>
                                {item.label}
                              </span>
                              {item.badge && (
                                <span className="bg-red-500 text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                                  {item.badge}
                                </span>
                              )}
                            </>
                          )}
                          {(isCollapsed && !isMobileOpen) && item.badge && (
                            <span className="absolute top-2 right-2 bg-red-500 text-xs rounded-full w-4 h-4 flex items-center justify-center">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-blue-700">
          <button
            onClick={handleLogoutClick}
            className={`w-full flex items-center ${(isCollapsed && !isMobileOpen) ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-lg bg-red-500 hover:bg-red-600 transition-all duration-200 hover:shadow-lg`}
            title={(isCollapsed && !isMobileOpen) ? 'Logout' : ''}
          >
            <FaSignOutAlt className="text-lg" />
            {(!isCollapsed || isMobileOpen) && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn"
          onClick={cancelLogout}
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-title"
        >
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-md w-full transform transition-all animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Icon */}
            <div className="flex justify-center pt-8 pb-4">
              <div className="bg-red-100 rounded-full p-4">
                <FaExclamationTriangle className="text-red-600 text-4xl" />
              </div>
            </div>

            {/* Content */}
            <div className="px-8 pb-6 text-center">
              <h2 id="logout-title" className="text-2xl font-bold text-gray-900 mb-3">
                Confirm Logout
              </h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to logout? You will need to login again to access your account.
              </p>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={cancelLogout}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all font-medium focus:outline-none focus:ring-2 focus:ring-gray-400"
                  autoFocus
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
