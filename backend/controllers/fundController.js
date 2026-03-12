const Fund = require('../models/Fund');
const Project = require('../models/Project');
const cacheService = require('../services/cacheService');

exports.createFund = async (req, res) => {
  try {
    const fund = await Fund.create({
      ...req.body,
      createdBy: req.user.id
    });
    
    // Clear related cache
    await cacheService.clearPattern('stats');
    await cacheService.clearPattern('dashboard');
    
    res.status(201).json(fund);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFunds = async (req, res) => {
  try {
    const funds = await Fund.find().sort('-date');
    res.json(funds);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFundStats = async (req, res) => {
  try {
    const cacheKey = cacheService.keys.fundStats();
    
    // Try cache first
    let cachedStats = await cacheService.get(cacheKey);
    if (cachedStats) {
      return res.json(cachedStats);
    }
    
    const totalReceived = await Fund.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const projects = await Project.aggregate([
      { $group: { _id: null, total: { $sum: '$spent' } } }
    ]);

    const categoryWise = await Fund.aggregate([
      { $group: { _id: '$category', total: { $sum: '$amount' } } }
    ]);

    const sourceWise = await Fund.aggregate([
      { $group: { _id: '$source', total: { $sum: '$amount' } } }
    ]);

    const received = totalReceived[0]?.total || 0;
    const spent = projects[0]?.total || 0;

    const result = {
      totalReceived: received,
      totalSpent: spent,
      balance: received - spent,
      categoryWise,
      sourceWise
    };
    
    // Cache for 15 minutes
    await cacheService.set(cacheKey, result, 900);
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
