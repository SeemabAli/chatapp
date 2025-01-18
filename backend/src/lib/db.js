import mongoose from 'mongoose';  // Import mongoose for MongoDB interaction

// Connect to MongoDB function
export const connectDB = async () => {
    try {
        // Establish connection with MongoDB using the URI from environment variables
        const conn = await mongoose.connect(process.env.MONGO_URI);

        // Log success message once connection is established
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        // Log error if the connection fails
        console.error(`Error: ${error.message}`);
    }
};
