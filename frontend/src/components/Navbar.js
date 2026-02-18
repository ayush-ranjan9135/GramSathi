import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaBell, FaUser, FaSignOutAlt, FaHome, FaExclamationCircle, FaProjectDiagram, FaMoneyBillWave, FaCalendarAlt, FaGift } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" className="text-2xl font-bold hover:scale-105 transition-transform duration-200 flex items-center gap-2">
            <span className="text-3xl">🌾</span>
            <span>GramSathi</span>
          </Link>

          <div className="flex gap-2 items-center">
            <Link 
              to="/dashboard" 
              className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                isActive('/dashboard') 
                  ? 'bg-white text-blue-600 shadow-md' 
                  : 'hover:bg-blue-700 hover:shadow-md'
              }`}
            >
              <FaHome /> Dashboard
            </Link>
            <Link 
              to="/complaints" 
              className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                isActive('/complaints') 
                  ? 'bg-white text-blue-600 shadow-md' 
                  : 'hover:bg-blue-700 hover:shadow-md'
              }`}
            >
              <FaExclamationCircle /> Complaints
            </Link>
            <Link 
              to="/projects" 
              className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                isActive('/projects') 
                  ? 'bg-white text-blue-600 shadow-md' 
                  : 'hover:bg-blue-700 hover:shadow-md'
              }`}
            >
              <FaProjectDiagram /> Projects
            </Link>
            <Link 
              to="/funds" 
              className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                isActive('/funds') 
                  ? 'bg-white text-blue-600 shadow-md' 
                  : 'hover:bg-blue-700 hover:shadow-md'
              }`}
            >
              <FaMoneyBillWave /> Funds
            </Link>
            <Link 
              to="/events" 
              className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                isActive('/events') 
                  ? 'bg-white text-blue-600 shadow-md' 
                  : 'hover:bg-blue-700 hover:shadow-md'
              }`}
            >
              <FaCalendarAlt /> Events
            </Link>
            <Link 
              to="/schemes" 
              className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                isActive('/schemes') 
                  ? 'bg-white text-blue-600 shadow-md' 
                  : 'hover:bg-blue-700 hover:shadow-md'
              }`}
            >
              <FaGift /> Schemes
            </Link>
            
            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-blue-400">
              <Link to="/notifications" className="hover:scale-110 transition-transform duration-200 relative">
                <FaBell className="text-xl" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
              </Link>
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-700 rounded-lg hover:bg-blue-600 transition-colors duration-200">
                <FaUser />
                <span className="font-medium">{user?.name}</span>
                <span className="text-xs bg-blue-500 px-2 py-0.5 rounded-full">{user?.role}</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-red-500 rounded-lg transition-all duration-200 hover:scale-110"
                title="Logout"
              >
                <FaSignOutAlt className="text-xl" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
