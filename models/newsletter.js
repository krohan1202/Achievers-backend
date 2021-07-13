const mongoose = require("mongoose");

const newsletterSchema = new mongoose.Schema(
  {
    firstName: { 
      type: String,
      required: true,
      maxlength: 32,
      trim: true,
    },
    lastName: {
      type: String,
      maxlength: 32,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    phone: {
      type: Number,
      unique: true,
    }

  },
  { timestamps: true }
);

module.exports = mongoose.model("Newsletter", newsletterSchema);