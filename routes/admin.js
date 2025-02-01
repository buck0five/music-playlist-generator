// routes/admin.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const { User, Station, Company, Platform, ContentLibrary, Content, ContentLibraryAssignment } = require('../models');
const authenticate = require('../middleware/authenticate');

// Middleware to check if the user is an admin
function isAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }
}

// Apply authentication and admin check middleware
router.use(authenticate, isAdmin);

/** Companies Management */

// Get all companies
router.get('/companies', async (req, res) => {
  try {
    const companies = await Company.findAll();
    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch companies.' });
  }
});

/** Platforms Management */

// Get all platforms
router.get('/platforms', async (req, res) => {
  try {
    const platforms = await Platform.findAll();
    res.json(platforms);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch platforms.' });
  }
});

/** Users Management */

// Get all users with their associated stations
router.get('/users', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Station,
          as: 'UserStations',
          attributes: ['id', 'name'],
          through: { attributes: [] },
        },
      ],
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
});

// Create a new user
router.post('/users', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const newUser = await User.create({ username, email, password, role });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user.' });
  }
});

// Update a user (e.g., username, email, role)
router.put('/users/:id', async (req, res) => {
  try {
    const { username, email, role } = req.body;
    await User.update({ username, email, role }, { where: { id: req.params.id } });
    res.json({ message: 'User updated successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user.' });
  }
});

// Update a user's associated stations
router.put('/users/:id/stations', async (req, res) => {
  try {
    const { stationIds } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    await user.setUserStations(stationIds);
    res.json({ message: 'User stations updated successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user stations.' });
  }
});

// Delete a user
router.delete('/users/:id', async (req, res) => {
  try {
    await User.destroy({ where: { id: req.params.id } });
    res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user.' });
  }
});

/** Stations Management */

// Get all stations
router.get('/stations', async (req, res) => {
  try {
    const stations = await Station.findAll();
    res.json(stations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stations.' });
  }
});

// Create a new station
router.post('/stations', async (req, res) => {
  try {
    const { name, companyId } = req.body;
    const newStation = await Station.create({ name, companyId });
    res.status(201).json(newStation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create station.' });
  }
});

// Update a station
router.put('/stations/:id', async (req, res) => {
  try {
    const { name, companyId } = req.body;
    await Station.update({ name, companyId }, { where: { id: req.params.id } });
    res.json({ message: 'Station updated successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update station.' });
  }
});

// Delete a station
router.delete('/stations/:id', async (req, res) => {
  try {
    await Station.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Station deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete station.' });
  }
});

/** Content Libraries Management */

// Get all content libraries
router.get('/content-libraries', async (req, res) => {
  try {
    const libraries = await ContentLibrary.findAll();
    res.json(libraries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch content libraries.' });
  }
});

// Create a new content library
router.post('/content-libraries', async (req, res) => {
  try {
    const { name } = req.body;
    const newLibrary = await ContentLibrary.create({ name });
    res.status(201).json(newLibrary);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create content library.' });
  }
});

// Delete a content library
router.delete('/content-libraries/:id', async (req, res) => {
  try {
    await ContentLibrary.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Content library deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete content library.' });
  }
});

/** Content Library Assignments */

// Assign a content library to an entity
router.post('/content-library-assignments', async (req, res) => {
  try {
    const { contentLibraryId, assignableType, assignableId } = req.body;

    // Validate input
    if (!contentLibraryId || !assignableType || !assignableId) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Create the assignment
    await ContentLibraryAssignment.create({
      contentLibraryId,
      assignableType,
      assignableId,
    });

    res.json({ message: 'Content library assigned successfully.' });
  } catch (error) {
    console.error('Error assigning content library:', error);
    res.status(500).json({ error: 'Failed to assign content library.' });
  }
});

/** Contents Management */

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ensure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Get all contents
router.get('/contents', async (req, res) => {
  try {
    const contents = await Content.findAll();
    res.json(contents);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contents.' });
  }
});

// Create a new content with file upload
router.post('/contents', upload.single('file'), async (req, res) => {
  try {
    const { title, contentType, duration, tags } = req.body;
    const file_path = req.file ? 'uploads/' + req.file.filename : null;

    if (!title || !contentType || !file_path) {
      return res.status(400).json({ error: 'Title, contentType, and file are required.' });
    }

    const newContent = await Content.create({
      title,
      contentType,
      file_path,
      duration,
      tags,
    });

    // Associate content with content libraries if provided
    if (req.body.contentLibraries) {
      const contentLibraryIds = JSON.parse(req.body.contentLibraries);
      await newContent.addContentLibraries(contentLibraryIds);
    }

    res.status(201).json(newContent);
  } catch (error) {
    console.error('Error creating content:', error);
    res.status(500).json({ error: 'Failed to create content.' });
  }
});

// Delete a content
router.delete('/contents/:id', async (req, res) => {
  try {
    await Content.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Content deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete content.' });
  }
});

module.exports = router;
