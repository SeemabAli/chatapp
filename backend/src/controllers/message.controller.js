import User from "../models/user.model.js";
import Message from "../models/message.model.js"; // Ensure Message model is imported
import cloudinary from "../lib/cloudinary.js"; // Cloudinary for image uploads

// Get users for the sidebar (excluding the logged-in user)
export const getUsersForSidebar = async (req, res) => {
    try {
        // Get the logged-in user ID from the request object
        const loggedInUserId = req.user._id;

        // Find all users except the logged-in user and exclude their password field
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select('-password');

        // Respond with the filtered users
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error("Error in Sidebar Users", error.message);
        res.status(500).json({ error: "Server Error" });
    }
}

// Get messages between the logged-in user and another user
export const getMessages = async (req, res) => {
    try {
        // Extract the user ID to chat with from the request parameters
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        // Find messages between the logged-in user and the target user
        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId }, // Messages where the logged-in user is the sender
                { senderId: userToChatId, receiverId: myId }  // Messages where the logged-in user is the receiver
            ]
        });

        // Respond with the messages
        res.status(200).json(messages);
    } catch (error) {
        console.error("Error in Get Message", error.message);
        res.status(500).json({ error: "Server Error" });
    }
};

// Send a message to another user
export const sendMessage = async (req, res) => {
    try {
        // Destructure the text and image fields from the request body
        const { text, image } = req.body;
        const { id: receiverId } = req.params; // Extract receiver's ID from the request params
        const senderId = req.user._id; // Get the sender's ID from the request object

        let imageUrl; // Declare a variable for the image URL

        // If there's an image, upload it to Cloudinary
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url; // Get the secure URL of the uploaded image
        }

        // Create a new message document
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl, // Store the image URL if an image is uploaded
        });

        // Save the message to the database
        await newMessage.save();

        // Respond with the newly created message
        res.status(201).json(newMessage);

        // Future improvements could include integrating socket.io for real-time messaging
    } catch (error) {
        console.error("Error in Send Message", error.message);
        res.status(500).json({ error: "Server Error" });
    }
}
