import jwt from "jsonwebtoken";
import Company from "../models/Company.js";

const protectCompany = async (req, res, next) => {
  let token = req.headers.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    console.log("No token found in request headers:", req.headers);
    return res.json({ success: false, message: "Not authorized, Login Again" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded ID: ", decoded.id); // log the decoded id

    // Find company by decoded ID
    req.Company = await Company.findById(decoded.id).select("-password");
    console.log("Company fetched: ", req.Company); // log company data fetched

    if (!req.Company) {
      return res.json({ success: false, message: "Company not found" });
    }

    next();
  } catch (error) {
    console.log("Token verification failed:", error.message);
    return res.json({ success: false, message: "Token verification failed: " + error.message });
  }
};

export default protectCompany;
