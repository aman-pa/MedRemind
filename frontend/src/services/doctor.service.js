import api from "../lib/axios";

// GET /api/doctor/me -> returns the logged-in doctor's profile
export async function getDoctorProfileRequest() {
  const response = await api.get("/doctor/me");
  return response.data.data;
}

// PATCH /api/doctor/me -> updates the logged-in doctor's profile
export async function updateDoctorProfileRequest(payload) {
  const response = await api.patch("/doctor/me", payload);
  return response.data.data;
}
