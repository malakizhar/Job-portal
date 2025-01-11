import express from "express";
import {
  registerCompany,
  loginCompany,
  getCompanyData,
  postJob,
  getCompanyJobApplicants,
  getCompanyPostedJobs,
  changeJobApplicationStatus,
  changeJobVisibility,
} from "../controllers/companyController.js";
import upload from "../config/multer.js";
const companyRouter = express.Router();
import  protectCompany  from "../middleware/AuthMiddleware.js";

//register routes

companyRouter.post("/register", upload.single("image"), registerCompany);

//company login
companyRouter.post("/login", loginCompany);

//get company jos
companyRouter.get("/company", protectCompany, getCompanyData);

//post jobs
companyRouter.post("/post-job", protectCompany, postJob);

//get company job applicants
companyRouter.get("/applicants", protectCompany, getCompanyJobApplicants);

//get company list jobs
companyRouter.get("/list-jobs", protectCompany, getCompanyPostedJobs);

//change job application status
companyRouter.post(
  "/change-status ",
  protectCompany,
  changeJobApplicationStatus
);

//change application visibility
companyRouter.post("/change-visibility", protectCompany, changeJobVisibility);

export default companyRouter;
