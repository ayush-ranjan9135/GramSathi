import WelfareScheme from '../models/WelfareScheme.js';

export const createScheme = async (req, res) => {
  try {
    const scheme = await WelfareScheme.create({
      ...req.body,
      createdBy: req.user.id
    });
    res.status(201).json(scheme);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSchemes = async (req, res) => {
  try {
    const schemes = await WelfareScheme.find({ isActive: true }).sort('-createdAt');
    res.json(schemes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getScheme = async (req, res) => {
  try {
    const scheme = await WelfareScheme.findById(req.params.id);
    res.json(scheme);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateScheme = async (req, res) => {
  try {
    const scheme = await WelfareScheme.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(scheme);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteScheme = async (req, res) => {
  try {
    await WelfareScheme.findByIdAndDelete(req.params.id);
    res.json({ message: 'Scheme deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
