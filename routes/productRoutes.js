const express = require("express");
const router = express.Router();
const upload = require("../utils/fileUpload");
const { isAuthenticated, isSeller, isBuyer } = require("../middlewares/auth");
const Product = require("../models/productModel");
const Order = require("../models/orderModel");
// const stripe = require("stripe")("stripe key")  for stripe payment service

const { WebhookClient } = require("discord.js");

const webhookClient = new WebhookClient({
  url: "url",
});

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

router.post(`/buy/:productId`, isAuthenticated, isBuyer, async (req, res) => {
  try {
    const product = await Product.findOne({
      where: { id: req.params.productId },
    })?.dataValues;

    if (!product) {
      return res.status(404).json({ err: "NO product found" });
    }

    const orderDetails = {
      productId,
      buyerId: req.user.id,
    };

    let paymentMethod = await stripePaymentMethod.create({
      type: "card",
      card: {
        number: "4242424242424242",
        exp_month: 9,
        exp_year: 2023,
        cvc: "314",
      },
    });

    let paymentIntent = await stripe.paymentIntents.create({
      amount: product.dataValues.price * 100,
      currency: "inr",
      payment_method_types: ["card"],
      payment_method: paymentMethod.id,
      confirm: true,
    });

    if (paymentIntent) {
      const createdOrder = await Order.create(orderDetails);

      webhookClient.send({
        content: `I am sending ${createdOrder.id}`,
        userName: "order-deliver",
        avatarURL: "https://i.imgur.com/AfFp7pu.png",
      });

      return res.status(200).json({ createdOrder });
    } else {
      return res.status(400).json({ err: "something went wrong" });
    }
  } catch (error) {
    return res.status(500).json({ err: error });
  }
});

module.exports = router;
