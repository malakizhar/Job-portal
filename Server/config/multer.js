import multer from "multer";
import path from "path";
import fs from "fs";

// Get the current directory of the module using __dirname
const uploadDir = path.join(
  path.resolve(), // This will give you the absolute path of the current working directory
  'uploads'       // Append the 'uploads' folder to the current directory
);

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });  // Create the 'uploads' directory if it doesn't exist
  console.log(`Upload directory created at: ${uploadDir}`);
}

// Define storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("File being processed:", file); // Debug log to check the file
    cb(null, uploadDir);  // Save the file in the 'uploads' directory
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueSuffix);  // Give the file a unique name
  },
});

// Multer setup
const upload = multer({
  storage: storage,  // Use the defined storage settings
  limits: {
    fileSize: 5 * 1024 * 1024,  // 5MB size limit for uploads
  },
  fileFilter: function (req, file, cb) {
    const fileTypes = /jpeg|jpg|png/;  // Only allow jpeg, jpg, png files
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);  // Accept the file
    } else {
      cb(new Error("Only images (jpeg, jpg, png) are allowed!"));  // Reject other file types
    }
  },
});

export default upload;
