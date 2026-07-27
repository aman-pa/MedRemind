import api from "../lib/axios";

// ---------------------------------------------------------------------------
// Analytics Service
//
// Backend analytics endpoints do not exist yet (see Analytics_Backend_Context.md
// - "Current Backend Status: Not implemented"). Every function below returns
// placeholder data shaped exactly like the future API response so that once
// the real endpoints exist, only the bodies of these functions change -
// no component in components/analytics or pages/*/*, Analytics.jsx needs
// to be touched.
//
// Future endpoints (see Analytics_Backend_Context.md):
//   GET /api/analytics/patient
//   GET /api/analytics/doctor
//   GET /api/analytics/dashboard
// ---------------------------------------------------------------------------

const USE_MOCK = false; // flip to false once the backend ships

function delay(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---- Mock payloads ---------------------------------------------------------

const MOCK_PATIENT_ANALYTICS = {
  adherencePercentage: 82,
  medicinesTaken: 41,
  medicinesMissed: 6,
  medicinesSkipped: 3,
  currentStreak: 5,
  longestStreak: 14,
  lastDose: {
    medicineName: "Metformin 500mg",
    takenAt: "2026-07-18T08:05:00Z",
  },
  todayProgress: { taken: 2, total: 3 },
  weeklyProgress: [
    { label: "Mon", adherence: 100 },
    { label: "Tue", adherence: 100 },
    { label: "Wed", adherence: 66 },
    { label: "Thu", adherence: 100 },
    { label: "Fri", adherence: 33 },
    { label: "Sat", adherence: 100 },
    { label: "Sun", adherence: 66 },
  ],
  monthlyProgress: [
    { label: "Week 1", adherence: 90 },
    { label: "Week 2", adherence: 75 },
    { label: "Week 3", adherence: 85 },
    { label: "Week 4", adherence: 82 },
  ],
  recentActivity: [
    { id: "a1", medicineName: "Metformin 500mg", status: "taken", time: "2026-07-18T08:05:00Z" },
    { id: "a2", medicineName: "Atorvastatin 10mg", status: "taken", time: "2026-07-17T21:00:00Z" },
    { id: "a3", medicineName: "Vitamin D3", status: "missed", time: "2026-07-17T09:00:00Z" },
    { id: "a4", medicineName: "Metformin 500mg", status: "skipped", time: "2026-07-16T08:00:00Z" },
  ],
};

const MOCK_DOCTOR_ANALYTICS = {
  connectedPatients: 12,
  activePrescriptions: 28,
  activeMedicines: 34,
  averageAdherence: 76,
  patientsRequiringAttention: 3,
  complianceRate: 76,
  patientOverview: [
    { id: "p1", name: "Aarav Sharma", adherence: 92, activeMedicines: 3 },
    { id: "p2", name: "Meera Iyer", adherence: 58, activeMedicines: 2 },
    { id: "p3", name: "Rohan Gupta", adherence: 71, activeMedicines: 4 },
  ],
  recentlyMissedMedicines: [
    { patientName: "Meera Iyer", medicineName: "Losartan 50mg", missedAt: "2026-07-18T09:00:00Z" },
    { patientName: "Rohan Gupta", medicineName: "Insulin", missedAt: "2026-07-17T20:00:00Z" },
  ],
};

const MOCK_DASHBOARD_OVERVIEW = {
  patient: {
    todayProgress: MOCK_PATIENT_ANALYTICS.todayProgress,
    weeklyProgress: MOCK_PATIENT_ANALYTICS.weeklyProgress,
    currentStreak: MOCK_PATIENT_ANALYTICS.currentStreak,
  },
  doctor: {
    connectedPatients: MOCK_DOCTOR_ANALYTICS.connectedPatients,
    averageAdherence: MOCK_DOCTOR_ANALYTICS.averageAdherence,
    activePrescriptions: MOCK_DOCTOR_ANALYTICS.activePrescriptions,
    patientsRequiringAttention: MOCK_DOCTOR_ANALYTICS.patientsRequiringAttention,
  },
};

// ---- Public API -------------------------------------------------------------

// GET /api/analytics/patient -> full analytics for the logged-in patient
export async function getPatientAnalyticsRequest() {
  if (USE_MOCK) {
    await delay();
    return MOCK_PATIENT_ANALYTICS;
  }
  const response = await api.get("/analytics/patient");
  return response.data.data;
}

// GET /api/analytics/doctor -> full analytics for the logged-in doctor
export async function getDoctorAnalyticsRequest() {
  if (USE_MOCK) {
    await delay();
    return MOCK_DOCTOR_ANALYTICS;
  }
  const response = await api.get("/analytics/doctor");
  return response.data.data;
}

// GET /api/analytics/dashboard -> lightweight overview used by preview cards
export async function getDashboardOverviewRequest(role) {
  if (USE_MOCK) {
    await delay();
    return MOCK_DASHBOARD_OVERVIEW[role];
  }
  const response = await api.get("/analytics/dashboard");
  return response.data.data;
}
