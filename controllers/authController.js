const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const User = require('../models/User');

const authController = express.Router();

authController.post('/register', async (req, res) => {
  try {
    const { user_name, email, password, confirm_password } = req.body;

    // Check if the user_name or email already exists in the database
    const existingUser = await User.findOne({ $or: [{ user_name }, { email }] });
    if (existingUser) {
      return res.status(409).json({ message: "User with this user_name or email already exists" });
    }
    console.log(req.body);

    // Check if the password and confirm_password match
    if (password !== confirm_password) {
      return res.status(400).json({ message: "Password and confirm_password do not match" });
    }
    

    // Hash the password
    const saltRounds = 10; 
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user
    const newUser = await User.create({user_name, email, password: hashedPassword , confirm_password:hashedPassword });
    console.log(process.env.JWT_SECTET);
    console.log(password);
    // Generate JWT token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECTET, { expiresIn: '8d' });
    

    // Return the user details and token
    return res.status(201).json({ user: { _id: newUser._id, user_name, email }, token });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Internal server error" });
  }
});

authController.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
   console.log(req.body);
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECTET, { expiresIn: '8d' });

    // Return the user details and token
    return res.status(200).json({ user: { _id: user._id, user_name: user.user_name, email }, token });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

  authController.get('/login', async (req,res)=>{
       res.json({success:true});
  })

module.exports = authController;
