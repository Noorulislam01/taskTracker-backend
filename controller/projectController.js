const Project = require("../models/Project");
const Task = require("../models/Task");


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

    res.json(projectStatusGroups);

  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


exports.deleteProject = async (req, res) => {
    try {
      const { projectId } = req.params;
  
      const project = await Project.findById(projectId);
  
      if (!project ) {
        return res.status(404).json({ message: 'Project not found' });
      }
  
      await project.deleteOne();
      res.json({ message: 'Project deleted successfully' });
      
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };
  