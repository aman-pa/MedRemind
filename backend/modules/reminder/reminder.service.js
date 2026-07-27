import Reminder from "./reminder.model.js";
import Medicine from "../medicine/medicine.model.js";
import Connection from "../connection/connection.model.js";
import ApiError from "../../shared/utils/ApiError.js";
import { getProfile } from "../../shared/utils/getProfile.js";

const assertAccessToMedicine = async (user, medicine) => {
    const requesterProfile = await getProfile(user.role, user.id);
    if (!requesterProfile) {
        throw new ApiError(404, "Profile not found.");
    }

    if (user.role === "patient") {
        if (medicine.patientId.toString() !== requesterProfile._id.toString()) {
            throw new ApiError(403, "You do not have access to this medicine.");
        }
    } else {
        const connection = await Connection.findOne({
            doctorId: requesterProfile._id,
            patientId: medicine.patientId,
            status: "accepted",
        });
        if (!connection) {
            throw new ApiError(403, "You are not connected to this patient.");
        }
    }
};

export const createReminderService = async (user, payload) => {
    const medicine = await Medicine.findById(payload.medicineId);
    if (!medicine) {
        throw new ApiError(404, "Medicine not found.");
    }
    await assertAccessToMedicine(user, medicine);

    const reminder = await Reminder.create({
        medicineId: medicine._id,
        patientId: medicine.patientId,
        times: payload.times,
        daysOfWeek: payload.daysOfWeek ?? [],
    });

    return reminder;
};

export const getRemindersForMedicineService = async (user, medicineId) => {
    const medicine = await Medicine.findById(medicineId);
    if (!medicine) {
        throw new ApiError(404, "Medicine not found.");
    }
    await assertAccessToMedicine(user, medicine);

    return Reminder.find({ medicineId, isActive: true }).sort({ createdAt: -1 });
};

const getOwnedReminder = async (user, reminderId) => {
    const reminder = await Reminder.findById(reminderId);
    if (!reminder) {
        throw new ApiError(404, "Reminder not found.");
    }
    const medicine = await Medicine.findById(reminder.medicineId);
    if (!medicine) {
        throw new ApiError(404, "Associated medicine not found.");
    }
    await assertAccessToMedicine(user, medicine);
    return reminder;
};

export const updateReminderService = async (user, reminderId, updateData) => {
    const reminder = await getOwnedReminder(user, reminderId);

    const allowedFields = ["times", "daysOfWeek", "isActive"];
    for (const field of allowedFields) {
        if (field in updateData) {
            reminder[field] = updateData[field];
        }
    }

    await reminder.save();
    return reminder;
};

export const deleteReminderService = async (user, reminderId) => {
    const reminder = await getOwnedReminder(user, reminderId);
    reminder.isActive = false;
    await reminder.save();
    return reminder;
};

// Internal helper (used by Analytics/MedicationLog) - active reminders
// belonging to a patient, used to compute "today's expected doses".
export const getActiveRemindersForPatient = async (patientId) => {
    return Reminder.find({ patientId, isActive: true });
};

// Given a reminder's daysOfWeek + times, count how many dose slots are
// expected today (empty daysOfWeek = every day).
export const countExpectedDosesToday = (reminders, referenceDate = new Date()) => {
    const today = referenceDate.getDay();
    return reminders.reduce((total, reminder) => {
        const appliesToday = reminder.daysOfWeek.length === 0 || reminder.daysOfWeek.includes(today);
        return appliesToday ? total + reminder.times.length : total;
    }, 0);
};
