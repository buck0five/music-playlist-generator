// routes/admin/users.js

const express = require('express');
const router = express.Router();
const { User, Station } = require('../../models');
const bcrypt = require('bcrypt');

// Get All Users
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'role'],
      include: [{ model: Station, as: 'Stations', attributes: ['id', 'name'] }],
    });
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'An error occurred while fetching users.' });
  }
});

// Update User
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { username, email, password, role } = req.body;

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }
    if (role) user.role = role;

    await user.save();

    res.json({ message: 'User updated successfully.' });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ error: 'An error occurred while updating the user.' });
  }
});

// Assign Stations to User
router.put('/:id/stations', async (req, res) => {
  const { id } = req.params;
  const { stationIds } = req.body; // Array of station IDs

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const stations = await Station.findAll({ where: { id: stationIds } });
    await user.setStations(stations);

    res.json({ message: 'User stations updated successfully.' });
  } catch (err) {
    console.error('Error updating user stations:', err);
    res.status(500).json({ error: 'An error occurred while updating user stations.' });
  }
});

// Delete User
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    await user.destroy();

    res.json({ message: 'User deleted successfully.' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ error: 'An error occurred while deleting the user.' });
  }
});

module.exports = router;
