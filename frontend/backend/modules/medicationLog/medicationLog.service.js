import MedicationLog from "./medicationLog.model.js";
import Medicine from "../medicine/medicine.model.js";
import ApiError from "../../shared/utils/ApiError.js";
import { getProfile } from "../../shared/utils/getProfile.js";
import { createNotificationService } from "../notification/notification.service.js";

// Only the patient themselves records dose activity (taken/missed/skipped) -
// this mirrors real medication-adherence apps where the patient (or their
// device) is the source of truth for whether a dose happened.
export const createMedicationLogService = async (user, payload) => {
    if (user.role !== "patient") {
        throw new ApiError(403, "Only patients can log medication activity.");
    }

    const patientProfile = await getProfile("patient", user.id);
    if (!patientProfile) {
        throw new ApiError(404, "Patient profile not found.");
    }

    const medicine = await Medicine.findById(payload.medicineId);
    if (!medicine) {
        throw new ApiError(404, "Medicine not found.");
    }
    if (medicine.patientId.toString() !== patientProfile._id.toString()) {
        throw new ApiError(403, "You do not have access to this medicine.");
    }

    const log = await MedicationLog.create({
        patientId: patientProfile._id,
        medicineId: medicine._id,
        reminderId: payload.reminderId ?? null,
        scheduledFor: payload.scheduledFor,
        status: payload.status,
    });

    if (payload.status === "missed") {
        // Best-effort: a missed dose triggers an in-app notification for the
        // patient. Does not block the log from being created if it fails.
        try {
            await createNotificationService({
                userId: user.id,
                type: "dose_missed",
                title: "Missed dose",
                message: `You missed a dose of ${medicine.name}.`,
                relatedMedicineId: medicine._id,
            });
        } catch (_err) {
            // notification failures should never break logging
        }
    }

    return log;
};

export const getLogsForPatientService = async (user, { from, to } = {}) => {
    const patientProfile = await getProfile("patient", user.id);
    if (!patientProfile) {
        throw new ApiError(404, "Patient profile not found.");
    }

    const filter = { patientId: patientProfile._id };
    if (from || to) {
        filter.scheduledFor = {};
        if (from) filter.scheduledFor.$gte = new Date(from);
        if (to) filter.scheduledFor.$lte = new Date(to);
    }

    return MedicationLog.find(filter).sort({ scheduledFor: -1 }).populate("medicineId", "name");
};

// ---------------------------------------------------------------------------
// Internal helpers reused by the Analytics module. Not exposed as routes.
// ---------------------------------------------------------------------------

// Raw taken/missed/skipped counts for a patient within an optional window.
export const getStatusCounts = async (patientId, { from, to } = {}) => {
    const match = { patientId };
    if (from || to) {
        match.scheduledFor = {};
        if (from) match.scheduledFor.$gte = from;
        if (to) match.scheduledFor.$lte = to;
    }

    const results = await MedicationLog.aggregate([
        { $match: match },
        { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const counts = { taken: 0, missed: 0, skipped: 0 };
    for (const r of results) counts[r._id] = r.count;
    return counts;
};

// Groups logs by calendar day (YYYY-MM-DD) and marks a day "successful" if
// it has at least one log and zero missed logs that day.
const getDailySuccessMap = async (patientId, sinceDate) => {
    const logs = await MedicationLog.find({
        patientId,
        scheduledFor: { $gte: sinceDate },
    }).select("scheduledFor status");

    const byDay = new Map();
    for (const log of logs) {
        const dayKey = log.scheduledFor.toISOString().slice(0, 10);
        if (!byDay.has(dayKey)) byDay.set(dayKey, { hasMissed: false, hasAny: false });
        const entry = byDay.get(dayKey);
        entry.hasAny = true;
        if (log.status === "missed") entry.hasMissed = true;
    }

    const successByDay = new Map();
    for (const [day, entry] of byDay.entries()) {
        successByDay.set(day, entry.hasAny && !entry.hasMissed);
    }
    return successByDay;
};

// Computes current + longest adherence streaks (in days) for a patient,
// looking back up to `lookbackDays` days.
export const computeStreaks = async (patientId, lookbackDays = 90) => {
    const since = new Date();
    since.setDate(since.getDate() - lookbackDays);

    const successByDay = await getDailySuccessMap(patientId, since);

    const dayKeyForOffset = (offsetDays) => {
        const d = new Date();
        d.setDate(d.getDate() - offsetDays);
        return d.toISOString().slice(0, 10);
    };

    // Current streak: walk backwards from today. If today has no logs yet
    // (the day is still in progress), don't let that break the streak -
    // start counting from yesterday instead.
    let currentStreak = 0;
    const startOffset = successByDay.has(dayKeyForOffset(0)) ? 0 : 1;
    for (let i = startOffset; i < lookbackDays; i++) {
        if (successByDay.get(dayKeyForOffset(i))) {
            currentStreak += 1;
        } else {
            break;
        }
    }

    // Longest streak: scan the whole window chronologically.
    let longestStreak = 0;
    let running = 0;
    for (let i = lookbackDays - 1; i >= 0; i--) {
        if (successByDay.get(dayKeyForOffset(i))) {
            running += 1;
            longestStreak = Math.max(longestStreak, running);
        } else {
            running = 0;
        }
    }

    return { currentStreak, longestStreak };
};

export const getMostRecentTakenLog = async (patientId) => {
    return MedicationLog.findOne({ patientId, status: "taken" })
        .sort({ scheduledFor: -1 })
        .populate("medicineId", "name");
};

export const getRecentActivity = async (patientId, limit = 10) => {
    return MedicationLog.find({ patientId })
        .sort({ scheduledFor: -1 })
        .limit(limit)
        .populate("medicineId", "name");
};

export const getRecentlyMissedForPatients = async (patientIds, limit = 10) => {
    return MedicationLog.find({ patientId: { $in: patientIds }, status: "missed" })
        .sort({ scheduledFor: -1 })
        .limit(limit)
        .populate("medicineId", "name")
        .populate({ path: "patientId", populate: { path: "userId", select: "name" } });
};
