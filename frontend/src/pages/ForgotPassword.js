import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { forgotPassword, resetPassword } from '../services/api';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    try {
      const { data } = await forgotPassword({ phone });
      setUserId(data.userId);
      setStep(2);
      toast.success('OTP sent to your phone');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await resetPassword({ userId, otp, newPassword });
      toast.success('Password reset successful! Please login');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-primary">Forgot Password</h2>
        
        {step === 1 ? (
          <form onSubmit={handleSendOTP}>
            <p className="mb-4 text-gray-600">Enter your phone number to receive OTP</p>
            <input
              type="tel"
              placeholder="Phone Number"
              className="w-full px-4 py-2 mb-6 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <button type="submit" className="w-full bg-primary text-white py-2 rounded-lg hover:bg-blue-700">
              Send OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <p className="mb-4 text-gray-600">Enter OTP and new password</p>
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="New Password"
              className="w-full px-4 py-2 mb-6 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button type="submit" className="w-full bg-primary text-white py-2 rounded-lg hover:bg-blue-700">
              Reset Password
            </button>
          </form>
        )}
        
        <div className="mt-4 text-center">
          <Link to="/login" className="text-primary hover:underline">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
