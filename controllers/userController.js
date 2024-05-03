const User = require("../models/userModel");
const Data = require("../models/dataModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Razorpay = require("razorpay");
const crypto = require("crypto");
require("dotenv").config();

const signup = async (req, res) => {
  const { username, email, address, password, state, phone, pincode } =
    req.body;
  try {
    if (!username || !email || !password || !address || !phone || !pincode)
      return res
        .status(400)
        .send({ success: false, message: "please Enter all fields" });

    const userExist = await User.findOne({ email });
    if (userExist)
      return res
        .status(400)
        .send({ success: false, message: "user already  exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      address,
      state,
      phone,
      pincode,
    });
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "12h",
    });
    if (user) {
      return res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: token,
        success: true,
        message: "User Created Successfully",
      });
    } else {
      return res
        .status(400)
        .send({ success: false, message: "Failed to create user" });
    }
  } catch (error) {
    console.log(`Error in SignUp : ${error}`);
    return res
      .status(500)
      .send({ success: false, message: `Server Error : ${error} ` });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user) {
      const isAuthenticated = await bcrypt.compare(password, user.password);

      if (!isAuthenticated) {
        return res.status(401).json({
          success: false,
          message: "password is incorrect",
        });
      }
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "12h",
      });
      return res.status(200).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: token,
        success: true,
        message: "logged in sucessfully",
      });
    } else {
      return res.status(400).send({
        success: false,
        message: "User dosent exist, Please signup and continue",
      });
    }
  } catch (error) {
    console.log(`Error in SignUp : ${error}`);
    return res.status(500).send({
      success: false,
      message: `Server Error : ${error} `,
    });
  }
};

const loggedinUser = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token)
      return res
        .status(401)
        .json({ success: true, message: "user Unauthorized" });

    const data = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(data._id);
    if (user) {
      return res.json({ user, success: true, message: "user found" });
    } else {
      return res.status(404).json({ success: true, message: "user not found" });
    }
  } catch (error) {
    res.json({
      success: false,
      message: "session has expire please login again",
    });
  }
};

const addToWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const product = req.body;
    if (!user) {
      return res.json({
        success: false,
        message: "Please login and continue..",
      });
    }
    if (user.wishlist.includes(product._id)) {
      return res.json({
        success: false,
        message: "Product already in your wishlist",
      });
    }
    user.wishlist.push(product);

    user.save();
    res
      .status(200)
      .json({ success: true, message: "Product added to Wishlist" });
  } catch (error) {
    console.log(`Error in SignUp : ${error}`);
    return res.status(500).send({
      success: false,
      message: `Server Error : ${error} `,
    });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.json({
        success: false,
        message: "Please login and continue..",
      });
    }
    const productIdToRemove = req.params.id;
    const indexToRemove = user.wishlist.indexOf(productIdToRemove);
    if (indexToRemove === -1) {
      return res.json({
        success: false,
        message: "Product not found in your wishlist",
      });
    }

    user.wishlist.splice(indexToRemove, 1);
    await user.save();

    const wishlistItems = await user.populate("wishlist");

    res.status(200).json({
      wishlistItems,
      success: true,
      message: "Product removed from wishlist",
    });
  } catch (error) {
    console.log(`Error in removing product from wishlist: ${error}`);
    return res.status(500).json({
      success: false,
      message: `Server Error: ${error}`,
    });
  }
};

const WishlistItems = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.json({
        success: false,
        message: "Please login and continue..",
      });
    }
    const wishlistItems = await user.populate("wishlist");

    res
      .status(200)
      .json({ wishlistItems, success: true, message: "Product fetched" });
  } catch (error) {
    console.log(`Error in SignUp : ${error}`);
    return res.status(500).send({
      success: false,
      message: ` ${error} `,
    });
  }
};

const addToCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { product, quantity } = req.body;

    if (!user) {
      return res.json({
        success: false,
        message: "Please login and continue..",
      });
    }

    for (let i = 0; i < quantity; i++) {
      user.cart.push({ ...product });
    }

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Product(s) added to Cart" });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: `Server Error : ${error} `,
    });
  }
};
const removeFromCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
     const {  quantity } = req.body;
    if (!user) {
      return res.json({
        success: false,
        message: "Please login and continue..",
      });
    }

    const productIdToRemove = req.params.id;
    if (!user.cart.includes(productIdToRemove)) {
      return res.json({
        success: false,
        message: "Product not found in your cart",
      });
    }

    if (!quantity) { 
       while (user.cart.includes(productIdToRemove)) {
         const indexToRemove = user.cart.indexOf(productIdToRemove);
         if (indexToRemove === -1) {
           return res.json({
             success: false,
             message: "Product not found in your cart",
           });
         }

         user.cart.splice(indexToRemove, 1);
       }
    } else {
      const indexToRemove = user.cart.indexOf(productIdToRemove);
      if (indexToRemove === -1) {
        return res.json({
          success: false,
          message: "Product not found in your cart",
        });
      }

      user.cart.splice(indexToRemove, 1);
    }
    await user.save();
    const cartItems = await user.populate("cart");

    res.status(200).json({
      cartItems,
      success: true,
      message: "Product removed from cart",
    });
  } catch (error) {
    console.log(`Error in removing product from cart: ${error}`);
    return res.status(500).json({
      success: false,
      message: `Server Error: ${error}`,
    });
  }
};

const CartItems = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.json({
        success: false,
        message: "Please login and continue..",
      });
    }
    const cartItems = await user.populate("cart");

    res
      .status(200)
      .json({ cartItems, success: true, message: "Product fetched" });
  } catch (error) {
    console.log(`Error in SignUp : ${error}`);
    return res.status(500).send({
      success: false,
      message: ` ${error} `,
    });
  }
};


module.exports = {
  signup,
  login,
  loggedinUser,
  addToWishlist,
  removeFromWishlist,
  WishlistItems,
  addToCart,
  CartItems,
  removeFromCart,
};
