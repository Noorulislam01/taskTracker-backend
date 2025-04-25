const Project = require("../models/Project");

// Create a new project (limit 4 projects per user)
exports.createProject = async (req, res) => {
  try {
    const userId = req.userId;

    const projectCount = await Project.countDocuments({ userId });
    if (projectCount >= 4) {
      return res.status(400).json({ message: 'Project limit reached (4 max).' });
    }

    const project = new Project({
      name: req.body.name,
      userId
    });

    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


exports.getAllProjects = async (req, res) => {
    try {
      const userId = req.userId;
  
      const projects = await Project.find({ userId }).sort({ createdAt: -1 }); // latest first
      res.json(projects);
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };