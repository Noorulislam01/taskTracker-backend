const express = require('express');
const { userSignUp, login, allUsers, userDetails } = require('../controller/UserController');
const authenticate = require('../midddlewares/authenticate');

const router = express.Router();

router.post('/addUser',  userSignUp);
router.post('/login',login)
router.get("/allUsers",authenticate,allUsers)
router.get("/userDetails",authenticate,userDetails)
module.exports=router