import api from "../lib/axios";

export async function registerRequest(payload) {
  const response = await api.post("/auth/register", payload);
  return response.data;
}

export async function loginRequest(credentials) {
  const response = await api.post("/auth/login", credentials);
  return response.data;
}

export async function googleLoginRequest(payload) {
  const response = await api.post("/auth/google", payload);
  return response.data;
}

export async function logoutRequest() {
  const response = await api.post("/auth/logout");
  return response.data;
}

export async function getCurrentUserRequest() {
  const response = await api.get("/auth/me");
  return response.data.data.user;
}

export async function verifyEmailRequest(token) {
  const response = await api.post("/auth/verify-email", { token });
  return response.data;
}

export async function forgotPasswordRequest(email) {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
}

export async function resetPasswordRequest({ token, password }) {
  const response = await api.post("/auth/reset-password", { token, password });
  return response.data;
}