const express = require("express");
const router = express.Router();
const upload = require("../utils/fileUpload");
const { isAuthenticated, isSeller } = require("../middlewares/auth");
const Product = require("../models/productModel");

router.post("/create", isAuthenticated, isSeller, (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (isNaN(req.body.price)) {
      return res.status(400).json({ err: "Price must be a number" });
    }

    const { name, price } = req.body;
    if (!name || price || req.file) {
      return res
        .status(404)
        .json({ err: "All fields should be selected - name, price, file" });
    }
    let productDetails = { name, price, content: req.file.path };

    return res.status(200).json({ status: "OK", productDetails });

    const createProduct = await Product.create(productDetails);

    console.log("created product", createProduct);

    return res.status(200).json({ message: "product created successfully" });
  });
});

router.get("/getproducts", isAuthenticated, async (req, res) => {
  try {
    const products = await Product.findAll();
    return res.status(200).json({ Product: products });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
