// routes/userRoutes.js

const express = require("express");
const router = express.Router();
const localizationController = require("../Controllers/localizationController");

// Đây là một tuyến đường bình thường không yêu cầu xác thực
router.get("/", localizationController.getLocalization);
router.post("/", localizationController.postLocalization);
router.post("/location/",localizationController.postLocation)
router.get("/location/",localizationController.getAllLocation)
router.delete("/location/",localizationController.deleteLocation)
router.put("/", localizationController.putLocalization);
// router.delete("/", deviceController.deleteAllDevices);

module.exports = router;


