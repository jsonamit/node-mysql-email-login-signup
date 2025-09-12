const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,      // database name
  process.env.DB_USER,      // user
  process.env.DB_PASSWORD,  // password
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false
  }
);

sequelize.authenticate()
  .then(() => console.log("MySQL connected"))
  .catch(err => console.error("MySQL connection error:", err));

module.exports = sequelize;
