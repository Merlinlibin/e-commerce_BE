const express = require("express");
const dataRouter = express.Router();
const { getAllData, getSingleData } = require("../controllers/dataControllers");

dataRouter.get("/", getAllData);
dataRouter.get("/:id", getSingleData);

module.exports = dataRouter;
