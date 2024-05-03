const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dataSchema = new Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  Price: { type: String, required: true },
  offer: { type: String, required: true },
  sizes: {
    type: [String], // Array of strings
    required: true, // Optional: specify if the array is required
  },
});

const Data = mongoose.model("datas", dataSchema);

module.exports = Data;
