import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
      default: "Admin",
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true, // Create an index for faster queries
    },
    passwordHash: {
      type: String,
      required: true,
      minlength: 8, // Ensure the password hash is at least 12 characters long
      select: false, // Exclude the password hash from query results by default
    },
    phone: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      default: "Admin",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    refreshToken: {
      type: String,
      index: true,
    },
    passwordChangeAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

// 2. Define the AuthenticationLog schema to track login/logout actions
const authenticationLogSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AdminUser",
    required: true,
  },
  action: {
    type: String,
    enum: ["login", "logout"],
    required: true,
  },
  timestamp: { type: Date, default: Date.now },
  ipAddress: { type: String, required: true },
  userAgent: { type: String, required: true },
});

export const AdminUser = mongoose.model("AdminUser", adminSchema);
export const AuthenticationLog = mongoose.model(
  "AuthenticationLog",
  authenticationLogSchema,
);
