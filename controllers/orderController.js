const Order = require("../models/orderModel");
const User = require("../models/userModel");
const Razorpay = require("razorpay");
const crypto = require("crypto");
require("dotenv").config();

const orderId = async (req, res) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const { orderDetails } = req.body;

    const order_recipt_id = crypto.randomBytes(10).toString("hex");

    const myOrder = await Order.create({
      order_recipt_id: `ORDER_ID_${order_recipt_id}`,
      address: orderDetails.address,
      contactDetail: orderDetails.contactDetail,
      name: orderDetails.name,
      email: orderDetails.email,
      paymentMode: orderDetails.paymentMode,
      pincode: orderDetails.pincode,
      state: orderDetails.state,
      totalDiscount: orderDetails.totalDiscount,
      totalMrp: orderDetails.totalMrp,
      totalPayableAmount: orderDetails.totalPayableAmount,
      products: orderDetails.products,
    });

    if (!myOrder) {
      return res
        .status(500)
        .send({ success: false, message: "Error updating the order" });
    }
    if (myOrder.paymentMode === "cashOnDelivery") {
      return res
        .status(200)
        .json({ myOrder, success: true, message: "order confirmed" });
    }
    const options = {
      amount: `${myOrder.totalPayableAmount * 100}`,
      currency: "INR",
      receipt: `${myOrder.order_id}`,
    };
    const order = await razorpay.orders.create(options);

    if (!order) {
      return res
        .status(500)
        .send({ success: false, message: "Error placing the order" });
    }

    res.status(200).json({
      orderPaymentDetail: order,
      myOrder: myOrder,
      success: true,
      message: "order confirmed",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error", err);
  }
};

const validation = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    order_recipt_id,
    userId,
  } = req.body;

  const sha = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
  sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);

  const digest = sha.digest("hex");

  if (digest !== razorpay_signature) {
    return res
      .status(400)
      .json({ success: false, message: "Transaction is not legit!" });
  }

  const orderDetail = await Order.findOneAndUpdate(
    { order_recipt_id: order_recipt_id },
    {
      $set: {
        razorpay_payment_id: razorpay_payment_id,
        razorpay_order_id: razorpay_order_id,
      },
    },
    { new: true }
  );
  const userUpdated = await User.updateOne(
    { _id: userId },
    { $set: { cart: [] } }
  );

  res.json({
    success: true,
    message: "payment success",
    orderDetail,
  });
};

const handleCod = async (req, res) => {
  try {
    const { userId } = req.body;

    await User.updateOne({ _id: userId }, { $set: { cart: [] } });

    res.json({
      success: true,
      message: "Order Placed with  COD Successfully!",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: `Error Occured${error}` });
  }
};

module.exports = {
  orderId,
  validation,
  handleCod,
};
