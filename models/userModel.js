const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  password: { type: String, required: true },
  state: { type: String, required: true },
  phone: { type: String, required: true },
  pincode: { type: String, required: true },

  cart: [{ type: mongoose.Schema.Types.ObjectId, ref: "datas" }], 

  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "datas" }], 
});

const User = mongoose.model("users", userSchema);

module.exports = User;
