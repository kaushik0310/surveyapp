const mongoose = require("mongoose");

const ResponseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    response: { type: String, required: true, trim: true },
    rating: { type: Number, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Response", ResponseSchema);