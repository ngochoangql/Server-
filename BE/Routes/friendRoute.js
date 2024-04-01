

const express = require("express");
const router = express.Router();
const friendController = require("../Controllers/friendController");



router.get("/get/:user_uuid",friendController.getAllFriend);
router.post("/add",friendController.addFriend);
module.exports = router;


