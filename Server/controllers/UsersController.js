import User from "../models/User.js"; // Ensure this path points to your User model
import JobApplication from "../models/JobApplication.js";
import Job from "../models/Job.js";
import { v2 as cloudinary } from "cloudinary";
const getUsers = async (req, res) => {
  try {
    // Extract user information set by middleware
    const userFromRequest = req.user;

    // Ensure user information exists
    if (!userFromRequest || !userFromRequest._id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Fetch the user details from your database
    const user = await User.findById(userFromRequest._id);

    // Check if the user exists
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Return the user data
    res.json({ success: true, user });
  } catch (error) {
    console.error("Error in getUsers:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//apply for jobs
const applyForJob = async (req, res) => {
  const { jobId } = req.body;

  const userId = req.user._id;
  try {
    const isAlreadyApplied = await JobApplication.findOne({ userId, jobId });

    if (isAlreadyApplied.length > 0) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    const jobData = await Job.findById(jobId);
    if (!jobData) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    await JobApplication.create({
      userId,
      companyId: jobData.companyId,
      jobId,
      date: new Date(),
    });
    res.json({ success: true, message: "Application submitted successfully" });
  } catch (error) {
    console.error("Error in applyForJob:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//get user applied jobs application
const getUserApplications = async (req, res) => {
  try {
    const userId = req.user._id;
    const applications = await JobApplication.find({ userId })
      .populate("companyId", "name email image")
      .populate("jobId", "title description location salary level category")
      .exec();
    if (!applications) {
      return res
        .status(404)
        .json({ success: false, message: "No job applications found" });
    }
    res.json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//update user profile

const updateUserResume = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const resume = req.resumeFile;

    const userData = await User.findById(userId);

    if (resumeFile) {
      const resumeUpload = await cloudinary.uploader.upload(resumeFile.path);
      userData.resume = resumeUpload.secure_url;
    }

    await userData.save();
    res.json({ success: true, message: "Resume uploaded successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { getUsers, applyForJob, getUserApplications, updateUserResume };
