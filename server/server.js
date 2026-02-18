import app from "./app.js"
import { connectDB } from "./src/config/db.js";
import {connectRedis} from "./src/config/redis.js"
const PORT=process.env.PORT || 3000;

// app.listen(PORT,()=>{
//     console.log(`Server listening on the port ${PORT}`);
// })

const startServer = async () => {
  try {
    await connectDB();
    await connectRedis();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup error:", error);
  }
};
startServer();
