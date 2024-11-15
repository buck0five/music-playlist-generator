// routes/auth.js

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const bcrypt = require('bcrypt');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

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

    const passwordMatch = await bcrypt.compare(password, user.password);

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

module.exports = router;
