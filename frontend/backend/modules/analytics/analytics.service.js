import Medicine from "../medicine/medicine.model.js";
import Connection from "../connection/connection.model.js";
import ApiError from "../../shared/utils/ApiError.js";
import { getProfile } from "../../shared/utils/getProfile.js";
import { getActiveRemindersForPatient, countExpectedDosesToday } from "../reminder/reminder.service.js";
import {
    getStatusCounts,
    computeStreaks,
    getMostRecentTakenLog,
    getRecentActivity,
    getRecentlyMissedForPatients,
} from "../medicationLog/medicationLog.service.js";

const startOfDay = (date = new Date()) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
};

const daysAgo = (n) => {
    const d = startOfDay();
    d.setDate(d.getDate() - n);
    return d;
};

const adherencePercentage = (counts) => {
    const total = counts.taken + counts.missed + counts.skipped;
    if (total === 0) return 0;
    return Math.round((counts.taken / total) * 100);
};

// Builds a day-by-day (or week-by-week) adherence series between two dates.
// Used for weeklyProgress (7 days) and monthlyProgress (4 weeks).
const buildAdherenceSeries = async (patientId, buckets) => {
    // buckets: [{ label, from, to }]
    const series = [];
    for (const bucket of buckets) {
        const counts = await getStatusCounts(patientId, { from: bucket.from, to: bucket.to });
        series.push({ label: bucket.label, adherence: adherencePercentage(counts) });
    }
    return series;
};

const buildWeeklyBuckets = () => {
    const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const buckets = [];
    for (let i = 6; i >= 0; i--) {
        const from = daysAgo(i);
        const to = new Date(from);
        to.setHours(23, 59, 59, 999);
        buckets.push({ label: labels[from.getDay()], from, to });
    }
    return buckets;
};

const buildMonthlyBuckets = () => {
    const buckets = [];
    for (let i = 3; i >= 0; i--) {
        const to = daysAgo(i * 7);
        to.setHours(23, 59, 59, 999);
        const from = daysAgo(i * 7 + 6);
        buckets.push({ label: `Week ${4 - i}`, from, to });
    }
    return buckets;
};

// ---------------------------------------------------------------------------
// GET /api/analytics/patient
// ---------------------------------------------------------------------------
export const getPatientAnalyticsService = async (user) => {
    const patientProfile = await getProfile("patient", user.id);
    if (!patientProfile) {
        throw new ApiError(404, "Patient profile not found.");
    }
    const patientId = patientProfile._id;

    const overallCounts = await getStatusCounts(patientId);
    const { currentStreak, longestStreak } = await computeStreaks(patientId);
    const lastDoseLog = await getMostRecentTakenLog(patientId);

    const todayReminders = await getActiveRemindersForPatient(patientId);
    const expectedToday = countExpectedDosesToday(todayReminders);
    const todayCounts = await getStatusCounts(patientId, { from: startOfDay(), to: new Date() });

    const weeklyProgress = await buildAdherenceSeries(patientId, buildWeeklyBuckets());
    const monthlyProgress = await buildAdherenceSeries(patientId, buildMonthlyBuckets());

    const recentLogs = await getRecentActivity(patientId, 10);

    return {
        adherencePercentage: adherencePercentage(overallCounts),
        medicinesTaken: overallCounts.taken,
        medicinesMissed: overallCounts.missed,
        medicinesSkipped: overallCounts.skipped,
        currentStreak,
        longestStreak,
        lastDose: lastDoseLog
            ? { medicineName: lastDoseLog.medicineId?.name ?? "Medicine", takenAt: lastDoseLog.scheduledFor }
            : null,
        todayProgress: {
            taken: todayCounts.taken,
            total: Math.max(expectedToday, todayCounts.taken + todayCounts.missed + todayCounts.skipped),
        },
        weeklyProgress,
        monthlyProgress,
        recentActivity: recentLogs.map((log) => ({
            id: log._id,
            medicineName: log.medicineId?.name ?? "Medicine",
            status: log.status,
            time: log.scheduledFor,
        })),
    };
};

// ---------------------------------------------------------------------------
// GET /api/analytics/doctor
// ---------------------------------------------------------------------------
export const getDoctorAnalyticsService = async (user) => {
    const doctorProfile = await getProfile("doctor", user.id);
    if (!doctorProfile) {
        throw new ApiError(404, "Doctor profile not found.");
    }
    const doctorId = doctorProfile._id;

    const connections = await Connection.find({ doctorId, status: "accepted" }).populate({
        path: "patientId",
        populate: { path: "userId", select: "name" },
    });

    const connectedPatients = connections.length;
    const patientIds = connections.map((c) => c.patientId._id);

    const activePrescriptions = await Medicine.countDocuments({ doctorId, isActive: true });
    const activeMedicines = await Medicine.countDocuments({
        patientId: { $in: patientIds },
        isActive: true,
    });

    // Per-patient adherence (last 30 days), used for average + "needs attention".
    const patientOverview = [];
    for (const connection of connections) {
        const patient = connection.patientId;
        const counts = await getStatusCounts(patient._id, { from: daysAgo(30), to: new Date() });
        const activeMedicineCount = await Medicine.countDocuments({
            patientId: patient._id,
            isActive: true,
        });
        patientOverview.push({
            id: patient._id,
            name: patient.userId?.name ?? "Patient",
            adherence: adherencePercentage(counts),
            activeMedicines: activeMedicineCount,
        });
    }

    const averageAdherence =
        patientOverview.length === 0
            ? 0
            : Math.round(
                  patientOverview.reduce((sum, p) => sum + p.adherence, 0) / patientOverview.length
              );

    const ATTENTION_THRESHOLD = 60;
    const patientsRequiringAttention = patientOverview.filter((p) => p.adherence < ATTENTION_THRESHOLD).length;

    const recentlyMissedLogs = await getRecentlyMissedForPatients(patientIds, 10);

    return {
        connectedPatients,
        activePrescriptions,
        activeMedicines,
        averageAdherence,
        complianceRate: averageAdherence,
        patientsRequiringAttention,
        patientOverview,
        recentlyMissedMedicines: recentlyMissedLogs.map((log) => ({
            patientName: log.patientId?.userId?.name ?? "Patient",
            medicineName: log.medicineId?.name ?? "Medicine",
            missedAt: log.scheduledFor,
        })),
    };
};

// ---------------------------------------------------------------------------
// GET /api/analytics/dashboard - lightweight overview for preview cards
// ---------------------------------------------------------------------------
export const getDashboardOverviewService = async (user) => {
    if (user.role === "patient") {
        const full = await getPatientAnalyticsService(user);
        return {
            todayProgress: full.todayProgress,
            weeklyProgress: full.weeklyProgress,
            currentStreak: full.currentStreak,
        };
    }

    const full = await getDoctorAnalyticsService(user);
    return {
        connectedPatients: full.connectedPatients,
        averageAdherence: full.averageAdherence,
        activePrescriptions: full.activePrescriptions,
        patientsRequiringAttention: full.patientsRequiringAttention,
    };
};
