import mongoose, { Schema } from "mongoose";
const connectionSchema = mongoose.Schema(
  {
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },

    patientId: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },

    requestedBy: {
      type: String,
      enum: ["doctor", "patient"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

connectionSchema.index(
  { doctorId: 1, patientId: 1 },
  { unique: true }
);

const Connection = mongoose.model("Connection",connectionSchema);
export default Connection;