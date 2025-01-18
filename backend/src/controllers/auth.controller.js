import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

// Signup function
export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        // Check if all required fields are provided
        if (!fullName || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Password validation: must be at least 8 characters long
        if (password.length < 8) {
            return res.status(400).json({ error: "Password must be at least 8 characters long" });
        }

        // Check if the email already exists in the database
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email is already taken" });
        }

        // Hash the password before saving to database
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // Create a new user instance and save it to the database
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        });

        await newUser.save();

        // Generate and send the token in the response
        generateToken(newUser._id, res);

        // Respond with success and user details
        res.status(201).json({
            message: "User created successfully",
            user: {
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
    }
};

// Login function
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid Credentials" });
        }

        // Check if the provided password matches the hashed password
        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        // Generate and send the token in the response
        generateToken(user._id, res);

        // Respond with success and user details
        res.status(200).json({
            message: "Login successful",
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                profilePic: user.profilePic
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
    }
};

// Logout function
export const logout = (req, res) => {
    try {
        // Clear the cookie containing the JWT token
        res.clearCookie("jwt", {
            httpOnly: true,   // Prevent client-side access to cookie
            sameSite: 'strict',   // Restrict cross-site request behavior
            secure: process.env.NODE_ENV !== 'development'  // Use secure cookie in production
        });

        // Respond with success message
        res.status(200).json({ message: "Logout successful" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
    }
};

// Update Profile function
export const updateProfile = async (req, res) => {
    try {
        // Extract the profile picture URL from the request body
        const { profilePic } = req.body;
        const userId = req.user._id;

        // Check if profile picture is provided
        if (!profilePic) {
            return res.status(400).json({ error: "Profile picture is required" });
        }

        // Upload the image to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(profilePic);

        // Update the user's profile picture in the database
        const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true });

        // Respond with the updated user object
        res.status(200).json({ updatedUser });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
    }
};

// Check Authentication function (to validate if the user is logged in)
export const checkAuth = (req, res) => {
    try {
        // Respond with the logged-in user's information
        res.status(200).json({ user: req.user });

    } catch (error) {
        console.error("Error in CheckAuth", error);
        res.status(500).json({ error: "Something went wrong" });
    }
};
