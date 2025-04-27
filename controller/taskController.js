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
      const updateData = req.body;  // Capture all fields in the request body to allow flexible updates
  
      // Find the task by its ID
      const task = await Task.findById(taskId).populate('projectId');
      
      // Check if the task exists and if the user is authorized to update it
      if (!task || task.projectId.userId.toString() !== req.userId) {
        return res.status(404).json({ message: 'Task not found or access denied' });
      }
  
      // List of allowed fields to update
      const allowedFields = [
        'title',
        'description',
        'status',
        'completedAt',
        'expectedCompletionTime'
      ];
  
      // Update the task dynamically with allowed fields
      allowedFields.forEach((field) => {
        if (updateData[field] !== undefined) { // Check if field exists in the body
          task[field] = updateData[field]; // Update the field dynamically
        }
      });
  
      // Save the updated task
      await task.save();
      res.json(task);  // Send the updated task back in the response
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
  
      await task.deleteOne();
      res.json({ message: 'Task deleted successfully' });
      
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };
  



  // Controller to update only the task's status
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
  
      task.status = newStatus; // Only updating status
      await task.save();       // Saving the task
  
      res.status(200).json({
        message: 'Task status updated successfully.',
        task,
      });
    } catch (error) {
      console.error('Error updating task status:', error);
      res.status(500).json({ message: 'Internal Server Error.' });
    }
  };
  
  