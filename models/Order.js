const { DataTypes } = require("sequelize");
const sequelize = require("../connection/db");
const User = require("./User");

const Order = sequelize.define("Order", {
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 }
});

// Relationships
User.hasMany(Order);
Order.belongsTo(User);

module.exports = Order;
