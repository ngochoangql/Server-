

const express = require("express");
const router = express.Router();
const userController = require("../Controllers/userController");



router.post("/login", userController.loginUser);
router.post("/signup",userController.signUpUser);
router.get("/all",userController.getAllUser);

module.exports = router;


