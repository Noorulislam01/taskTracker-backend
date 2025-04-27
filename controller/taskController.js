const Project = require("../models/Project");
const Task = require("../models/Task");


exports.createTask = async (req, res) => {
    try {
      const { projectId, title, description, expectedCompletion } = req.body;
  
      const project = await Project.findOne({ _id: projectId, userId: req.userId });
      if (!project) return res.status(404).json({ message: 'Project not found or access denied' });
  
      const task = new Task({
        projectId,
        title,
        description,
        expectedCompletionTime: new Date(expectedCompletion) 
      });
  
      await task.save();
      res.status(201).json(task);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };
  


exports.getTasks = async (req, res) => {
    try {
      const { projectId } = req.params;
  
      
      const project = await Project.findOne({ _id: projectId, userId: req.userId });
      if (!project) return res.status(404).json({ message: 'Project not found or access denied' });
  
      
      const tasks = await Task.find({ projectId });
  
      const tasksByStatus = {
        'Not Started': tasks.filter(task => task.status === 'Not Started'),
        'In Progress': tasks.filter(task => task.status === 'In Progress'),
        'Completed': tasks.filter(task => task.status === 'Completed'),
        'Delayed': tasks.filter(task => task.status === 'Delayed')
      };
  
       res.json({
        tasksByStatus,
       
      });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };
  


exports.updateTask = async (req, res) => {
    try {
      const { taskId } = req.params;
      const updateData = req.body;  
      const task = await Task.findById(taskId).populate('projectId');
      
      if (!task || task.projectId.userId.toString() !== req.userId) {
        return res.status(404).json({ message: 'Task not found or access denied' });
      }
  
      const allowedFields = [
        'title',
        'description',
        'status',
        'completedAt',
        'expectedCompletionTime'
      ];
  
      allowedFields.forEach((field) => {
        if (updateData[field] !== undefined) { 
          task[field] = updateData[field]; 
        }
      });
  
      
      await task.save();
      res.json(task);  
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };
  


exports.deleteTask = async (req, res) => {
    try {
      const { taskId } = req.params;
  
      const task = await Task.findById(taskId).populate('projectId');
  
      if (!task || task.projectId.userId.toString() !== req.userId) {
        return res.status(404).json({ message: 'Task not found or access denied' });
      }
  
      await task.deleteOne();
      res.json({ message: 'Task deleted successfully' });
      
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };
  



exports.updateTaskStatus = async (req, res) => {
    const { taskId, newStatus } = req.body;
  
    if (!taskId || !newStatus) {
      return res.status(400).json({ message: 'Task ID and new status are required.' });
    }
  
    try {
      const task = await Task.findById(taskId);
  
      if (!task) {
        return res.status(404).json({ message: 'Task not found.' });
      }
  
      task.status = newStatus; 
      await task.save();      
  
      res.status(200).json({
        message: 'Task status updated successfully.',
        task,
      });
    } catch (error) {
      console.error('Error updating task status:', error);
      res.status(500).json({ message: 'Internal Server Error.' });
    }
  };
  
  