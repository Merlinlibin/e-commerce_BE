const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
require("dotenv").config();
const dataRouter = require("./routes/dataRoute");
const userRouter = require("./routes/userRoutes");
const orderRouter = require("./routes/orderRoute");
const PORT = process.env.PORT;
const app = express();

app.use(express.json());

app.use(cors());

app.use("/api/data", dataRouter);
app.use("/api/auth", userRouter);
app.use("/api", orderRouter);

app.listen(PORT, async () => {
  console.log("Connectin to server");
  await connectDB();
  console.log("Server is running on http://localhost:3000");
});
