import jwt from 'jsonwebtoken';  // Import the JSON Web Token library
import User from '../models/user.model.js';  // Import the User model

// Middleware to protect routes by verifying the JWT
export const protectRoute = async (req, res, next) => {
    try {
        // Retrieve the JWT token from the cookies
        const token = req.cookies.jwt;

        // If no token is found, respond with an Unauthorized error
        if (!token) {
            return res.status(401).json({ error: "Unauthorized - No Token" });
        }

        // Verify the token using the JWT secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // If the token is invalid, respond with an Invalid Token error
        if (!decoded) {
            return res.status(401).json({ error: "Invalid Token" });
        }

        // Fetch the user from the database based on the userId in the decoded token
        const user = await User.findById(decoded.userId).select("-password");

        // If no user is found with the decoded userId, respond with User not found error
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Attach the user to the request object for use in subsequent middleware or route handlers
        req.user = user;

        // Call next() to pass control to the next middleware or route handler
        next();

    } catch (error) {
        // Log any errors and respond with a 401 Unauthorized error
        console.error(error);
        res.status(401).json({ error: "You must be logged in" });
    }
};
