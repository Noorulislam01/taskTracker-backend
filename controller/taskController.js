const Project = require("../models/Project");
const Task = require("../models/Task");


exports.createTask = async (req, res) => {
    try {
      const { projectId, title, description, expectedCompletion } = req.body;
  
      // Check if project belongs to user
      const project = await Project.findOne({ _id: projectId, userId: req.userId });
      if (!project) return res.status(404).json({ message: 'Project not found or access denied' });
  
      const task = new Task({
        projectId,
        title,
        description,
        expectedCompletionTime: new Date(expectedCompletion) // 👈 Convert to Date type
      });
  
      await task.save();
      res.status(201).json(task);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };
  

// Read all tasks for a given project
exports.getTasks = async (req, res) => {
    try {
      const { projectId } = req.params;
  
      // Verify access to project
      const project = await Project.findOne({ _id: projectId, userId: req.userId });
      if (!project) return res.status(404).json({ message: 'Project not found or access denied' });
  
      // Get all tasks for the project
      const tasks = await Task.find({ projectId });
  
      
      // Organize tasks by status
      const tasksByStatus = {
        'Not Started': tasks.filter(task => task.status === 'Not Started'),
        'In Progress': tasks.filter(task => task.status === 'In Progress'),
        'Completed': tasks.filter(task => task.status === 'Completed'),
        'Delayed': tasks.filter(task => task.status === 'Delayed')
      };
  
      // Return both task counts and tasks categorized by status
      res.json({
        tasksByStatus,
       
      });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };
  

// Update a task
exports.updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description, status, completedAt } = req.body;

    const task = await Task.findById(taskId).populate('projectId');
    if (!task || task.projectId.userId.toString() !== req.userId) {
      return res.status(404).json({ message: 'Task not found or access denied' });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    task.completedAt = completedAt || task.completedAt;

    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId).populate('projectId');
    if (!task || task.projectId.userId.toString() !== req.userId) {
      return res.status(404).json({ message: 'Task not found or access denied' });
    }

    await task.remove();
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
