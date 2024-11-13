// routes/auth.js

const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { generateToken } = require('../utils/token');
const bcrypt = require('bcrypt');

// Registration Endpoint
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered.' });
    }

    // Create new user
    const user = await User.create({
      username,
      email,
      password,
      role,
    });

    // Generate token
    const token = generateToken({ id: user.id, role: user.role });

    res.status(201).json({
      message: 'User registered successfully.',
      token,
    });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ error: 'An error occurred during registration.' });
  }
});

// Login Endpoint
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user
    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    // Generate token
    const token = generateToken({ id: user.id, role: user.role });

    res.json({
      message: 'Login successful.',
      token,
    });
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).json({ error: 'An error occurred during login.' });
  }
});

module.exports = router;
