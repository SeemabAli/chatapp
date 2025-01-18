import express from 'express';
import authroutes from './routes/auth.route.js';
import dotenv from 'dotenv';
import { connect } from 'mongoose';
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';
import messageRoutes from './routes/message.route.js';


dotenv.config();
const app = express();

const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authroutes);
app.use("/api/messages", messageRoutes);

app.listen(PORT, () => {
  console.log('Server is running on port', PORT);
  connectDB();
});