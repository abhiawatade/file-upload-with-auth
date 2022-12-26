const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ err: authorizationError });
    }
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        err: "No token, authorization denied",
      });
    }
    const decode = jwt.verify(token, "SECRET MESSAGE");
    const user = await User.findOne({ where: { id: decode.id } });

    if (!user) {
      return res.status(401).json({ err: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).send(error);
  }
};

const isSeller = (req, res, next) => {
  if (req.user.dataValues.isSeller) {
    next();
  } else {
    res.status(401).json({
      err: "You are not a seller",
    });
  }
};

const isBuyer = (req, res, next) => {
  if (!req.user.dataValues.isSeller) {
    next();
  } else {
    res.status(401).json({ err: "You are not a buyer" });
  }
};

module.exports = { isAuthenticated, isSeller, isBuyer };
