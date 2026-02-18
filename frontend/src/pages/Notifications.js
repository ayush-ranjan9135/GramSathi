import React, { useState, useEffect } from 'react';
import { getNotifications, markAsRead } from '../services/api';
import { toast } from 'react-toastify';
import { FaBell, FaCheckCircle, FaExclamationCircle, FaCalendar, FaProjectDiagram, FaFilter } from 'react-icons/fa';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filterType, setFilterType] = useState('All');

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const { data } = await getNotifications();
      setNotifications(data);
    } catch (error) {
      toast.error('Failed to load notifications');
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      loadNotifications();
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const getIcon = (type) => {
    const icons = {
      Complaint: <FaExclamationCircle className="text-red-500" />,
      Event: <FaCalendar className="text-blue-500" />,
      Project: <FaProjectDiagram className="text-green-500" />,
      Announcement: <FaBell className="text-purple-500" />,
      General: <FaBell className="text-gray-500" />
    };
    return icons[type] || icons.General;
  };

  const filteredNotifications = notifications.filter(notification => 
    filterType === 'All' || notification.type === filterType
  );

  const stats = {
    total: notifications.length,
    byType: notifications.reduce((acc, notif) => {
      acc[notif.type] = (acc[notif.type] || 0) + 1;
      return acc;
    }, {})
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
        <p className="text-gray-600">Stay updated with latest announcements and updates</p>
        <div className="h-px bg-gray-200 mt-6"></div>
      </div>

      {/* Summary Stats */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="text-sm text-gray-600 mb-2">Total Notifications</div>
        <div className="text-3xl font-bold text-gray-900 mb-4">{stats.total}</div>
        <div className="flex gap-3 flex-wrap">
          {Object.entries(stats.byType).map(([type, count]) => (
            <span key={type} className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {type}: {count}
            </span>
          ))}
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="relative">
          <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <select
            className="pl-10 pr-8 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer w-full md:w-auto"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="All">All Types</option>
            <option value="Complaint">Complaint</option>
            <option value="Event">Event</option>
            <option value="Project">Project</option>
            <option value="Announcement">Announcement</option>
            <option value="General">General</option>
          </select>
        </div>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div className="bg-white p-16 rounded-xl shadow-sm border border-gray-100 text-center">
          <FaBell className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No notifications</h3>
          <p className="text-gray-500">{filterType !== 'All' ? 'Try adjusting your filter' : 'No notifications yet'}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <div
              key={notification._id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200"
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="text-2xl mt-1">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{notification.title}</h3>
                    <p className="text-gray-600 mb-3">{notification.message}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{new Date(notification.createdAt).toLocaleString()}</span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {notification.type}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleMarkAsRead(notification._id)}
                    className="text-green-500 hover:text-green-700 transition-colors p-2"
                    title="Mark as read"
                  >
                    <FaCheckCircle className="text-xl" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
