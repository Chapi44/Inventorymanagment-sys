const nodemailer = require('nodemailer');
const InventoryItem = require('../model/InventoryItem');
const StockMovement = require('../model/StockMovement');

// Controller for generating and emailing reports
const generateAndSendReport = async (req, res) => {
  try {
    // Get inventory items and stock movements
    const inventoryItems = await InventoryItem.find();
    const stockMovements = await StockMovement.find();

    // Generate inventory items table
    let inventoryItemsTable = '<h2>Inventory Items</h2><table border="1"><tr><th>Product</th><th>Sales</th><th>Purchases</th><th>Returns</th><th>Purchase Orders</th><th>Total Quantity</th><th>Price</th><th>Total Price</th></tr>';
    inventoryItems.forEach(item => {
      // Calculate sales, purchases, returns, and purchase orders
      const sales = stockMovements.filter(movement => movement.inventoryItem.toString() === item._id.toString() && movement.movementType === 'sale').length;
      const purchases = stockMovements.filter(movement => movement.inventoryItem.toString() === item._id.toString() && movement.movementType === 'purchase').length;
      const returns = stockMovements.filter(movement => movement.inventoryItem.toString() === item._id.toString() && movement.movementType === 'return').length;
      const purchaseOrders = stockMovements.filter(movement => movement.inventoryItem.toString() === item._id.toString() && movement.movementType === 'purchase orders').length;

      // Calculate total quantity and total price
      const totalQuantity = item.quantity - returns + purchaseOrders;
      const totalPrice = totalQuantity * item.price;

      // Add row to the table
      inventoryItemsTable += `<tr><td>${item.name}</td><td>${sales}</td><td>${purchases}</td><td>${returns}</td><td>${purchaseOrders}</td><td>${totalQuantity}</td><td>${item.price}</td><td>${totalPrice}</td></tr>`;
    });
    inventoryItemsTable += '</table>';

    // Combine table into report content
    const reportContent = inventoryItemsTable;

    // Create transporter for sending email
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER, // Sender's email address
        pass: process.env.EMAIL_PASS // Sender's email password
      }
    });

    // Prepare email options
    const mailOptions = {
      from: 'enterct35i@gmail.com',
      to: req.body.email, // Receiver's email address (specified in request body)
      subject: 'Inventory Report',
      html: reportContent
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Report sent successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  generateAndSendReport
};
