const { DataTypes } = require("sequelize");
const { createDB } = require("../config/db");

const Order = createDB.define("order", {
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  },
  productId: DataTypes.INTEGER,
  productName: DataTypes.STRING,
  productPrice: DataTypes.DECIMAL,
  buyerId: DataTypes.INTEGER,
  buyerEmail: DataTypes.STRING,
});

module.exports = Order;
