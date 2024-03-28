const express = require('express');
const router = express.Router();
const inventoryController = require('../controller/inventoryController');
const {
  authenticateUser,
  authorizePermissions,

}= require("../middelware/authentication")
router.post('/',authenticateUser, authorizePermissions('admin','storemanager'),inventoryController.createInventoryItem);

router.get("/getAllInventoryItems",inventoryController.getAllInventoryItems);

router.get('/getinventorybyid',inventoryController.getInventoryItemById)

router.get(
  "/getCurrentInventoryItems",
  authenticateUser,
  inventoryController.getCurrentInventoryItems
);
router.get(
  "/InventorySearch",
  inventoryController.InventorySearch
);



router.get(
  "/getAllSoldItems",authenticateUser, authorizePermissions('admin','storemanager'),
  inventoryController.getAllSoldItems
);

router.put("/updateInventoryItem/:id", authenticateUser, authorizePermissions('admin','storemanager'),inventoryController.updateInventoryItem);

router.put('/thresholds', authenticateUser, authorizePermissions('admin','storemanager'),inventoryController.setThresholdsForAllItem);

router.delete(
  "/deleteInventoryItem/:id",authenticateUser, authorizePermissions('admin','storemanager'),
  inventoryController.deleteInventoryItem
);

module.exports = router;
