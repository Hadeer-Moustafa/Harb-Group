import bcrypt from "bcryptjs";
import { AdminUser } from "../../DB/models/admin/admin.model.js";
import { catchError } from "./catchError.js";

export const seedDefaultAdmin = async () => {
  try {
    //check if there are any admin users in the database
    const adminCount = await AdminUser.countDocuments();

    if (adminCount === 0) {
      const saltRounds = parseInt(process.env.SALTROUNDS) || 12;
      const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || "admin123";
      const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);

      await AdminUser.create({
        name: "Admin User",
        email: process.env.DEFAULT_ADMIN_EMAIL || "admin@example.com",
        passwordHash: hashedPassword,
        role: "Admin",
        isActive: true,
      });

      console.log(" Default Admin Account Seeded Successfully!");
    }
  } catch (error) {
    console.error("Error seeding default admin:", error);
  }
};
