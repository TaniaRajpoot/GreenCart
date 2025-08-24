import Address from "../models/address.js";

//Add Address : /api/address/add
export const addAddress = async (req, res) => {
  try {
    console.log("Received Address Body:", req.body);

    // Validate required fields
    const {
      userId,
      firstName,
      lastName,
      email,
      street,
      city,
      state,
      zipCode,
      country,
      phone,
    } = req.body;

    if (!userId) {
      return res.json({
        success: false,
        message: "User ID is required. Please login first.",
      });
    }

    if (
      !firstName ||
      !lastName ||
      !email ||
      !street ||
      !city ||
      !state ||
      !zipCode ||
      !country ||
      !phone
    ) {
      return res.json({
        success: false,
        message: "All address fields are required",
      });
    }

    // Create the address with the provided userId (could be _id or email)
    const newAddress = await Address.create({
      userId,
      firstName,
      lastName,
      email,
      street,
      city,
      state,
      zipCode: Number(zipCode),
      country,
      phone: Number(phone),
    });

    console.log("Address created successfully:", newAddress._id);
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

    res.json({ success: true, addresses }); // ✅ return actual addresses
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
