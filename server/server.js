import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { connectDB } from "./src/config/db.js";
import {connectRedis} from "./src/config/redis.js"
import { startPendingBookingExpiryJob } from "./src/jobs/pending-booking-expiry.job.js";

const PORT=process.env.PORT || 3000;

const startServer = async () => {
 
  try{
    await connectDB();
    await connectRedis();
    startPendingBookingExpiryJob();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } 
  
  catch (error) {
    console.error("Server startup error:", error);
  }
  
}; 

startServer();
