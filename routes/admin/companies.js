// routes/admin/companies.js

const express = require('express');
const router = express.Router();
const { Company } = require('../../models');

// Get All Companies
router.get('/', async (req, res) => {
  try {
    const companies = await Company.findAll();
    res.json(companies);
  } catch (err) {
    console.error('Error fetching companies:', err);
    res.status(500).json({ error: 'An error occurred while fetching companies.' });
  }
});

// Create Company
router.post('/', async (req, res) => {
  const { name, platformId } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Company name is required.' });
  }

  try {
    const company = await Company.create({ name, platformId });
    res.status(201).json({
      message: 'Company created successfully.',
      company,
    });
  } catch (err) {
    console.error('Error creating company:', err);
    res.status(500).json({ error: 'An error occurred while creating the company.' });
  }
});

// Delete Company
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const company = await Company.findByPk(id);

    if (!company) {
      return res.status(404).json({ error: 'Company not found.' });
    }

    await company.destroy();

    res.json({ message: 'Company deleted successfully.' });
  } catch (err) {
    console.error('Error deleting company:', err);
    res.status(500).json({ error: 'An error occurred while deleting the company.' });
  }
});

module.exports = router;
