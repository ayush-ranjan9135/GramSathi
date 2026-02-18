import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaPhone, FaLock, FaEye, FaEyeSlash, FaArrowRight } from 'react-icons/fa';

const Login = () => {
  const [formData, setFormData] = useState({ phone: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await login(formData);
      loginUser(data.token, data.user);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSubmit(e);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white p-12 flex-col justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8 animate-fade-in">
            <span className="text-6xl">🌾</span>
            <div>
              <h1 className="text-4xl font-bold">GramSathi</h1>
              <p className="text-blue-200">Smart Village Governance</p>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold mb-4 animate-slide-up">
            Digitizing Village Governance for a Transparent Tomorrow
          </h2>
          
          <p className="text-lg text-blue-100 mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Empowering rural communities through technology. Manage complaints, track development projects, and ensure transparency in governance.
          </p>
          
          <div className="space-y-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">✓</div>
              <div>
                <h3 className="font-semibold">Real-time Complaint Tracking</h3>
                <p className="text-sm text-blue-200">Track and resolve citizen grievances efficiently</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">✓</div>
              <div>
                <h3 className="font-semibold">Budget Transparency</h3>
                <p className="text-sm text-blue-200">Complete visibility of fund allocation and spending</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">✓</div>
              <div>
                <h3 className="font-semibold">Project Monitoring</h3>
                <p className="text-sm text-blue-200">Track development work progress in real-time</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <span className="text-5xl">🌾</span>
            <div>
              <h1 className="text-3xl font-bold text-blue-600">GramSathi</h1>
              <p className="text-gray-600 text-sm">Smart Village Governance</p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-xl">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back!</h2>
              <p className="text-gray-600">Sign in to continue to your dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Phone Input */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaPhone className="text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    onKeyPress={handleKeyPress}
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    onKeyPress={handleKeyPress}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="text-gray-400 hover:text-gray-600" />
                    ) : (
                      <FaEye className="text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Forgot Password?
                </Link>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    Sign In <FaArrowRight />
                  </>
                )}
              </button>
            </form>

            {/* Register Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
                  Create Account
                </Link>
              </p>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500 mt-8">
            © 2024 GramSathi. Empowering Villages Through Technology.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
