const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  order_recipt_id: { type: String, required: true },
  razorpay_payment_id: { type: String },
  razorpay_order_id: { type: String},
  address: { type: String, requirfed: true },
  contactDetail: { type: String, requirfed: true },
  name: { type: String, requirfed: true },
  email: { type: String, requirfed: true },
  paymentMode: { type: String, requirfed: true },
  pincode: { type: String, requirfed: true },
  state: { type: String, requirfed: true },
  totalDiscount: { type: String, requirfed: true },
  totalMrp: { type: String, requirfed: true },
  totalPayableAmount: { type: String, requirfed: true },
  products: [
    {
      _id: { type: String, required: true },
      name: { type: String, required: true },
      image: { type: String, required: true },
      category: { type: String, required: true },
      Price: { type: String, required: true },
      offer: { type: String, required: true },
      sizes: [String],
      quantity: { type: Number, required: true },
    },
  ],
});

const Order = mongoose.model("orders", orderSchema);

module.exports = Order;
