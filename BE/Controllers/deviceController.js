// controllers/userController.js

const { set } = require("mongoose");
const Device = require("../Models/deviceModel"); // Import model

// Hàm xử lý cho việc lấy thông tin người dùng theo ID
exports.getAllDevice = async (req, res) => {
  try {
    const devices = await Device.find();
    if (devices && devices.length > 0) {
      res.json(devices);
    } else {
      res.status(404).json({ message: "Devices not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
exports.getDevice = async (req, res) => {
  try {
    const deviceAddr = req.params.addr
    const devices = await Device.findOne({"addr":deviceAddr})
    if (devices) {
      res.json(devices);
    } else {
      res.status(404).json({ message: "Devices not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
exports.postDevice = async (req, res) => {
  try {
    const { name, addr, type, location, operation, status } = req.body; // Assuming you have these fields in your device schema

    // Validate required fields
    if (!name || !addr) {
      return res.status(400).json({ message: "Name and addr are required" });
    }

    // Create a new device instance
    const newDevice = new Device({
      name,
      addr,
      type,
      location,
      operation,
      status, // Add other fields as needed
    });

    // Save the device to the database
    const savedDevice = await newDevice.save();

    // Respond with the newly created device
    res.status(201).json(savedDevice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
exports.putDevice = async (req, res) => {
  try {
    const { addr, location, operation, type, name, status } = req.body;

    // Validate required fields
    if (!addr) {
      return res.status(400).json({ message: "Device Address are required" });
    }

    // Find and update the device by ID
    const updatedDevice = await Device.findOneAndUpdate(
      { addr: addr },
      {
        $set: {
          name,
          addr,
          type,
          location,
          operation,
          status,
        },
      },
      { new: true }
    );
    if (!updatedDevice) {
      const newDevice = new Device({
        name,
        addr,
        type,
        location,
        operation,
        status, // Add other fields as needed
      });

      // Save the device to the database
      const savedDevice = await newDevice.save();
      res.json(newDevice);
    } else {
      res.json(updatedDevice);
    }

    // Check if the device was found and updated

    // Respond with the updated device
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
exports.putDeviceDisconnet = async (req, res) => {
  try {
    const { addr,status } = req.body;
    const deviceAddr = req.params.addr
    // Validate required fields
    if (!deviceAddr) {
      return res.status(400).json({ message: "Device Address are required" });
    }

    // Find and update the device by ID
    const updatedDevice = await Device.findOneAndUpdate(
      { addr: deviceAddr },
      {
        $set: {
          status,
        },
      },
      { new: true }
    );
    res.status(201).json(updatedDevice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.putDeviceTag = async (req, res) => {
  try {
    const { addr,location,operation } = req.body;
    const deviceAddr = req.params.addr

    if (!deviceAddr) {
      return res.status(400).json({ message: "Device Address are required" });
    }

    // Find and update the device by ID
    const updatedDevice = await Device.findOneAndUpdate(
      { addr: deviceAddr },
      {
        $set: {
          location,
          operation
        },
      },
      { new: true }
    );
    res.status(201).json(updatedDevice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
exports.deleteAllDevices = async (req, res) => {
  try {
    // Delete all documents from the 'devices' collection
    const result = await Device.deleteMany({});

    // Check the result to see if any documents were deleted
    if (result.deletedCount > 0) {
      res.json({ message: "All devices deleted successfully" });
    } else {
      res.json({ message: "No devices to delete" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
