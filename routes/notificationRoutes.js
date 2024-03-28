const express = require('express');
const router = express.Router();
const notificationController = require('../controller/notificationController');
const {
    authenticateUser,
    authorizePermissions,
  
  }= require("../middelware/authentication")

// Route for creating a new email address
router.post('/emails',authenticateUser, authorizePermissions('admin'),notificationController.createEmail);

// Route for checking inventory quantity and sending notifications
// router.post('/inventory/:itemId/quantity', notificationController.checkInventoryQuantity);



module.exports = router;
