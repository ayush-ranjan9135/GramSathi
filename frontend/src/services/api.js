import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const register = (data) => API.post('/auth/register', data);
export const verifyOTP = (data) => API.post('/auth/verify-otp', data);
export const login = (data) => API.post('/auth/login', data);
export const forgotPassword = (data) => API.post('/auth/forgot-password', data);
export const resetPassword = (data) => API.post('/auth/reset-password', data);
export const getProfile = () => API.get('/auth/profile');
export const updateProfile = (data) => API.put('/auth/profile', data);

// Complaints
export const createComplaint = (data) => API.post('/complaints', data);
export const getComplaints = () => API.get('/complaints');
export const getComplaint = (id) => API.get(`/complaints/${id}`);
export const updateComplaint = (id, data) => API.put(`/complaints/${id}`, data);
export const assignComplaint = (id, workerId) => API.put(`/complaints/${id}/assign`, { workerId });
export const getComplaintStats = () => API.get('/complaints/stats');

// Projects
export const createProject = (data) => API.post('/projects', data);
export const getProjects = () => API.get('/projects');
export const getProject = (id) => API.get(`/projects/${id}`);
export const updateProject = (id, data) => API.put(`/projects/${id}`, data);
export const deleteProject = (id) => API.delete(`/projects/${id}`);
export const getProjectStats = () => API.get('/projects/stats');

// Funds
export const createFund = (data) => API.post('/funds', data);
export const getFunds = () => API.get('/funds');
export const getFundStats = () => API.get('/funds/stats');

// Events
export const createEvent = (data) => API.post('/events', data);
export const getEvents = () => API.get('/events');
export const getUpcomingEvents = () => API.get('/events/upcoming');
export const updateEvent = (id, data) => API.put(`/events/${id}`, data);
export const deleteEvent = (id) => API.delete(`/events/${id}`);

// Schemes
export const createScheme = (data) => API.post('/schemes', data);
export const getSchemes = () => API.get('/schemes');
export const getScheme = (id) => API.get(`/schemes/${id}`);
export const updateScheme = (id, data) => API.put(`/schemes/${id}`, data);
export const deleteScheme = (id) => API.delete(`/schemes/${id}`);

// Notifications
export const getNotifications = () => API.get('/notifications');
export const markAsRead = (id) => API.put(`/notifications/${id}/read`);
export const createAnnouncement = (data) => API.post('/notifications/announcement', data);
