import express from "express";
import multer from "multer";
import User from '../model/User.js'
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
dotenv.config();

const router = express.Router();
// const storage = multer.memoryStorage();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Storage configuration for user images
// const userStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "images/user-images");
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });
// const userUpload = multer({ storage: userStorage });


//Register User
router.post("/addUser", async (req, res) => {
  try {
    console.log("Req BODYYY:", req.body);

    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(409).json("User already exists. Please log in.");
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      mobile: req.body.mobile,
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET_TOKEN,
      { expiresIn: '7d' }
    );

    res.status(201).json({ message: "User Registered Successfully", token });
  } catch (error) {
    console.error("Error while adding user:", error);
    res.status(500).json("Error While Adding User");
  }
});

// Login User
router.post("/loginUser", async (req, res) => {
  const { username, password } = req.body;
  // console.log(req.body)

  try {
    // Check if admin credentials are used
    const isAdmin = username === process.env.ADMIN_USERNAME;
    
    const isAdminMatch = isAdmin ? await bcrypt.compare(password, process.env.ADMIN_PASSWORD) : false;

    // If admin credentials are correct, respond with 201
    if (isAdmin && isAdminMatch) {
      return res.status(200).json({ message: "Admin logged in successfully" });
    }
    const user = await User.findOne({
      $or: [{ email: username }, { mobile: username }],
    });

    // Check if user exists
    if (!user) {
      return res.status(404).send("User not found");
    }
    // console.log(user)

    

    // Check normal user password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).send("Invalid credentials");
    }

    // Generate JWT for normal user
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_TOKEN, {
      expiresIn: "7d",
    });

    return res.status(200).json({ message: "User Registered Successfully", token });
  } catch (error) {
    console.error(error); // Log any errors for debugging
    return res.status(500).send("Server error");
  }
});

// Update User
router.put("/updateUser/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, address, mobile, email, image, imageType } = req.body;
    // console.log(req.body.imageType)

    const user = await User.findById(id);
    if (!user) return res.status(404).json("User Not Found");

    // Set image upload directory
    const uploadDir = path.join(__dirname, '../images/user-images');

    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Handle image deletion
    if (image === 'default') {
      if (user.image && user.image !== 'default') {
        const oldImagePath = path.join(uploadDir, user.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
        user.image = 'default';
      }
    }

    // Save new image if provided and not "default"
    else if (image && imageType) {
      if (user.image && user.image !== 'default') {
        const oldImagePath = path.join(uploadDir, user.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      const ext = imageType.split('/')[1] || 'jpg';
      const buffer = Buffer.from(image, 'base64');
      const filename = `user-${id}.${ext}`;
      const filePath = path.join(uploadDir, filename);

      fs.writeFileSync(filePath, buffer);
      user.image = filename;
    }

    // Update other fields
    user.address = address !== undefined ? address : user.address;
user.mobile = mobile !== undefined ? mobile : user.mobile;
user.email = email !== undefined ? email : user.email;
user.name = firstName && lastName ? `${firstName} ${lastName}` : user.name;


    await user.save();
    res.status(200).json(user);
  } catch (error) {
    console.error("Error While Updating User:", error);
    res.status(500).json("Error While Updating User");
  }
});




// Fetch a specific user by their userId
router.get("/getUser/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    // console.log(userId); 
    const user = await User.findById(userId).select("-password"); // Fetch user from the database using the userId
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user); // Return user details as JSON
  } catch (error) {
    console.error("Error while fetching user:", error);
    res.status(500).json({ message: "Error while fetching user" });
  }
});


export default router;