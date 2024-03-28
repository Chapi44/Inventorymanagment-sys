const express = require('express');
const router = express.Router();
const stockMovementController = require('../controller/stockMovementController');
const {
  authenticateUser,
  authorizePermissions,

}= require("../middelware/authentication")

// Route for creating a new stock movement
router.post(
  "/createStockMovement",authenticateUser, authorizePermissions('admin','storemanager'),
  stockMovementController.createStockMovement
);

// Route for getting all stock movements
router.get(
  "/getAllStockMovements",authenticateUser, authorizePermissions('admin','storemanager'),
  stockMovementController.getAllStockMovements
);

// Route for getting a stock movement by ID
router.get(
  "/getStockMovementById/:id",authenticateUser, authorizePermissions('admin','storemanager'),
  stockMovementController.getStockMovementById
);

// Route for updating a stock movement
router.put(
  "/updateStockMovement/:id",authenticateUser, authorizePermissions('admin','storemanager'),
  stockMovementController.updateStockMovement
);

// Route for deleting a stock movement
router.delete(
  "/deleteStockMovement/:id",authenticateUser, authorizePermissions('admin','storemanager'),
  stockMovementController.deleteStockMovement
);

module.exports = router;
