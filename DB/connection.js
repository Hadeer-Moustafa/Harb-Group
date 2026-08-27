import mongoose from "mongoose";
import { seedDefaultAdmin } from "../src/utils/seedAdmin.js";
import { seedCompanyInfo } from "../src/utils/seedCompanyInfo.js";
import { seedHomepageSettings } from "../src/utils/seedHomePageSettings.js";

export const connectDB = async () => {
try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected ...`);

    await seedDefaultAdmin();
    await seedCompanyInfo();
    await seedHomepageSettings();
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    throw error;
  }
};
