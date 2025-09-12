const express = require("express");
const { signup, login, getUsers, verifyOTP } = require("../controllers/user.controller");

const router = express.Router();

router.get("/", getUsers);
router.post("/signup", signup);
router.post("/login", login);
router.post("/verifyOTP", verifyOTP);

module.exports = router;
