import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getComplaintStats, getComplaints, getProjectStats, getFundStats, getUpcomingEvents, updateComplaint } from '../services/api';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from 'react-toastify';
import { FaDownload, FaCheck, FaEye, FaBell, FaTimes, FaCalendar, FaClock, FaMapMarkerAlt } from 'react-icons/fa';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({});
  const [events, setEvents] = useState([]);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadDashboard = async () => {
    try {
      if (user?.role === 'admin' || user?.role === 'superadmin') {
        const [complaints, projects, funds, complaintsList] = await Promise.all([
          getComplaintStats(),
          getProjectStats(),
          getFundStats(),
          getComplaints()
        ]);
        setStats({ complaints: complaints.data, projects: projects.data, funds: funds.data });
        setRecentComplaints(complaintsList.data.slice(0, 5));
      }
      const { data } = await getUpcomingEvents();
      setEvents(data.slice(0, 3));
    } catch (error) {
      console.error(error);
    }
  };

  const handleResolve = async (id) => {
    try {
      await updateComplaint(id, { status: 'Resolved' });
      toast.success('Complaint resolved');
      loadDashboard();
    } catch (error) {
      toast.error('Failed to resolve');
    }
  };

  const getTimeUntil = (date) => {
    const diff = new Date(date) - new Date();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? `${days} days` : 'Today';
  };

  const getPriorityColor = (priority) => {
    const colors = { Low: 'bg-green-100 text-green-800', Medium: 'bg-yellow-100 text-yellow-800', High: 'bg-red-100 text-red-800' };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: 'bg-yellow-100 text-yellow-800',
      'In Progress': 'bg-blue-100 text-blue-800',
      Resolved: 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name}</p>
        <div className="h-px bg-gray-200 mt-6"></div>
      </div>

      {(user?.role === 'admin' || user?.role === 'superadmin') ? (
        <>
          {/* Fund Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-sm text-white">
              <h3 className="text-sm opacity-90 mb-1">Total Received</h3>
              <p className="text-3xl font-bold">₹{stats.funds?.totalReceived?.toLocaleString() || 0}</p>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl shadow-sm text-white">
              <h3 className="text-sm opacity-90 mb-1">Total Spent</h3>
              <p className="text-3xl font-bold">₹{stats.funds?.totalSpent?.toLocaleString() || 0}</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-sm text-white">
              <h3 className="text-sm opacity-90 mb-1">Balance</h3>
              <p className="text-3xl font-bold">₹{stats.funds?.balance?.toLocaleString() || 0}</p>
            </div>
          </div>

          {/* Recent Complaints Table */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Recent Complaints</h3>
              <button className="text-blue-600 hover:underline text-sm">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Title</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Category</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Priority</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentComplaints.map((complaint) => (
                    <tr key={complaint._id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3">{complaint.title}</td>
                      <td className="px-4 py-3">{complaint.category}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(complaint.priority)}`}>
                          {complaint.priority}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(complaint.status)}`}>
                          {complaint.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {complaint.status !== 'Resolved' && (
                          <button
                            onClick={() => handleResolve(complaint._id)}
                            className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                          >
                            <FaCheck /> Resolve
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Fund Distribution</h3>
                <button className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
                  <FaDownload /> Export
                </button>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={stats.funds?.categoryWise || []} dataKey="total" nameKey="_id" cx="50%" cy="50%" outerRadius={80} label>
                    {(stats.funds?.categoryWise || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold mb-4">Complaints by Category</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.complaints?.categoryStats || []}>
                  <XAxis dataKey="_id" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Development Progress */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
            <h3 className="text-xl font-bold mb-4">Development Progress</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Total Projects</span>
                  <span className="text-sm font-bold">{stats.projects?.total || 0}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-blue-600 h-3 rounded-full" style={{ width: '100%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Completed Projects</span>
                  <span className="text-sm font-bold">{stats.projects?.completed || 0}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-green-600 h-3 rounded-full" style={{ width: `${(stats.projects?.completed / stats.projects?.total * 100) || 0}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Ongoing Projects</span>
                  <span className="text-sm font-bold">{stats.projects?.ongoing || 0}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-yellow-600 h-3 rounded-full" style={{ width: `${(stats.projects?.ongoing / stats.projects?.total * 100) || 0}%` }} />
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h3 className="text-xl font-bold mb-4">Your Activity</h3>
          <p className="text-gray-600">View your complaints and track their status</p>
        </div>
      )}

      {/* Upcoming Events */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold mb-4">Upcoming Events</h3>
        {events.length > 0 ? (
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event._id} className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-l-4 border-blue-500 hover:shadow-md transition-all">
                <div className="flex-1">
                  <h4 className="font-bold text-lg">{event.title}</h4>
                  <p className="text-sm text-gray-600">{new Date(event.date).toLocaleDateString()} at {event.time}</p>
                  <p className="text-sm text-gray-500">{event.location}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{getTimeUntil(event.date)}</p>
                    <p className="text-xs text-gray-500">remaining</p>
                  </div>
                  <button 
                    onClick={() => setSelectedEvent(event)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2 transition-all"
                  >
                    <FaEye /> Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-5xl mb-3">📅</div>
            <p className="text-gray-500">No upcoming events</p>
          </div>
        )}
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedEvent(null)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white relative">
              <button 
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
              >
                <FaTimes className="text-xl" />
              </button>
              <h2 className="text-2xl font-bold pr-10">{selectedEvent.title}</h2>
              <span className="inline-block mt-2 px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">
                {selectedEvent.type}
              </span>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">{selectedEvent.description}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <FaCalendar className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-semibold text-gray-900">{new Date(selectedEvent.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <FaClock className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="font-semibold text-gray-900">{selectedEvent.time}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 mb-6">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <FaMapMarkerAlt className="text-blue-600 text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-semibold text-gray-900">{selectedEvent.location}</p>
                </div>
              </div>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">Time Remaining:</span> {getTimeUntil(selectedEvent.date)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
