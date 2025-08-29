import Address from "../models/address.js";

//Add Address : /api/address/add
export const addAddress = async (req, res) => {
  try {
    console.log("Received Address Body:", req.body);  // <-- Put it here
    await Address.create(req.body);  // req.body already contains all fields directly
    res.json({ success: true, message: "Address added successfully" });
  } catch (error) {
    console.log("Error adding address:", error.message);
    res.json({ success: false, message: error.message });
  }
};

//Get Address : /api/address/get
export const getAddress = async (req, res) => {
  try {
    const { userId } = req.body;
    const addresses = await Address.find({ userId });

    res.json({ success: true, addresses }); 
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
