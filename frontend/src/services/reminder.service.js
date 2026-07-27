import api from "../lib/axios";

export const createReminder = async (payload) => {
  const response = await api.post("/reminders", payload);
  return response.data;
};

export const getRemindersForMedicine = async (medicineId) => {
  const response = await api.get(`/reminders/medicine/${medicineId}`);
  return response.data;
};

export const updateReminder = async (id, payload) => {
  const response = await api.patch(`/reminders/${id}`, payload);
  return response.data;
};

export const deleteReminder = async (id) => {
  const response = await api.delete(`/reminders/${id}`);
  return response.data;
};
