import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../Models/UserModels.js";


const registerUser = async (req, res) => {
  const {  email, password,confirmPassword } = req.body;
  if (!password || !email || !confirmPassword) {
    return res.status(400).json({ message: "All Files are required" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ message: "User already Exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    //crete new user
    const newUser = new User({
      email,
      password: hashedPassword,
    
    });

    await newUser.save();

    return res.json({ message: "User Created Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email });
    if(!user){
        return res.status(400).json({message:"User does not exist"});
    }



    const isMatch= await bcrypt.compare(password, user.password);

    if(!isMatch){
        return res.status(400).json({message:"Invalid Credentials"});
    }


   const token= jwt.sign({id:user._id}, process.env.JWT_SECRET,{
    expiresIn:"1h"
   });

 return res.status(200).json({message:"Login Successful", token});
  } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Something went wrong"});S
  }
};


export { registerUser, loginUser };