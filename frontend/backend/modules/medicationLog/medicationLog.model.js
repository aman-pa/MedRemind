import mongoose from "mongoose";

const medicationLogSchema = new mongoose.Schema(
    {
        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: true,
        },
        medicineId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Medicine",
            required: true,
        },
        reminderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Reminder",
            default: null,
        },
        // The dose's due date/time (the specific scheduled slot this log
        // record is for) - this is what streaks/adherence are computed against.
        scheduledFor: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ["taken", "missed", "skipped"],
            required: true,
        },
        // When the patient actually recorded/actioned it.
        actedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

medicationLogSchema.index({ patientId: 1, scheduledFor: -1 });
medicationLogSchema.index({ medicineId: 1, scheduledFor: -1 });

const MedicationLog = mongoose.model("MedicationLog", medicationLogSchema);
export default MedicationLog;
