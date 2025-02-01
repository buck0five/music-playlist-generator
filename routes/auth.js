// routes/auth.js

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log(`Login attempt for email: ${email}`);

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      console.log('User not found');
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    console.log('User found:', user.email);

    const passwordMatch = await user.comparePassword(password);

    console.log('Password match:', passwordMatch);

    if (!passwordMatch) {
      console.log('Password does not match');
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: '1d',
    });

    console.log('Login successful, token generated');

    // Include the user's role and other info in the response
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'An error occurred during login.' });
  }
});

// Registration Route
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if email already exists
    const existingUser = await User.findOne({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use.' });
    }

    // Create new user with plain password
    const user = await User.create({
      username,
      email,
      password, // Plain password; will be hashed by the model's hooks
      role: 'end_user', // Default role
    });

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'An error occurred during registration.' });
  }
});

module.exports = router;
