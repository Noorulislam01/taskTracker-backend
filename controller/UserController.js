const bcrypt = require('bcryptjs');

const Users = require('../models/Users');
const generateAuthToken = require('../midddlewares/generateToken');

exports.userSignUp = async (req, res) => {
  try {
    // console.log(req.body)
    const { name, email, country, password } = req.body;

   
    if (!name || !email || !country || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await Users.findOne({
      $or: [{ email }]
    });

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists with this email or phone' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new Users({
      name,
      email,
      country,
      password: hashedPassword

    });

    await newUser.save();

    res.status(201).json({
      message: 'User registered successfully',
      userId: newUser._id
    });

  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ message: 'Server error, please try again' });
  }
};



exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

  
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if user exists
    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateAuthToken(user);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        
      }
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



exports.allUsers = async (req, res) => {
  try {
    const users = await Users.find();

    res.status(200).json({
      success: true,
      message: 'Users fetched successfully',
      code: 200,
      data: {
        users: users
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      code: 500,
      error: error.message
    });
  }
};
