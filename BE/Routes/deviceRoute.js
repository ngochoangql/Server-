// routes/userRoutes.js

const express = require("express");
const router = express.Router();
const deviceController = require("../Controllers/deviceController");

// Đây là một tuyến đường bình thường không yêu cầu xác thực
router.get("/", deviceController.getAllDevice);
router.get("/:addr", deviceController.getDevice);
router.post("/", deviceController.postDevice);
router.put("/", deviceController.putDevice);
router.put("/:addr", deviceController.putDeviceDisconnet);
router.put("/tag/:addr", deviceController.putDeviceTag);

router.delete("/", deviceController.deleteAllDevices);



module.exports = router;


