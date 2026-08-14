import express from "express";
import dotenv from "dotenv";
import { appRouter } from "./src/app.router.js";
import { connectDB } from "./DB/connection.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database Connection Middleware Error:", error.message);
    res.status(500).json({
      message: "Failed to connect to the database",
      error: error.message,
    });
  }
});

appRouter(app, express);

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, async () => {
    console.log(`Server is running local on port ${PORT}`);
    try {
      await connectDB();
    } catch (err) {
      console.error("Failed initial DB connection:", err.message);
    }
  });
}

export default app;
