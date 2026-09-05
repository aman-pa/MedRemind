import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema(
    {
        medicineId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Medicine",
            required: true,
        },
        // Denormalized for fast "today's reminders for patient X" queries.
        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: true,
        },
        // Times of day this medicine should be taken, 24h "HH:mm" format.
        times: {
            type: [String],
            required: true,
            validate: {
                validator: (arr) => arr.length > 0 && arr.every((t) => /^([01]\d|2[0-3]):[0-5]\d$/.test(t)),
                message: "times must be a non-empty array of HH:mm strings",
            },
        },
        // 0=Sunday ... 6=Saturday. Empty array = every day.
        daysOfWeek: {
            type: [Number],
            default: [],
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

reminderSchema.index({ patientId: 1, isActive: 1 });
reminderSchema.index({ medicineId: 1 });

const Reminder = mongoose.model("Reminder", reminderSchema);
export default Reminder;
