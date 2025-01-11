import {v2 as cloudinary} from 'cloudinary';
import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();
const connectCloudinary = () => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_SECRET
    });
}

export {connectCloudinary}