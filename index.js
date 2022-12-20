const express = require("express");
const app = express();
const port = 3001;
const { connectDB } = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");

// middleware
app.use(express.json);
app.use(express.urlencoded({ extended: false }));
app.use(express.static("Content"));

app.use("api/v1/user", userRoutes);
app.use("api/v1/product", productRoutes);

app.listen(port, () => {
  console.log("server listening on port");
  connectDB();
});
