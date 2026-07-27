import api from "../lib/axios";

export const createMedicationLog = async (payload) => {
  const response = await api.post("/medication-logs", payload);
  return response.data;
};

export const getMedicationLogs = async (from, to) => {
  const response = await api.get("/medication-logs", {
    params: { from, to },
  });
  return response.data;
};
