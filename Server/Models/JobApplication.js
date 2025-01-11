import mongoose from "mongoose";

const JobApplicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  CompanyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  status: {
    type: String,
    default: "pending",
  },
  date: {
    type: Date,
    required: true,
  },
});

const JobApplication = mongoose.model("JobApplication", JobApplicationSchema);

export default JobApplication;
