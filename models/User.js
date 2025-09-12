const { DataTypes } = require("sequelize");
const sequelize = require("../connection/db");

const User = sequelize.define("user", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    mobile: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    otp: { type: DataTypes.STRING, allowNull: true },
    otpExpiry: { type: DataTypes.DATE, allowNull: true },
    token: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true
    }
},{
    defaultScope: {
        attributes: { exclude: ["token"] }  //hide sensitive fields globally
    }
});

module.exports = User;

