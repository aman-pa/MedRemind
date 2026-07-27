import api from "../lib/axios";

/**
 * Sends a connection request to a patient using their email address.
 * POST /connections/request
 */
export async function sendConnectionRequest(email) {
  const response = await api.post("/connections/request", { email });
  return response.data;
}

/**
 * Retrieves all pending connection requests received by the current user.
 * GET /connections/pending
 */
export async function getPendingRequests() {
  const response = await api.get("/connections/pending");
  return response.data;
}

/**
 * Accepts a pending connection request by its connection ID.
 * PATCH /connections/:id/accept
 */
export async function acceptRequest(id) {
  const response = await api.patch(`/connections/${id}/accept`);
  return response.data;
}

/**
 * Rejects a pending connection request by its connection ID.
 * PATCH /connections/:id/reject
 */
export async function rejectRequest(id) {
  const response = await api.patch(`/connections/${id}/reject`);
  return response.data;
}

/**
 * Retrieves all accepted/active connections for the current user.
 * GET /connections
 */
export async function getConnections() {
  const response = await api.get("/connections");
  return response.data;
}

/**
 * Disconnects an existing connection by its connection ID.
 * DELETE /connections/:id
 */
export async function disconnectConnection(id) {
  const response = await api.delete(`/connections/${id}`);
  return response.data;
}
