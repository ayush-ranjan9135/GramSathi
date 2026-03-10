import React, { useState, useEffect, useContext } from 'react';
import { getComplaints, createComplaint, updateComplaint } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaPlus, FaSearch, FaFilter, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

const Complaints = () => {
  const { user } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingComplaint, setEditingComplaint] = useState(null);
  const [formData, setFormData] = useState({
    title: '', description: '', category: 'Water', priority: 'Medium', address: '', photo: ''
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    try {
      const { data } = await getComplaints();
      setComplaints(data);
    } catch (error) {
      toast.error('Failed to load complaints');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createComplaint(formData);
      toast.success('Complaint submitted successfully');
      setShowForm(false);
      setFormData({ title: '', description: '', category: 'Water', priority: 'Medium', address: '', photo: '' });
      setPhotoPreview(null);
      loadComplaints();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit complaint');
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        setFormData({ ...formData, photo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStatusUpdate = async (complaintId, newStatus) => {
    try {
      await updateComplaint(complaintId, { status: newStatus });
      toast.success('Status updated successfully');
      loadComplaints();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleResolutionUpdate = async (complaintId, resolutionNote) => {
    try {
      await updateComplaint(complaintId, { status: 'Resolved', resolutionNote });
      toast.success('Complaint resolved successfully');
      setEditingComplaint(null);
      loadComplaints();
    } catch (error) {
      toast.error('Failed to resolve complaint');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: 'bg-yellow-100 text-yellow-800',
      Assigned: 'bg-blue-100 text-blue-800',
      'In Progress': 'bg-purple-100 text-purple-800',
      Resolved: 'bg-green-100 text-green-800',
      Rejected: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || complaint.status === filterStatus;
    const matchesCategory = filterCategory === 'All' || complaint.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'Pending').length,
    inProgress: complaints.filter(c => c.status === 'In Progress').length,
    resolved: complaints.filter(c => c.status === 'Resolved').length
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Complaints Management</h1>
            <p className="text-gray-600">Track and manage village complaints efficiently</p>
          </div>
          {user?.role === 'villager' && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2 shadow-sm"
            >
              <FaPlus className="text-sm" />
              {showForm ? 'Cancel' : 'New Complaint'}
            </button>
          )}
        </div>
        <div className="h-px bg-gray-200 mt-6"></div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-sm text-gray-600 mb-1">Total Complaints</div>
          <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-sm text-gray-600 mb-1">Pending</div>
          <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-sm text-gray-600 mb-1">In Progress</div>
          <div className="text-3xl font-bold text-purple-600">{stats.inProgress}</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-sm text-gray-600 mb-1">Resolved</div>
          <div className="text-3xl font-bold text-green-600">{stats.resolved}</div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search complaints..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <select
            className="pl-10 pr-8 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        <div className="relative">
          <select
            className="pl-4 pr-8 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Water">Water</option>
            <option value="Road">Road</option>
            <option value="Electricity">Electricity</option>
            <option value="Sanitation">Sanitation</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
          <h2 className="text-xl font-bold mb-4">Submit New Complaint</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Title"
              className="w-full px-4 py-2 mb-4 border rounded-lg"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <textarea
              placeholder="Description"
              className="w-full px-4 py-2 mb-4 border rounded-lg"
              rows="4"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
            <select
              className="w-full px-4 py-2 mb-4 border rounded-lg"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="Water">Water</option>
              <option value="Road">Road</option>
              <option value="Electricity">Electricity</option>
              <option value="Sanitation">Sanitation</option>
              <option value="Other">Other</option>
            </select>
            <select
              className="w-full px-4 py-2 mb-4 border rounded-lg"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <input
              type="text"
              placeholder="Location/Address"
              className="w-full px-4 py-2 mb-4 border rounded-lg"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Upload Photo (Optional)</label>
              <input
                type="file"
                accept="image/*"
                className="w-full px-4 py-2 border rounded-lg"
                onChange={handlePhotoChange}
              />
              {photoPreview && (
                <img src={photoPreview} alt="Preview" className="mt-2 h-32 rounded" />
              )}
            </div>
            <button type="submit" className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-all">
              Submit Complaint
            </button>
          </form>
        </div>
      )}

      {/* Complaints Grid */}
      <div className="grid grid-cols-1 gap-6">
        {filteredComplaints.map((complaint) => (
          <div key={complaint._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200">
            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{complaint.title}</h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                      {complaint.status}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {complaint.category}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${complaint.priority === 'High' ? 'bg-red-100 text-red-800' : complaint.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                      {complaint.priority} Priority
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 mb-4">{complaint.description}</p>
              <div className="flex gap-4 text-sm text-gray-500 flex-wrap">
                {complaint.address && (
                  <div className="flex items-center gap-1">
                    <FaMapMarkerAlt className="text-blue-500" />
                    <span>{complaint.address}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <FaClock className="text-blue-500" />
                  <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {(user?.role === 'admin' || user?.role === 'worker' || user?.role === 'superadmin') && (
                <div className="mt-4 pt-4 border-t">
                  <div className="flex gap-2 flex-wrap">
                    {complaint.status === 'Pending' && (
                      <button
                        onClick={() => handleStatusUpdate(complaint._id, 'In Progress')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                      >
                        Start Work
                      </button>
                    )}
                    {complaint.status === 'In Progress' && (
                      <>
                        <button
                          onClick={() => setEditingComplaint(complaint._id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                        >
                          Mark as Resolved
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(complaint._id, 'Pending')}
                          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition text-sm"
                        >
                          Move to Pending
                        </button>
                      </>
                    )}
                    {complaint.status === 'Pending' && user?.role === 'admin' && (
                      <button
                        onClick={() => handleStatusUpdate(complaint._id, 'Rejected')}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
                      >
                        Reject
                      </button>
                    )}
                  </div>

                  {editingComplaint === complaint._id && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <label className="block text-gray-700 mb-2 font-medium">Resolution Note</label>
                      <textarea
                        className="w-full px-4 py-2 border rounded-lg mb-2"
                        rows="3"
                        placeholder="Describe how the issue was resolved..."
                        id={`resolution-${complaint._id}`}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const note = document.getElementById(`resolution-${complaint._id}`).value;
                            if (note.trim()) {
                              handleResolutionUpdate(complaint._id, note);
                            } else {
                              toast.error('Please enter resolution note');
                            }
                          }}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                        >
                          Submit
                        </button>
                        <button
                          onClick={() => setEditingComplaint(null)}
                          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {complaint.status === 'Resolved' && complaint.resolutionNote && (
                <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-500 rounded">
                  <p className="text-sm font-semibold text-green-800">Resolution:</p>
                  <p className="text-sm text-green-700">{complaint.resolutionNote}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredComplaints.length === 0 && (
        <div className="bg-white p-16 rounded-xl shadow-sm border border-gray-100 text-center">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No complaints found</h3>
          <p className="text-gray-500">{searchTerm || filterStatus !== 'All' || filterCategory !== 'All' ? 'Try adjusting your filters' : 'No complaints submitted yet'}</p>
        </div>
      )}
    </div>
  );
};

export default Complaints;
