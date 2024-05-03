const Data = require("../models/dataModel");

//get all data
const getAllData = async (req, res) => {
  try {
    const data = await Data.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getSingleData = async (req, res) => {
  try {
    const id= req.params.id;
    const data = await Data.find({_id: id});
    if (!data) return res.status(404).send("No data with this ID");
    
    res.status(200).json(data[0]);
    
  } catch (error) {
    res.status(400).send(error);
  }
};
module.exports = { getAllData, getSingleData };