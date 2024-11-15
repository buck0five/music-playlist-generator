// routes/admin.js

const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

// Import routers
const companiesRouter = require('./admin/companies');
const stationsRouter = require('./admin/stations');
const platformsRouter = require('./admin/platforms');
const contentLibrariesRouter = require('./admin/contentLibraries');
const contentsRouter = require('./admin/contents');
const usersRouter = require('./admin/users');
const contentLibraryAssignmentsRouter = require('./admin/contentLibraryAssignments');

// Apply authentication and authorization middleware to all admin routes
router.use(authenticate);
router.use(authorize('admin'));

// Mount routers
router.use('/companies', companiesRouter);
router.use('/stations', stationsRouter);
router.use('/platforms', platformsRouter);
router.use('/content-libraries', contentLibrariesRouter);
router.use('/contents', contentsRouter);
router.use('/users', usersRouter);
router.use('/content-library-assignments', contentLibraryAssignmentsRouter);

module.exports = router;
