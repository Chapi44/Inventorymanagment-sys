// models/StockMovement.js

const mongoose = require('mongoose');

const stockMovementSchema = new mongoose.Schema({
  inventoryItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InventoryItem',
    required: true
  },
  movementType: {
    type: String,
    enum: ['purchase', 'sale', 'return', 'adjustment','purchase orders'],
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true
});

const StockMovement = mongoose.model('StockMovement', stockMovementSchema);

module.exports = StockMovement;
