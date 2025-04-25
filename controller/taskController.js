const Project = require("../models/Project");
const Task = require("../models/Task");

// Create a task under a specific project
exports.createTask = async (req, res) => {
  try {
    const { projectId, title, description } = req.body;

    // Check if project belongs to user
    const project = await Project.findOne({ _id: projectId, userId: req.userId });
    if (!project) return res.status(404).json({ message: 'Project not found or access denied' });

    const task = new Task({
      projectId,
      title,
      description
    });

    await task.save();
    res.status(201).json(task);
  } catch (err) {
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

    const tasks = await Task.find({ projectId });
    res.json(tasks);
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
