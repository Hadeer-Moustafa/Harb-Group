import mongoose from 'mongoose';

const weeklyVisitSchema = new mongoose.Schema(
  {
    visitorId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);
export const WeeklyVisit =   mongoose.model('WeeklyVisit', weeklyVisitSchema);