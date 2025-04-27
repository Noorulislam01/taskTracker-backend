const express = require('express');
const authenticate = require('../midddlewares/authenticate');

const router = express.Router();


const { createProject, getAllProjects, deleteProject } = require('../controller/projectController');
const { createTask, getTasks, updateTask, deleteTask, updateTaskStatus } = require('../controller/taskController');



router.post('/create', authenticate, createProject);
router.post('/addTask', authenticate, createTask);
router.get('/tasks/:projectId', authenticate, getTasks);
router.put('/updateTasks/:taskId', authenticate, updateTask);
router.delete('/delteTask/:taskId', authenticate, deleteTask);
router.get('/all',authenticate,getAllProjects)
router.delete("/delete/:projectId",authenticate,deleteProject)
router.post("/updateTaskStatus",authenticate,updateTaskStatus)

module.exports = router;




