const express = require("express");
const userRouter = express.Router();
const {
  login,
  signup,
  loggedinUser,
  addToWishlist,
  removeFromWishlist,
  WishlistItems,
  addToCart,
  CartItems,
  removeFromCart,
  orderId,
} = require("../controllers/userController");
const { authentication } = require("../middleware/authMiddleware");

userRouter.post("/login", login);
userRouter.post("/signup", signup);
userRouter.get("/loggedinUser", loggedinUser);
userRouter.post("/addTowishlist", authentication, addToWishlist);
userRouter.post("/removewishlist/:id", authentication, removeFromWishlist);
userRouter.get("/wishlistItems", authentication, WishlistItems);
userRouter.post("/addTocart", authentication, addToCart);
userRouter.get("/cartItems", authentication, CartItems);
userRouter.post("/removecart/:id", authentication, removeFromCart);

module.exports = userRouter;
