import React, { useState, useEffect, useContext } from 'react';
import { getFunds, getFundStats, createFund } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Funds = () => {
  const { user } = useContext(AuthContext);
  const [funds, setFunds] = useState([]);
  const [stats, setStats] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    schemeName: '', amount: '', category: 'Infrastructure', source: 'Government', description: ''
  });

  useEffect(() => {
    loadFunds();
    loadStats();
  }, []);

  const loadFunds = async () => {
    try {
      const { data } = await getFunds();
      setFunds(data);
    } catch (error) {
      toast.error('Failed to load funds');
    }
  };

  const loadStats = async () => {
    try {
      const { data } = await getFundStats();
      setStats(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createFund(formData);
      toast.success('Fund entry added successfully');
      setShowForm(false);
      setFormData({ schemeName: '', amount: '', category: 'Infrastructure', source: 'Government', description: '' });
      loadFunds();
      loadStats();
    } catch (error) {
      toast.error('Failed to add fund entry');
    }
  };

  const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Budget & Fund Transparency</h1>
            <p className="text-gray-600">Track government funds and expenditure transparently</p>
          </div>
          {(user?.role === 'admin' || user?.role === 'superadmin') && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2 shadow-sm"
            >
              {showForm ? 'Cancel' : 'Add Fund Entry'}
            </button>
          )}
        </div>
        <div className="h-px bg-gray-200 mt-6"></div>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
          <h2 className="text-xl font-bold mb-4">Add Fund Entry</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Scheme Name"
              className="w-full px-4 py-2 mb-4 border rounded-lg"
              value={formData.schemeName}
              onChange={(e) => setFormData({ ...formData, schemeName: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Amount"
              className="w-full px-4 py-2 mb-4 border rounded-lg"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
            <select
              className="w-full px-4 py-2 mb-4 border rounded-lg"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="Infrastructure">Infrastructure</option>
              <option value="Education">Education</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Sanitation">Sanitation</option>
              <option value="Agriculture">Agriculture</option>
              <option value="Other">Other</option>
            </select>
            <select
              className="w-full px-4 py-2 mb-4 border rounded-lg"
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
            >
              <option value="Government">Government</option>
              <option value="State">State</option>
              <option value="Central">Central</option>
              <option value="Donation">Donation</option>
            </select>
            <textarea
              placeholder="Description"
              className="w-full px-4 py-2 mb-4 border rounded-lg"
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              Add Entry
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-sm text-white">
          <h3 className="text-sm opacity-90 mb-1">Total Funds Received</h3>
          <p className="text-3xl font-bold">₹{stats.totalReceived?.toLocaleString() || 0}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl shadow-sm text-white">
          <h3 className="text-sm opacity-90 mb-1">Total Spent</h3>
          <p className="text-3xl font-bold">₹{stats.totalSpent?.toLocaleString() || 0}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-sm text-white">
          <h3 className="text-sm opacity-90 mb-1">Balance</h3>
          <p className="text-3xl font-bold">₹{stats.balance?.toLocaleString() || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold mb-4">Category-wise Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={stats.categoryWise || []} dataKey="total" nameKey="_id" cx="50%" cy="50%" outerRadius={80} label>
                {(stats.categoryWise || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold mb-4">Source-wise Funds</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.sourceWise || []}>
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold mb-4">Fund Entries</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Scheme Name</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Source</th>
                <th className="px-4 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {funds.map((fund) => (
                <tr key={fund._id} className="border-t">
                  <td className="px-4 py-3">{fund.schemeName}</td>
                  <td className="px-4 py-3">{fund.category}</td>
                  <td className="px-4 py-3 font-bold">₹{fund.amount.toLocaleString()}</td>
                  <td className="px-4 py-3">{fund.source}</td>
                  <td className="px-4 py-3">{new Date(fund.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Funds;
