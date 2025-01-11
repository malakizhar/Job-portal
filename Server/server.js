import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import UserRoutes from "./routes/UserRoutes.js";
import CompanyRoutes from "./routes/CompanyRoutes.js";
import { connectCloudinary } from "./config/cloudinary.js";
import JobRoutes from "./routes/JobRoutes.js";
import UsersRoutes from "./routes/UserRoutes.js";

// Initialize dotenv
dotenv.config();

// Initialize Express app
const app = express();

// Enable CORS
app.use(cors());

//connect to database
await connectDb();
await connectCloudinary();
//parse json request
app.use(express.json());

//Routes
app.get("/", (req, res) => res.send("Api is working"));
app.use("/api/users", UserRoutes); // Register user routes
app.use("/api/company", CompanyRoutes); // Register company routes
app.use("/api/jobs", JobRoutes); // Register job routes
app.use('/api/users',UserRoutes)
//port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
