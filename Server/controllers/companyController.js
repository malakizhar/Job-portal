import Company from "../Models/Company.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import generateToken from "../utils/generateToken.js";
import Job from "../Models/Job.js";
import JobApplication from "../Models/JobApplication.js";
// Company registration function
const registerCompany = async (req, res) => {
  const { name, email, password } = req.body;
  const imageFile = req.file; // This is where multer stores the uploaded file

  if (!name || !email || !password || !imageFile) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }
  try {
    console.log("Request Body:", req.body); // Logs text fields
    console.log("Uploaded File:", req.file); // Logs the uploaded file

    // Check if the company already exists
    const companyExists = await Company.findOne({ email });
    if (companyExists) {
      return res
        .status(400)
        .json({ success: false, message: "Company already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Upload the image to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(imageFile.path);

    // Create a new company document
    const newCompany = new Company({
      name,
      email,
      password: hashedPassword,
      image: cloudinaryResponse.secure_url, // Use the Cloudinary URL
      cloudinary_id: cloudinaryResponse.public_id, // Store Cloudinary's public ID
    });

    // Save the company to the database
    await newCompany.save();

    // Respond with success
    return res.json({
      success: true,
      company: {
        _id: newCompany._id,
        name: newCompany.name,
        email: newCompany.email,
        image: newCompany.image, // Include the Cloudinary URL
      },
      token: generateToken(newCompany._id),
    });
  } catch (error) {
    console.error("Error in registerCompany:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Company login function
const loginCompany = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    // Use the correct Company model (uppercase C)
    const company = await Company.findOne({ email });

    // If company is found and password matches
    if (await bcrypt.compare(password, company.password)) {
      return res.status(200).json({
        success: true,
        company: {
          _id: company._id,
          name: company.name,
          email: company.email,
          image: company.image,
        },
        token: generateToken(company._id),
      });
    } else {
      return res.json({ success: false, message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Error in loginCompany:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

//post a new jobs
const postJob = async (req, res) => {
  try {
    const { title, location, category, level, salary, description } = req.body;
    const companyId = req.Company._id; // Get companyId from the authenticated company

    if (!companyId) {
      return res
        .status(400)
        .json({ success: false, message: "Company ID is missing" });
    }

    // Create a new job instance and associate it with the company
    const newJob = new Job({
      title,
      location,
      category,
      level,
      salary,
      description,
      companyId, // Associate the job with the company
    });

    await newJob.save(); // Save the job to the database

    // Send success response
    res.status(200).json({
      success: true,
      message: "Job posted successfully",
      job: newJob,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

//get company data
const getCompanyData = async (req, res) => {
  try {
    const company = req.Company; // The company data attached by the authentication middleware
    res.json({ success: true, Company: company });
    console.log("Company Data:", company);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//get company job applicants

const getCompanyJobApplicants = async (req, res) => {};

// get company posted job

const getCompanyPostedJobs = async (req, res) => {
  try {
    const companyId = req.Company._id;
    console.log("Fetching jobs for company ID:", companyId);

    const jobs = await Job.find({ companyId });
    if (!jobs || jobs.length === 0) {
      console.log("No jobs found for the company");
      return res.status(404).json({ success: false, message: "No jobs found for the company" });
    }

    const jobData = await Promise.all(
      jobs.map(async (job) => {
        try {
          const applicants = await JobApplication.find({ jobId: job._id });
          return { ...job.toObject(), noOfApplicants: applicants.length };
        } catch (applicantError) {
          console.error("Error fetching applicants for job ID:", job._id, applicantError);
          return { ...job.toObject(), noOfApplicants: 0 };
        }
      })
    );

    res.json({ success: true, jobData });
  } catch (error) {
    console.error("Error fetching jobs for company:", error);
    res.status(500).json({ success: false, message: "Error fetching jobs: " + error.message });
  }
};



//change  job application status

const changeJobApplicationStatus = async (req, res) => {};

//change job visibility

const changeJobVisibility = async (req, res) => {
  try {
    const { id } = req.body;
    const companyId = req.Company._id;

    // Validate that `id` is provided and is a valid string
    if (!id || typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Job ID is required and must be a string",
      });
    }

    // Find the job by its `_id` field
    const job = await Job.findOne({ _id: id });

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    console.log("Company ID:", companyId);
    console.log("Job ID:", id);
    console.log("Job:", job);

    // Check if the job belongs to the logged-in company
    if (companyId.toString() !== job.companyId.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized to modify this job" });
    }

    // Toggle the job's visibility
    job.visible = !job.visible;
    await job.save();

    res.json({ success: true, job });
  } catch (error) {
    console.error("Error in changeJobVisibility:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  registerCompany,
  loginCompany,
  getCompanyData,
  postJob,
  getCompanyJobApplicants,
  getCompanyPostedJobs,
  changeJobApplicationStatus,
  changeJobVisibility,
};
