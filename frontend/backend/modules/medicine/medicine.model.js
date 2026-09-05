import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema(
    {
        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: true,
        },
        // Prescribing doctor. null when the patient adds the medicine themselves.
        doctorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor",
            default: null,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        dosage: {
            type: String, // e.g. "500mg"
            required: true,
            trim: true,
        },
        form: {
            type: String,
            enum: ["tablet", "capsule", "syrup", "injection", "drops", "other"],
            default: "tablet",
        },
        frequencyPerDay: {
            type: Number,
            required: true,
            min: 1,
        },
        instructions: {
            type: String,
            trim: true,
            default: "",
        },
        startDate: {
            type: Date,
            required: true,
            default: Date.now,
        },
        endDate: {
            type: Date,
            default: null,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

medicineSchema.index({ patientId: 1, isActive: 1 });
medicineSchema.index({ doctorId: 1, isActive: 1 });

const Medicine = mongoose.model("Medicine", medicineSchema);
export default Medicine;
