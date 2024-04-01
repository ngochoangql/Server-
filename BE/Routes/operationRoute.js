

// routes/userRoutes.js

const express = require("express");
const router = express.Router();
const operationController = require("../Controllers/operationController");

// Đây là một tuyến đường bình thường không yêu cầu xác thực
router.get("/", operationController.getOperation);
// router.post("/", operationController.postLocalization);
router.put("/",operationController.putOperation);
// router.delete("/", deviceController.deleteAllDevices);



module.exports = router;


