// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const { User, Station } = require('../models');

// GET /api/users -> list all
router.get('/', async (req, res) => {
  try {
    // If you want to see child users or stations, do an include
    const users = await User.findAll({
      include: [
        { model: User, as: 'children' }, 
        { model: Station }, 
      ],
    });
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Server error fetching users.' });
  }
});

// POST /api/users -> create new user
router.post('/', async (req, res) => {
  try {
    const { name, email, role, parentUserId } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required.' });
    }
    const newUser = await User.create({
      name,
      email: email || null,
      role: role || 'store',
      parentUserId: parentUserId || null,
    });
    res.json(newUser);
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ error: 'Server error creating user.' });
  }
});

// GET /api/users/:id -> fetch one user + children + stations
router.get('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId, {
      include: [
        { model: User, as: 'children' },
        { model: Station },
      ],
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Server error fetching user.' });
  }
});

// PUT /api/users/:id -> update user
router.put('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, role, parentUserId } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (role !== undefined) user.role = role;
    if (parentUserId !== undefined) user.parentUserId = parentUserId;

    await user.save();
    res.json(user);
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ error: 'Server error updating user.' });
  }
});

// DELETE /api/users/:id
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    await user.destroy();
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ error: 'Server error deleting user.' });
  }
});

module.exports = router;
