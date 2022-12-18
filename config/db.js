const { Sequelize } = require("sequelize");

//sequelize with the name of database, username, password and configuration options
const createDB = new Sequelize("testdb", "user", "pass", {
  dialect: "sqlite",
  host: "./config/db.sqlite",
});

//connect the expressjs to the database

const connectDB = () => {
  createDB
    .sync()
    .then((res) => {
      console.log("Successfully connected to database");
    })
    .catch((err) => console.log("Can't connect to database due to :", err));
};

module.exports = { createDB, connectDB };
