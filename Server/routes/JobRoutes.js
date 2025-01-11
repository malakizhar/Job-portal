import express from "express";
import { getJobs, getJobById } from "../controllers/JobController.js";


const jobRouter = express.Router();

//route to get all jobs
jobRouter.get("/", getJobs);

//route to get single job
jobRouter.get("/:id", getJobById);


export default jobRouter;
