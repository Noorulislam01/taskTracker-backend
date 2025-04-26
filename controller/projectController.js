const Project = require("../models/Project");
const Task = require("../models/Task");

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
    // console.log("API hit");

    const projects = await Project.find({ userId }).sort({ createdAt: -1 });

    const projectStatusGroups = {
      'Not Started': [],
      'In Progress': [],
      'Completed': [],
      'Delayed': []
    };

    for (const project of projects) {
      const tasks = await Task.find({ projectId: project._id });
      const taskCount = tasks.length;

      // If project has no tasks, treat as 'Not Started'
      if (taskCount === 0) {
        projectStatusGroups['Not Started'].push({ 
          ...project.toObject(), 
          taskCount 
        });
        continue;
      }

      const statuses = new Set(tasks.map(task => task.status || 'Not Started'));

      statuses.forEach(status => {
        if (projectStatusGroups[status]) {
          projectStatusGroups[status].push({ 
            ...project.toObject(), 
            taskCount 
          });
        }
      });
    }

    // console.log("Answer:", projectStatusGroups);
    res.json(projectStatusGroups);

  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
