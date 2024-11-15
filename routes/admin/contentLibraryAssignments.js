// routes/admin/contentLibraryAssignments.js

const express = require('express');
const router = express.Router();
const {
  ContentLibraryAssignment,
  ContentLibrary,
  Platform,
  Company,
  Station,
} = require('../../models');

// Assign Content Library
router.post('/', async (req, res) => {
  const { contentLibraryId, assignableType, assignableId } = req.body;

  if (!contentLibraryId || !assignableType || !assignableId) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Validate assignableType
  const validTypes = ['Platform', 'Company', 'Station'];
  if (!validTypes.includes(assignableType)) {
    return res.status(400).json({ error: 'Invalid assignable type.' });
  }

  try {
    // Check if content library exists
    const contentLibrary = await ContentLibrary.findByPk(contentLibraryId);
    if (!contentLibrary) {
      return res.status(404).json({ error: 'Content library not found.' });
    }

    // Check if the assignable entity exists
    let assignableEntity;
    switch (assignableType) {
      case 'Platform':
        assignableEntity = await Platform.findByPk(assignableId);
        break;
      case 'Company':
        assignableEntity = await Company.findByPk(assignableId);
        break;
      case 'Station':
        assignableEntity = await Station.findByPk(assignableId);
        break;
    }

    if (!assignableEntity) {
      return res.status(404).json({ error: 'Assignable entity not found.' });
    }

    // Create the assignment
    const assignment = await ContentLibraryAssignment.create({
      contentLibraryId,
      assignableType,
      assignableId,
    });

    res.status(201).json({
      message: 'Content library assigned successfully.',
      assignment,
    });
  } catch (err) {
    console.error('Error assigning content library:', err);
    res.status(500).json({ error: 'An error occurred while assigning the content library.' });
  }
});

module.exports = router;
