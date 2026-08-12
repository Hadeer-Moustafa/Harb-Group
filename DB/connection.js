import mongoose from "mongoose" ;
import {seedDefaultAdmin} from "../src/utils/seedAdmin.js";

export const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI);
    await seedDefaultAdmin();

    console.log(` MongoDB Connected ...`);
  } catch (error) {
    console.error(` MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

