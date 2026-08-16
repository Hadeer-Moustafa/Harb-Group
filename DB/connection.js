import mongoose from "mongoose" ;
import {seedDefaultAdmin} from "../src/utils/seedAdmin.js";
import { seedCompanyInfo } from "../src/utils/seedCompanyInfo.js";

let isConnected = false;

export const connectDB = async () => {
 
  if (isConnected || mongoose.connection.readyState >= 1) {
    return;
  }

  try {
   
    const connect = await mongoose.connect(process.env.MONGO_URI);
    
    
    isConnected = connect.connections[0].readyState;
    console.log(`MongoDB Connected ...`);

    
    await seedDefaultAdmin();
    await seedCompanyInfo();

  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    throw error;
  }
};