import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Complaints from './pages/Complaints';
import Projects from './pages/Projects';
import Funds from './pages/Funds';
import Events from './pages/Events';
import Schemes from './pages/Schemes';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const AppRoutes = () => {
  const { user } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
        <Route path="/forgot-password" element={user ? <Navigate to="/dashboard" /> : <ForgotPassword />} />
        
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Sidebar />
              <div className="lg:ml-64 ml-0">
                <Dashboard />
              </div>
            </PrivateRoute>
          }
        />
        <Route
          path="/complaints"
          element={
            <PrivateRoute>
              <Sidebar />
              <div className="lg:ml-64 ml-0">
                <Complaints />
              </div>
            </PrivateRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <PrivateRoute>
              <Sidebar />
              <div className="lg:ml-64 ml-0">
                <Projects />
              </div>
            </PrivateRoute>
          }
        />
        <Route
          path="/funds"
          element={
            <PrivateRoute>
              <Sidebar />
              <div className="lg:ml-64 ml-0">
                <Funds />
              </div>
            </PrivateRoute>
          }
        />
        <Route
          path="/events"
          element={
            <PrivateRoute>
              <Sidebar />
              <div className="lg:ml-64 ml-0">
                <Events />
              </div>
            </PrivateRoute>
          }
        />
        <Route
          path="/schemes"
          element={
            <PrivateRoute>
              <Sidebar />
              <div className="lg:ml-64 ml-0">
                <Schemes />
              </div>
            </PrivateRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <PrivateRoute>
              <Sidebar />
              <div className="lg:ml-64 ml-0">
                <Notifications />
              </div>
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Sidebar />
              <div className="lg:ml-64 ml-0">
                <Profile />
              </div>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider>
  );
}

export default App;
