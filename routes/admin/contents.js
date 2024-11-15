// routes/admin/contents.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const { Content, ContentLibrary } = require('../../models');
const path = require('path');

// Set up Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ensure this directory exists or adjust the path
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// GET /admin/contents - Retrieve all contents
router.get('/', async (req, res) => {
  try {
    const contents = await Content.findAll({
      include: [{ model: ContentLibrary, as: 'ContentLibraries' }],
    });
    res.json(contents);
  } catch (error) {
    console.error('Error fetching contents:', error);
    res.status(500).json({ error: 'Failed to fetch contents.' });
  }
});

// POST /admin/contents - Create new content
router.post('/', upload.single('file'), async (req, res) => {
  const { title, contentType, duration, tags, contentLibraries } = req.body;
  const file = req.file;

  if (!title || !contentType || !file) {
    return res.status(400).json({ error: 'Title, content type, and file are required.' });
  }

  try {
    const content = await Content.create({
      title,
      contentType,
      file_path: file.path,
      duration: duration || null,
      tags: tags || null,
    });

    // Associate content with content libraries
    if (contentLibraries) {
      const libraryIds = JSON.parse(contentLibraries);
      const libraries = await ContentLibrary.findAll({
        where: { id: libraryIds },
      });
      await content.setContentLibraries(libraries);
    }

    res.status(201).json({
      message: 'Content created successfully.',
      content,
    });
  } catch (error) {
    console.error('Error creating content:', error);
    res.status(500).json({ error: 'Failed to create content.' });
  }
});

// DELETE /admin/contents/:id - Delete content
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const content = await Content.findByPk(id);

    if (!content) {
      return res.status(404).json({ error: 'Content not found.' });
    }

    // Optionally delete the file from storage
    // fs.unlinkSync(content.file_path);

    await content.destroy();

    res.json({ message: 'Content deleted successfully.' });
  } catch (error) {
    console.error('Error deleting content:', error);
    res.status(500).json({ error: 'Failed to delete content.' });
  }
});

module.exports = router;
