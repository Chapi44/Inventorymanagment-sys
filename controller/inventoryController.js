// controllers/inventoryController.js

const InventoryItem = require("../model/InventoryItem");


// Create a new inventory item
const createInventoryItem = async (req, res) => {
  const userId=req.user.userId;
  console.log(userEmail);
  
  try {
    const { name, description, quantity, price,category } = req.body;
    const newItem = new InventoryItem({
      name,
      description,
      quantity,
      price,
      category,
      user:userId
    });
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all inventory items
const getAllInventoryItems = async (req, res) => {
  try {
    const inventoryItems = await InventoryItem.find();
    res.json(inventoryItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getInventoryItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const inventoryItem = await InventoryItem.findById(id);
    if (!inventoryItem) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }
    res.json(inventoryItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCurrentInventoryItems = async (req, res) => {
  try {
    // Find inventory items with quantity greater than zero
    const inventoryItems = await InventoryItem.find().populate({
      path: "movementTypes",
      match: { movementType: { $in: ["purchase", "return","sale"] } },
    });
    res.json(inventoryItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getAllSoldItems = async (req, res) => {
  try {
    // Find inventory items with quantity equal to zero
    const inventoryItems = await InventoryItem.find().populate({
      path: "movementTypes",
      match: { movementType: "sale" }, // Filter by movementType "sale"
    });

    res.json(inventoryItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedItem = await InventoryItem.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Function to set minimum and maximum thresholds for all inventory items
const setThresholdsForAllItem = async (req, res) => {
  try {
    const { minThreshold, maxThreshold } = req.body;

    // Update thresholds for all inventory items
    await InventoryItem.updateMany({}, { $set: { minThreshold, maxThreshold } });

    res.status(200).json({ message: 'Thresholds updated successfully for all inventory items' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete an inventory item
const deleteInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    await InventoryItem.findByIdAndDelete(id);
    res.json({ message: "Inventory item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const InventorySearch = async (req, res) => {
  const { name } = req.body;

  try {
    const results = await InventoryItem.aggregate([
      {
        $search: {
          index: "name",
          text: {
            query: name,
            path: "name",
            fuzzy: {}
          }
        }
      }
    ]);

    if (results.length === 0) {
      return res.status(200).json({ success: false, data: [] });
    }

    res.status(200).json({ success: true, data: results });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};



module.exports = {
  createInventoryItem,
  getAllInventoryItems,
  getCurrentInventoryItems,
  getAllSoldItems,
  getInventoryItemById,
  updateInventoryItem,
  deleteInventoryItem,
  setThresholdsForAllItem,
  InventorySearch,
};