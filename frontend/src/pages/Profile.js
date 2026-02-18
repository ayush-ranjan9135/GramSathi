import React, { useState, useEffect, useContext } from 'react';
import { getProfile, updateProfile } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaEdit, FaSave, FaTimes, FaCamera } from 'react-icons/fa';

const Profile = () => {
  const { user, loadUser } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', village: '', address: '', profilePic: ''
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data } = await getProfile();
      setProfile(data);
      setFormData({
        name: data.name || '',
        email: data.email || '',
        village: data.village || '',
        address: data.address || '',
        profilePic: data.profilePic || ''
      });
      setImagePreview(data.profilePic || null);
    } catch (error) {
      toast.error('Failed to load profile');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({ ...formData, profilePic: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      toast.success('Profile updated successfully');
      setIsEditing(false);
      loadProfile();
      loadUser();
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  if (!profile) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-blue-600 overflow-hidden">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <FaUser className="text-5xl" />
                  )}
                </div>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-all shadow-lg">
                    <FaCamera className="text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold">{profile.name}</h1>
                <p className="text-blue-100 capitalize mt-1">{profile.role}</p>
                <p className="text-blue-200 text-sm mt-2">Member since {new Date(profile.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Profile Information</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm"
                >
                  <FaEdit /> Edit Profile
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      name: profile.name || '',
                      email: profile.email || '',
                      village: profile.village || '',
                      address: profile.address || '',
                      profilePic: profile.profilePic || ''
                    });
                    setImagePreview(profile.profilePic || null);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all shadow-sm"
                >
                  <FaTimes /> Cancel
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                    <FaUser className="text-blue-600" /> Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                    <FaEnvelope className="text-blue-600" /> Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                    <FaMapMarkerAlt className="text-blue-600" /> Village
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.village}
                    onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                    <FaMapMarkerAlt className="text-blue-600" /> Address
                  </label>
                  <textarea
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-semibold shadow-sm"
                >
                  <FaSave /> Save Changes
                </button>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <FaUser className="text-2xl text-blue-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="text-lg font-semibold text-gray-800">{profile.name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <FaPhone className="text-2xl text-blue-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="text-lg font-semibold text-gray-800">{profile.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <FaEnvelope className="text-2xl text-blue-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="text-lg font-semibold text-gray-800">{profile.email || 'Not provided'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <FaMapMarkerAlt className="text-2xl text-blue-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Village</p>
                    <p className="text-lg font-semibold text-gray-800">{profile.village || 'Not provided'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <FaMapMarkerAlt className="text-2xl text-blue-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="text-lg font-semibold text-gray-800">{profile.address || 'Not provided'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-600">
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Account Status</p>
                    <p className="text-lg font-semibold text-blue-800">
                      {profile.isVerified ? '✓ Verified' : '⚠ Not Verified'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
