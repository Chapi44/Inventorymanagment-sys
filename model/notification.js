const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
    unique: true
  }
}, { timestamps: true });

// Create a "post" hook to emit an event after saving a new email
emailSchema.post('save', function (doc, next) {
  // Emit an event named 'newEmail' and pass the email address as data
  this.constructor.emit('newEmail', doc.address);
  next();
});

const Email = mongoose.model('Email', emailSchema);

module.exports = Email;
