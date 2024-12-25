import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema(
  {
    professor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    timeSlots: [
      {
        startTime: {
          type: Date,
          required: true,
        },
        endTime: {
          type: Date,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);
export default mongoose.model("Availability", availabilitySchema);
