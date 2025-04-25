const express = require('express');
const { userSignUp, login, allUsers } = require('../controller/UserController');
const authenticate = require('../midddlewares/authenticate');

const router = express.Router();

router.post('/addUser',  userSignUp);
router.post('/login',login)
router.get("/allUsers",authenticate,allUsers)
module.exports=router