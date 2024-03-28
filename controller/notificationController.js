const nodemailer = require('nodemailer');
const cron = require('node-cron');
const InventoryItem = require('../model/InventoryItem');
const Email = require('../model/notification');

// Function to create a new email address
const createEmail = async (req, res) => {
  try {
    const { address } = req.body;
    const newEmail = new Email({ address });
    await newEmail.save();
    res.status(201).json({ message: 'Email address created successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Function to send notification when inventory quantity is low
const sendLowInventoryNotification = async (emailAddress, itemsBelowThreshold) => {
  try {
    // Create transporter for sending email
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'enterct35i@gmail.com', // Sender's email address
        pass: 'eivj sueg qdqg zmsl' // Sender's email password
      }
    });

    // Prepare email options
    const mailOptions = {
      from: 'enterct35i@gmail.com',
      to: emailAddress,
      subject: 'Low InventoryItems Notification',
      html: generateTableHTML(itemsBelowThreshold) // Generate HTML table with inventory items below threshold
    };

    // Send email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending low inventory notification:', error.message);
    throw new Error('Failed to send notification');
  }
};

// Function to send notification when inventory quantity exceeds maximum threshold
const sendHighInventoryNotification = async (emailAddress, itemsAboveThreshold) => {
  try {
    // Create transporter for sending email
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER, // Sender's email address
        pass: process.env.EMAIL_PASS// Sender's email password
      }
    });

    // Prepare email options
    const mailOptions = {
      from: 'enterct35i@gmail.com',
      to: emailAddress,
      subject: 'High InventoryItem Notification',
      html: generateTableHTML(itemsAboveThreshold) // Generate HTML table with inventory items above threshold
    };

    // Send email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending high inventory notification:', error.message);
    throw new Error('Failed to send notification');
  }
};

// Function to generate HTML table with inventory items below or above threshold
const generateTableHTML = (items) => {
  let tableHTML = '<table border="1"><thead><tr><th>Inventory Item</th><th>Total Quantity</th><th>Total Price</th></tr></thead><tbody>';

  items.forEach(item => {
    tableHTML += `<tr><td>${item.name}</td><td>${item.quantity}</td><td>${item.quantity * item.price}</td></tr>`;
  });

  tableHTML += '</tbody></table>';

  return tableHTML;
};

// Function to check thresholds and send notifications
const checkThresholdsAndSendNotifications = async () => {
  try {
    // Fetch all inventory items
    const items = await InventoryItem.find();

    // Filter items with quantities below minimum threshold
    const itemsBelowThreshold = items.filter(item => item.quantity < item.minThreshold);

    // Filter items with quantities above maximum threshold
    const itemsAboveThreshold = items.filter(item => item.quantity > item.maxThreshold);

    if (itemsBelowThreshold.length > 0) {
      // Fetch registered email addresses
      const emails = await Email.find();

      // Send notifications for low inventory to each email address
      for (const email of emails) {
        // Check if 24 hours have passed since the last notification
        if (!email.lastNotificationSent || (Date.now() - email.lastNotificationSent) >= 24 * 60 * 60 * 1000) {
          await sendLowInventoryNotification(email.address, itemsBelowThreshold);
          // Update lastNotificationSent timestamp
          email.lastNotificationSent = Date.now();
          await email.save();
        }
      }
    }

    if (itemsAboveThreshold.length > 0) {
      // Fetch registered email addresses
      const emails = await Email.find();

      // Send notifications for high inventory to each email address
      for (const email of emails) {
        // Check if 24 hours have passed since the last notification
        if (!email.lastNotificationSent || (Date.now() - email.lastNotificationSent) >= 24 * 60 * 60 * 1000) {
          await sendHighInventoryNotification(email.address, itemsAboveThreshold);
          // Update lastNotificationSent timestamp
          email.lastNotificationSent = Date.now();
          await email.save();
        }
      }
    }
  }
 catch (error) {
  console.error('Error checking thresholds and sending notifications:', error.message);
}
};


cron.schedule('0 0 * * *', async () => {
  console.log('Running inventory threshold check...');
  await checkThresholdsAndSendNotifications();
});


module.exports = {
createEmail
};
