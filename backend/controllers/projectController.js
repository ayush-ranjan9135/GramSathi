const Project = require('../models/Project');

exports.createProject = async (req, res) => {
  try {
    const project = await Project.create({
      ...req.body,
      createdBy: req.user.id
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort('-createdAt');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProjectStats = async (req, res) => {
  try {
    const total = await Project.countDocuments();
    const completed = await Project.countDocuments({ status: 'Completed' });
    const ongoing = await Project.countDocuments({ status: 'Ongoing' });
    
    const budgetStats = await Project.aggregate([
      {
        $group: {
          _id: null,
          totalBudget: { $sum: '$budget' },
          totalSpent: { $sum: '$spent' }
        }
      }
    ]);

    res.json({ total, completed, ongoing, budgetStats: budgetStats[0] || {} });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
