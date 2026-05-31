import app from "./app";
import { env } from "./config/env";
import { connectDB } from "./config/db";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

connectDB(); // Connect to MongoDB

const startServer = async () => {
  try {
    const PORT = env.PORT;

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Fatal server startup error:", error);
    process.exit(1);
  }
};

startServer();
