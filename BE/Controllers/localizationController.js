const Localization = require('../Models/localizationModel');
const Location = require('../Models/locationModel')
exports.getLocalization = async (req, res) => {
  try {
    const localizations = await Localization.find();
    res.json(localizations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
exports.getAllLocation = async (req, res) => {
  try {
    const locations = await Location.find();
    res.json(locations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
exports.postLocation = async (req, res) => {
  try {
    const { time, location } = req.body;
    console.log(location)

    // Create a new localization instance
    const newLocation = new Location({
      time,
      x:location.x,
      y:location.y,
      z:location.z,
      // add other fields as needed
    });

    // Save the localization to the database
    const savedLocation = await newLocation.save();

    // Respond with the newly created localization
    res.status(201).json(savedLocation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
exports.deleteLocation = async (req, res) => {
  try {
    // Delete all documents from the 'devices' collection
    const result = await Location.deleteMany({});

    // Check the result to see if any documents were deleted
    if (result.deletedCount > 0) {
      res.json({ message: "All location deleted successfully" });
    } else {
      res.json({ message: "No location to delete" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.postLocalization = async (req, res) => {
    try {
      const { status, /* add other fields as needed */ } = req.body;
  
      // Validate required fields
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
  
      // Create a new localization instance
      const newLocalization = new Localization({
        status,
        // add other fields as needed
      });
  
      // Save the localization to the database
      const savedLocalization = await newLocalization.save();
  
      // Respond with the newly created localization
      res.status(201).json(savedLocalization);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  exports.putLocalization = async (req, res) => {
    try {
      console.log("--")
      const { status, /* add other fields as needed */ } = req.body;
      
  
      // Validate required fields
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
  
      // Find and update the localization by ID
      const localization = await Localization.find()
      const updatedLocalization = await Localization.findByIdAndUpdate(
        localization[0]._id,
        {
          $set: {
            status,
            // add other fields as needed
          },
        },
        { new: true } // Return the updated document
      );
  
      // Check if the localization was found and updated
      if (!updatedLocalization) {
        return res.status(404).json({ message: "Localization not found" });
      }
  
      // Respond with the updated localization
      res.json(updatedLocalization);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };