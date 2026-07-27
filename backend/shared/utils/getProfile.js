import Doctor from '../../modules/doctor/doctor.model.js';
import Patient from '../../modules/patient/patient.model.js';

export const getProfile = async (role, id) => {
  if (role === 'doctor') {
    return await Doctor.findOne({ userId: id });
  } else {
    return await Patient.findOne({ userId: id });
  }
};
