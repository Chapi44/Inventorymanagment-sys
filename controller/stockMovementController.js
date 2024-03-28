const InventoryItem = require("../model/InventoryItem");
const StockMovement = require("../model/StockMovement");

const createStockMovement = async (req, res) => {
  try {
    const { inventoryItemId, movementType, quantity } = req.body;

    const inventoryItem = await InventoryItem.findById(inventoryItemId);

    let updatedQuantity;
    if (movementType === "purchase" || movementType === "return") {
      updatedQuantity = inventoryItem.quantity + quantity;

    } else if (movementType === "sale") {
      if (inventoryItem.quantity < quantity) {
        return res.status(400).json({
          message: `Insufficient quantity in stock. The amount is ${inventoryItem.quantity}`,
        });
      }
      updatedQuantity = inventoryItem.quantity - quantity;
    }

    const newMovement = new StockMovement({
      inventoryItem: inventoryItemId,
      movementType,
      quantity,
    });
    const savedMovement = await newMovement.save();

    // Update the inventory item's quantity
    const updatedItem = await InventoryItem.findByIdAndUpdate(
      inventoryItemId,
      { quantity: updatedQuantity },
      { new: true }
    );

    res.status(201).json({ savedMovement, updatedItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all stock movements
const getAllStockMovements = async (req, res) => {
  try {
    const stockMovements = await StockMovement.find();
    res.json(stockMovements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getStockMovementById = async (req, res) => {
  try {
    const { id } = req.params;
    const stockMovement = await StockMovement.findById(id);
    if (!stockMovement) {
      return res.status(404).json({ message: 'Stock movement not found' });
    }
    res.json(stockMovement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a stock movement
const updateStockMovement = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedMovement = await StockMovement.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    res.json(updatedMovement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a stock movement
const deleteStockMovement = async (req, res) => {
  try {
    const { id } = req.params;
    await StockMovement.findByIdAndDelete(id);
    res.json({ message: "Stock movement deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports ={
  createStockMovement,
  getAllStockMovements,
  getStockMovementById,
  updateStockMovement,
  deleteStockMovement,
}