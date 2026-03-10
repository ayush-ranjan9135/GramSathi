import React, { useState, useEffect, useContext } from 'react';
import { getSchemes, createScheme, deleteScheme } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaExternalLinkAlt, FaTrash, FaCheckCircle, FaPlus, FaSearch, FaFilter } from 'react-icons/fa';

const Schemes = () => {
  const { user } = useContext(AuthContext);
  const [schemes, setSchemes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '', description: '', category: 'Pension', eligibility: '', documents: '', benefits: '', applyLink: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  useEffect(() => {
    loadSchemes();
  }, []);

  const loadSchemes = async () => {
    try {
      const { data } = await getSchemes();
      setSchemes(data);
    } catch (error) {
      toast.error('Failed to load schemes');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createScheme(formData);
      toast.success('Scheme added successfully');
      setShowForm(false);
      setFormData({ name: '', description: '', category: 'Pension', eligibility: '', documents: '', benefits: '', applyLink: '' });
      loadSchemes();
    } catch (error) {
      toast.error('Failed to add scheme');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this scheme?')) {
      try {
        await deleteScheme(id);
        toast.success('Scheme deleted successfully');
        loadSchemes();
      } catch (error) {
        toast.error('Failed to delete scheme');
      }
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      Pension: 'bg-blue-100 text-blue-800',
      Housing: 'bg-green-100 text-green-800',
      Education: 'bg-purple-100 text-purple-800',
      Agriculture: 'bg-yellow-100 text-yellow-800',
      Healthcare: 'bg-red-100 text-red-800',
      Other: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const filteredSchemes = schemes.filter(scheme => {
    const matchesSearch = scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scheme.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || scheme.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const stats = {
    total: schemes.length,
    byCategory: schemes.reduce((acc, scheme) => {
      acc[scheme.category] = (acc[scheme.category] || 0) + 1;
      return acc;
    }, {})
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Government Welfare Schemes</h1>
            <p className="text-gray-600">Explore and apply for government welfare programs</p>
          </div>
          {(user?.role === 'admin' || user?.role === 'superadmin') && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2 shadow-sm"
            >
              <FaPlus className="text-sm" />
              {showForm ? 'Cancel' : 'Add Scheme'}
            </button>
          )}
        </div>
        <div className="h-px bg-gray-200 mt-6"></div>
      </div>

      {/* Summary Stats */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="text-sm text-gray-600 mb-2">Available Schemes</div>
        <div className="text-3xl font-bold text-gray-900 mb-4">{stats.total}</div>
        <div className="flex gap-3 flex-wrap">
          {Object.entries(stats.byCategory).map(([category, count]) => (
            <span key={category} className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(category)}`}>
              {category}: {count}
            </span>
          ))}
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search schemes..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <select
            className="pl-10 pr-8 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Pension">Pension</option>
            <option value="Housing">Housing</option>
            <option value="Education">Education</option>
            <option value="Agriculture">Agriculture</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
          <h2 className="text-xl font-bold mb-4">Add New Scheme</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Scheme Name"
              className="w-full px-4 py-2 mb-4 border rounded-lg"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
            <select
              className="w-full px-4 py-2 mb-4 border rounded-lg"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="Pension">Pension</option>
              <option value="Housing">Housing</option>
              <option value="Education">Education</option>
              <option value="Agriculture">Agriculture</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Other">Other</option>
            </select>
            <textarea
              placeholder="Eligibility Criteria (one per line)"
              className="w-full px-4 py-2 mb-4 border rounded-lg"
              rows="3"
              value={formData.eligibility}
              onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
              required
            />
            <textarea
              placeholder="Required Documents (one per line)"
              className="w-full px-4 py-2 mb-4 border rounded-lg"
              rows="3"
              value={formData.documents}
              onChange={(e) => setFormData({ ...formData, documents: e.target.value })}
              required
            />
            <textarea
              placeholder="Benefits (one per line)"
              className="w-full px-4 py-2 mb-4 border rounded-lg"
              rows="3"
              value={formData.benefits}
              onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
              required
            />
            <input
              type="url"
              placeholder="Application Link (Optional)"
              className="w-full px-4 py-2 mb-4 border rounded-lg"
              value={formData.applyLink}
              onChange={(e) => setFormData({ ...formData, applyLink: e.target.value })}
            />
            <button type="submit" className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-all">
              Add Scheme
            </button>
          </form>
        </div>
      )}

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 gap-6">
        {filteredSchemes.map((scheme) => (
          <div key={scheme._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200">
            <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold mb-2">{scheme.name}</h3>
                <span className={`px-3 py-1 rounded-full text-sm ${getCategoryColor(scheme.category)}`}>
                  {scheme.category}
                </span>
              </div>
              {(user?.role === 'admin' || user?.role === 'superadmin') && (
                <button onClick={() => handleDelete(scheme._id)} className="text-red-500 hover:text-red-700">
                  <FaTrash />
                </button>
              )}
            </div>

            <p className="text-gray-600 mb-4">{scheme.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
              <div>
                <h4 className="font-bold text-blue-600 mb-2">Eligibility Criteria</h4>
                <ul className="space-y-1">
                  {scheme.eligibility.split('\n').map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-blue-600 mb-2">Required Documents</h4>
                <ul className="space-y-1">
                  {scheme.documents.split('\n').map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <FaCheckCircle className="text-blue-500 mt-1 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-blue-600 mb-2">Benefits</h4>
                <ul className="space-y-1">
                  {scheme.benefits.split('\n').map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <FaCheckCircle className="text-orange-500 mt-1 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {scheme.applyLink && (
              <div className="pt-4 border-t">
                <a
                  href={scheme.applyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-all"
                >
                  Apply Now <FaExternalLinkAlt />
                </a>
              </div>
            )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredSchemes.length === 0 && (
        <div className="bg-white p-16 rounded-xl shadow-sm border border-gray-100 text-center">
          <div className="text-6xl mb-4">📜</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No schemes found</h3>
          <p className="text-gray-500">{searchTerm || filterCategory !== 'All' ? 'Try adjusting your filters' : 'No schemes available yet'}</p>
        </div>
      )}
    </div>
  );
};

export default Schemes;
