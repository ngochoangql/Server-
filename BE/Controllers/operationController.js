const Operation = require('../Models/operationModel');

exports.getOperation = async (req, res) => {
  try {
    const operation = await Operation.find();
    res.json(operation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


  exports.putOperation = async (req, res) => {
    try {
      const {  status, addr,type,operation,location } = req.body;
    
      // Find and update the localization by ID
      const update = await Operation.find()
      console.log("1")
      const updatedLocalization = await Operation.findOneAndUpdate(
        {addr:update[0].addr},
        {   
          $set: {
            addr,
            status,
            type,
            operation,
            location
            // add other fields as needed
          },
        },
        { new: true } // Return the updated document
      );
      if (!updatedLocalization) {
        const newOperation = new Operation({
            addr,
            status,
            type,
            operation,
            location
            // add other fields as needed
          });
      
          // Save the localization to the database
          const saveOperation = await newOperation.save();
          
          res.json({data:saveOperation,status:true});
      } 
      // Check if the localization was found and updated
      if (!updatedLocalization) {
        return res.status(404).json({ message: "Operation not found" });
      }
  
      // Respond with the updated localization
      res.json(updatedLocalization);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };