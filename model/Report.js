const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
},{
    timestamps: true
});

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;
