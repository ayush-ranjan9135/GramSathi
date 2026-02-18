import React, { useState, useEffect, useContext } from 'react';
import { getProjects, createProject, updateProject } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Projects = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    name: '', description: '', category: 'Road', budget: '', spent: 0,
    startDate: '', endDate: '', status: 'Planned', progress: 0,
    contractorName: '', contractorContact: ''
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const { data } = await getProjects();
      setProjects(data);
    } catch (error) {
      toast.error('Failed to load projects');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProject) {
        await updateProject(editingProject, formData);
        toast.success('Project updated successfully');
      } else {
        await createProject(formData);
        toast.success('Project created successfully');
      }
      setShowForm(false);
      setEditingProject(null);
      resetForm();
      loadProjects();
    } catch (error) {
      toast.error('Failed to save project');
    }
  };

  const handleEdit = (project) => {
    setFormData({
      name: project.name,
      description: project.description,
      category: project.category,
      budget: project.budget,
      spent: project.spent,
      startDate: project.startDate.split('T')[0],
      endDate: project.endDate.split('T')[0],
      status: project.status,
      progress: project.progress,
      contractorName: project.contractorName || '',
      contractorContact: project.contractorContact || ''
    });
    setEditingProject(project._id);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '', description: '', category: 'Road', budget: '', spent: 0,
      startDate: '', endDate: '', status: 'Planned', progress: 0,
      contractorName: '', contractorContact: ''
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      Planned: 'bg-gray-100 text-gray-800',
      Ongoing: 'bg-blue-100 text-blue-800',
      Completed: 'bg-green-100 text-green-800',
      Delayed: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Development Projects</h1>
        {(user?.role === 'admin' || user?.role === 'superadmin') && (
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingProject(null);
              resetForm();
            }}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            {showForm ? 'Cancel' : 'Create Project'}
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-bold mb-4">{editingProject ? 'Update Project' : 'Create New Project'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Project Name"
                className="col-span-2 px-4 py-2 border rounded-lg"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <textarea
                placeholder="Description"
                className="col-span-2 px-4 py-2 border rounded-lg"
                rows="3"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
              <select
                className="px-4 py-2 border rounded-lg"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Road">Road</option>
                <option value="Drainage">Drainage</option>
                <option value="Building">Building</option>
                <option value="Water Supply">Water Supply</option>
                <option value="Electricity">Electricity</option>
                <option value="Other">Other</option>
              </select>
              <select
                className="px-4 py-2 border rounded-lg"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Planned">Planned</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
                <option value="Delayed">Delayed</option>
              </select>
              <input
                type="number"
                placeholder="Budget (₹)"
                className="px-4 py-2 border rounded-lg"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Spent (₹)"
                className="px-4 py-2 border rounded-lg"
                value={formData.spent}
                onChange={(e) => setFormData({ ...formData, spent: e.target.value })}
              />
              <input
                type="date"
                placeholder="Start Date"
                className="px-4 py-2 border rounded-lg"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
              <input
                type="date"
                placeholder="End Date"
                className="px-4 py-2 border rounded-lg"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Progress (%)"
                className="px-4 py-2 border rounded-lg"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) => setFormData({ ...formData, progress: e.target.value })}
              />
              <input
                type="text"
                placeholder="Contractor Name"
                className="px-4 py-2 border rounded-lg"
                value={formData.contractorName}
                onChange={(e) => setFormData({ ...formData, contractorName: e.target.value })}
              />
              <input
                type="tel"
                placeholder="Contractor Contact"
                className="col-span-2 px-4 py-2 border rounded-lg"
                value={formData.contractorContact}
                onChange={(e) => setFormData({ ...formData, contractorContact: e.target.value })}
              />
            </div>
            <button type="submit" className="mt-4 bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              {editingProject ? 'Update Project' : 'Create Project'}
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <div key={project._id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">{project.name}</h3>
              <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(project.status)}`}>
                {project.status}
              </span>
            </div>
            <p className="text-gray-600 mb-4">{project.description}</p>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span>{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Budget</p>
                <p className="font-bold">₹{project.budget.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-500">Spent</p>
                <p className="font-bold">₹{project.spent.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-500">Start Date</p>
                <p>{new Date(project.startDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-500">End Date</p>
                <p>{new Date(project.endDate).toLocaleDateString()}</p>
              </div>
            </div>

            {project.contractorName && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-gray-500">Contractor</p>
                <p className="font-semibold">{project.contractorName}</p>
                {project.contractorContact && (
                  <p className="text-sm text-gray-600">{project.contractorContact}</p>
                )}
              </div>
            )}

            {(user?.role === 'admin' || user?.role === 'superadmin') && (
              <div className="mt-4 pt-4 border-t">
                <button
                  onClick={() => handleEdit(project)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  Update Project
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="bg-white p-12 rounded-lg shadow text-center">
          <p className="text-gray-500 text-lg">No projects yet</p>
        </div>
      )}
    </div>
  );
};

export default Projects;
