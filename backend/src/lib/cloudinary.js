import { v2 as cloudinary } from 'cloudinary';  // Import cloudinary v2 SDK
import { config } from 'dotenv';  // Import dotenv for loading environment variables

// Load environment variables from .env file
config();

// Configure Cloudinary with environment variables for secure access
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,  // Cloudinary cloud name
    api_key: process.env.CLOUDINARY_API_KEY,        // API key for authentication
    api_secret: process.env.CLOUDINARY_API_SECRET   // API secret for authentication
});

// Export Cloudinary instance for use in other files
export default cloudinary;
