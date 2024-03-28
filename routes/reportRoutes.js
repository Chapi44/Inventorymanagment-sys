const express = require('express');
const router = express.Router();
const reportController = require('../controller/reportController');

const {
    authenticateUser,
    authorizePermissions,
  
  }= require("../middelware/authentication")

// Route for generating and sending a report via email
router.post("/generateAndSendReport", authenticateUser, authorizePermissions('admin','storemanager'),reportController.generateAndSendReport);

module.exports = router;
