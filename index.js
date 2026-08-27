import express from "express";
import dotenv from "dotenv";
import { appRouter } from "./src/app.router.js";
import { connectDB } from "./DB/connection.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/ping", (req, res) => {
  res.status(200).send("OK");
});

appRouter(app, express);

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  try {
    await connectDB();
  } catch (err) {
    console.error("Failed initial DB connection:", err.message);
  }
});

export default app;
