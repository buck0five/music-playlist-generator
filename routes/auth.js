// routes/auth.js

const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { generateToken } = require('../utils/token');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

// Registration Endpoint
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({
      where: { [Op.or]: [{ username }, { email }] },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already in use.' });
    }

    // Create new user
    const user = await User.create({ username, email, password, role });

    // Generate JWT token
    const token = generateToken({ id: user.id, role: user.role });

    res.status(201).json({ message: 'User registered successfully.', token });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'An error occurred during registration.' });
  }
});

// Login Endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Generate JWT token
    const token = generateToken({ id: user.id, role: user.role });

    res.status(200).json({ message: 'Login successful.', token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'An error occurred during login.' });
  }
});

module.exports = router;
