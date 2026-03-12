import React, { useState, useEffect, useContext } from 'react';
import { getEvents, createEvent, deleteEvent } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaClock, FaMapMarkerAlt, FaTrash, FaPlus, FaSearch, FaFilter } from 'react-icons/fa';

const Events = () => {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', date: '', time: '', location: '', type: 'Meeting'
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const { data } = await getEvents();
      setEvents(data);
    } catch (error) {
      toast.error('Failed to load events');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createEvent(formData);
      toast.success('Event created successfully');
      setShowForm(false);
      setFormData({ title: '', description: '', date: '', time: '', location: '', type: 'Meeting' });
      loadEvents();
    } catch (error) {
      toast.error('Failed to create event');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(id);
        toast.success('Event deleted successfully');
        loadEvents();
      } catch (error) {
        toast.error('Failed to delete event');
      }
    }
  };

  const getEventTypeColor = (type) => {
    const colors = {
      Meeting: 'bg-blue-100 text-blue-800',
      'Health Camp': 'bg-green-100 text-green-800',
      'Cultural Program': 'bg-purple-100 text-purple-800',
      'Vaccination Drive': 'bg-red-100 text-red-800',
      Other: 'bg-gray-100 text-gray-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');

  const getEventStatus = (date) => {
    const eventDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);
    
    if (eventDate > today) return 'upcoming';
    if (eventDate.getTime() === today.getTime()) return 'ongoing';
    return 'completed';
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'All' || 
                         event.type === filterType || 
                         (filterType === 'Upcoming' && getEventStatus(event.date) === 'upcoming') ||
                         (filterType === 'Completed' && getEventStatus(event.date) === 'completed');
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: events.length,
    upcoming: events.filter(e => getEventStatus(e.date) === 'upcoming').length,
    completed: events.filter(e => getEventStatus(e.date) === 'completed').length
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Village Events</h1>
            <p className="text-gray-600">Manage and track all village programs and meetings</p>
          </div>
          {(user?.role === 'admin' || user?.role === 'superadmin') && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2 shadow-sm"
            >
              <FaPlus className="text-sm" />
              {showForm ? 'Cancel' : 'Add Event'}
            </button>
          )}
        </div>
        <div className="h-px bg-gray-200 mt-6"></div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-sm text-gray-600 mb-1">Total Events</div>
          <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-sm text-gray-600 mb-1">Upcoming</div>
          <div className="text-3xl font-bold text-green-600">{stats.upcoming}</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-sm text-gray-600 mb-1">Completed</div>
          <div className="text-3xl font-bold text-gray-500">{stats.completed}</div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search events..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <select
            className="pl-10 pr-8 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="All">All Events</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Completed">Completed</option>
            <option value="Meeting">Meeting</option>
            <option value="Health Camp">Health Camp</option>
            <option value="Cultural Program">Cultural</option>
            <option value="Vaccination Drive">Vaccination</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
          <h2 className="text-xl font-bold mb-4">Create New Event</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Event Title"
              className="w-full px-4 py-2 mb-4 border rounded-lg"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <textarea
              placeholder="Description"
              className="w-full px-4 py-2 mb-4 border rounded-lg"
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="date"
                className="w-full px-4 py-2 border rounded-lg"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
              <input
                type="time"
                className="w-full px-4 py-2 border rounded-lg"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
              />
            </div>
            <input
              type="text"
              placeholder="Location"
              className="w-full px-4 py-2 mb-4 border rounded-lg"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
            <select
              className="w-full px-4 py-2 mb-4 border rounded-lg"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="Meeting">Gram Sabha Meeting</option>
              <option value="Health Camp">Health Camp</option>
              <option value="Cultural Program">Cultural Program</option>
              <option value="Vaccination Drive">Vaccination Drive</option>
              <option value="Other">Other</option>
            </select>
            <button type="submit" className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-all">
              Create Event
            </button>
          </form>
        </div>
      )}

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredEvents.map((event) => {
          const eventDate = new Date(event.date);
          const status = getEventStatus(event.date);
          
          return (
            <div 
              key={event._id} 
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 hover:scale-[1.01] flex"
            >
              {/* Date Box */}
              <div className={`w-20 flex flex-col items-center justify-center text-white ${
                status === 'upcoming' ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
                status === 'ongoing' ? 'bg-gradient-to-br from-green-500 to-green-600' :
                'bg-gradient-to-br from-gray-400 to-gray-500'
              }`}>
                <div className="text-3xl font-bold">{eventDate.getDate()}</div>
                <div className="text-xs uppercase tracking-wide">{eventDate.toLocaleDateString('en-US', { month: 'short' })}</div>
              </div>

              {/* Content */}
              <div className="flex-1 p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-900 leading-tight">{event.title}</h3>
                  <div className="flex items-center gap-2 ml-2">
                    {(user?.role === 'admin' || user?.role === 'superadmin') && (
                      <button 
                        onClick={() => handleDelete(event._id)} 
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      >
                        <FaTrash className="text-sm" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Status & Category */}
                <div className="flex items-center gap-2 mb-3">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                    status === 'upcoming' ? 'text-green-700' :
                    status === 'ongoing' ? 'text-yellow-700' :
                    'text-gray-500'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${
                      status === 'upcoming' ? 'bg-green-500' :
                      status === 'ongoing' ? 'bg-yellow-500' :
                      'bg-gray-400'
                    }`}></span>
                    {status === 'upcoming' ? 'Upcoming' : status === 'ongoing' ? 'Ongoing' : 'Completed'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
                    {event.type}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>

                {/* Event Details */}
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <FaClock className="text-blue-500 text-xs" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-blue-500 text-xs" />
                    <span className="line-clamp-1">{event.location}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredEvents.length === 0 && (
        <div className="bg-white p-16 rounded-xl shadow-sm border border-gray-100 text-center">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-500">{searchTerm || filterType !== 'All' ? 'Try adjusting your filters' : 'No events scheduled yet'}</p>
        </div>
      )}
    </div>
  );
};

export default Events;
