import express from "express";
import dotenv from "dotenv";
import { appRouter } from "./app.router.js";
import { connectDB } from "./DB/connection.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT;

appRouter(app, express);
await connectDB();
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
