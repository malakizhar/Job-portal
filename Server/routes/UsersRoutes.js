import express from "express";
import { getUsers, applyForJob, getUserApplications, updateUserResume } from "../controllers/UsersController";
import upload from "../config/multer";
const usersRouter = express.Router();

//get user data
usersRouter.get('/user',getUsers)   
//apply for jobs
usersRouter.post('/apply-job',applyForJob)
//get user applied jobs application
usersRouter.get('/applications',getUserApplications)
//update user profile(resume)
usersRouter.post('/update-resume',upload.single('resume'),updateUserResume)

export default usersRouter;