import api from "../lib/axios";

export const createMedicine = async (payload) => {
  const response = await api.post("/medicines", payload);
  return response.data;
};

export const getMedicines = async (patientId, activeOnly) => {
  const response = await api.get("/medicines", {
    params: { patientId, activeOnly },
  });
  return response.data;
};

export const getMedicineById = async (id) => {
  const response = await api.get(`/medicines/${id}`);
  return response.data;
};

export const updateMedicine = async (id, payload) => {
  const response = await api.patch(`/medicines/${id}`, payload);
  return response.data;
};

export const deleteMedicine = async (id) => {
  const response = await api.delete(`/medicines/${id}`);
  return response.data;
};
