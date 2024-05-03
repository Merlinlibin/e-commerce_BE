const express = require("express");
const orderRouter = express.Router();
const {
  orderId,
  validation,
  handleCod,
} = require("../controllers/orderController");
const { authentication } = require("../middleware/authMiddleware");

orderRouter.post("/order", authentication, orderId);
orderRouter.post("/order/validate", authentication, validation);
orderRouter.post("/handleCod", authentication, handleCod);

module.exports = orderRouter;
