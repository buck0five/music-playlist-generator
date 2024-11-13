// admin.js

import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import AdminJSSequelize from '@adminjs/sequelize';
import sequelize from './config/database.js';
import * as models from './models/index.js';
import bcrypt from 'bcrypt';

// Register the Sequelize adapter
AdminJS.registerAdapter(AdminJSSequelize);

// Initialize AdminJS
const adminJs = new AdminJS({
  databases: [sequelize],
  rootPath: '/admin',
  resources: [
    {
      resource: models.User,
      options: {
        properties: {
          password: { type: 'password' },
        },
        actions: {
          new: {
            before: async (request) => {
              if (request.payload.password) {
                request.payload.password = await bcrypt.hash(
                  request.payload.password,
                  10
                );
              }
              return request;
            },
          },
          edit: {
            before: async (request) => {
              if (request.payload.password) {
                request.payload.password = await bcrypt.hash(
                  request.payload.password,
                  10
                );
              } else {
                delete request.payload.password;
              }
              return request;
            },
          },
        },
      },
    },
    { resource: models.Platform },
    { resource: models.Company },
    { resource: models.Station },
    { resource: models.Content },
    { resource: models.ContentLibrary },
    { resource: models.ContentLibraryAssignment },
    { resource: models.ClockTemplate },
    { resource: models.ClockSegment },
    { resource: models.Format },
    { resource: models.Feedback },
    { resource: models.Cart },
    { resource: models.ContentCart },
    { resource: models.UserPreferences },
  ],
});

// Build the router
const adminRouter = AdminJSExpress.buildAuthenticatedRouter(adminJs, {
  authenticate: async (email, password) => {
    const user = await models.User.findOne({ where: { email } });
    if (user && user.role === 'admin') {
      const validPassword = await bcrypt.compare(password, user.password);
      if (validPassword) {
        return user;
      }
    }
    return null;
  },
  cookieName: 'adminjs',
  cookiePassword: process.env.ADMIN_COOKIE_SECRET || 'some-secret-password',
});

export { adminJs, adminRouter };
