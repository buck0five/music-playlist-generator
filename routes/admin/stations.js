// routes/admin/stations.js

const express = require('express');
const router = express.Router();
const { Station, Company } = require('../../models');

// GET /admin/stations - Retrieve all stations
router.get('/', async (req, res) => {
  try {
    const stations = await Station.findAll({
      include: [{ model: Company, as: 'Company', attributes: ['id', 'name'] }],
    });
    res.json(stations);
  } catch (error) {
    console.error('Error fetching stations:', error);
    res.status(500).json({ error: 'Failed to fetch stations.' });
  }
});

// POST /admin/stations - Create a new station
router.post('/', async (req, res) => {
  const { name, companyId } = req.body;

  if (!name || !companyId) {
    return res.status(400).json({ error: 'Name and companyId are required.' });
  }

  try {
    const station = await Station.create({ name, companyId });
    res.status(201).json({
      message: 'Station created successfully.',
      station,
    });
  } catch (error) {
    console.error('Error creating station:', error);
    res.status(500).json({ error: 'Failed to create station.' });
  }
});

// DELETE /admin/stations/:id - Delete a station
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const station = await Station.findByPk(id);

    if (!station) {
      return res.status(404).json({ error: 'Station not found.' });
    }

    await station.destroy();

    res.json({ message: 'Station deleted successfully.' });
  } catch (error) {
    console.error('Error deleting station:', error);
    res.status(500).json({ error: 'Failed to delete station.' });
  }
});

module.exports = router;
