import api from "../lib/axios";

// GET /api/patient/me -> returns the logged-in patient's profile
export async function getMyProfileRequest() {
  const response = await api.get("/patient/me");
  return response.data.data;
}

// PATCH /api/patient/me -> updates the logged-in patient's profile
export async function updateMyProfileRequest(updatedFields) {
  const response = await api.patch("/patient/me", updatedFields);
  return response.data.data;
}