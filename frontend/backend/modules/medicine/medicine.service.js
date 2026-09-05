import Medicine from "./medicine.model.js";
import Connection from "../connection/connection.model.js";
import ApiError from "../../shared/utils/ApiError.js";
import { getProfile } from "../../shared/utils/getProfile.js";

// Doctors may only prescribe to patients they have an accepted connection with.
const assertDoctorConnectedToPatient = async (doctorId, patientId) => {
    const connection = await Connection.findOne({
        doctorId,
        patientId,
        status: "accepted",
    });
    if (!connection) {
        throw new ApiError(403, "You are not connected to this patient.");
    }
};

export const createMedicineService = async (user, payload) => {
    const requesterProfile = await getProfile(user.role, user.id);
    if (!requesterProfile) {
        throw new ApiError(404, "Profile not found.");
    }

    let patientId;
    let doctorId = null;

    if (user.role === "patient") {
        patientId = requesterProfile._id;
    } else {
        // doctor
        if (!payload.patientId) {
            throw new ApiError(400, "patientId is required when a doctor adds a medicine.");
        }
        doctorId = requesterProfile._id;
        patientId = payload.patientId;
        await assertDoctorConnectedToPatient(doctorId, patientId);
    }

    const medicine = await Medicine.create({
        patientId,
        doctorId,
        name: payload.name,
        dosage: payload.dosage,
        form: payload.form,
        frequencyPerDay: payload.frequencyPerDay,
        instructions: payload.instructions,
        startDate: payload.startDate,
        endDate: payload.endDate ?? null,
    });

    return medicine;
};

// Resolves the effective patientId + verifies the requester may see that
// patient's medicines (self, or connected doctor).
const resolveReadablePatientId = async (user, requestedPatientId) => {
    const requesterProfile = await getProfile(user.role, user.id);
    if (!requesterProfile) {
        throw new ApiError(404, "Profile not found.");
    }

    if (user.role === "patient") {
        return requesterProfile._id;
    }

    if (!requestedPatientId) {
        throw new ApiError(400, "patientId is required.");
    }
    await assertDoctorConnectedToPatient(requesterProfile._id, requestedPatientId);
    return requestedPatientId;
};

export const getMedicinesService = async (user, { patientId, activeOnly } = {}) => {
    const resolvedPatientId = await resolveReadablePatientId(user, patientId);

    const filter = { patientId: resolvedPatientId };
    if (activeOnly) filter.isActive = true;

    return Medicine.find(filter).sort({ createdAt: -1 });
};

const getOwnedMedicine = async (user, medicineId) => {
    const medicine = await Medicine.findById(medicineId);
    if (!medicine) {
        throw new ApiError(404, "Medicine not found.");
    }

    const requesterProfile = await getProfile(user.role, user.id);
    if (!requesterProfile) {
        throw new ApiError(404, "Profile not found.");
    }

    if (user.role === "patient") {
        if (medicine.patientId.toString() !== requesterProfile._id.toString()) {
            throw new ApiError(403, "You do not have access to this medicine.");
        }
    } else {
        await assertDoctorConnectedToPatient(requesterProfile._id, medicine.patientId);
    }

    return medicine;
};

export const getMedicineByIdService = async (user, medicineId) => {
    return getOwnedMedicine(user, medicineId);
};

export const updateMedicineService = async (user, medicineId, updateData) => {
    const medicine = await getOwnedMedicine(user, medicineId);

    const allowedFields = [
        "name",
        "dosage",
        "form",
        "frequencyPerDay",
        "instructions",
        "startDate",
        "endDate",
        "isActive",
    ];

    for (const field of allowedFields) {
        if (field in updateData) {
            medicine[field] = updateData[field];
        }
    }

    await medicine.save();
    return medicine;
};

// Soft delete: marks inactive instead of removing, so historical
// Medication Logs / Analytics referencing this medicine stay meaningful.
export const deleteMedicineService = async (user, medicineId) => {
    const medicine = await getOwnedMedicine(user, medicineId);
    medicine.isActive = false;
    await medicine.save();
    return medicine;
};

// Internal helper used by the Reminder + Analytics modules.
export const countActiveMedicinesForPatients = async (patientIds) => {
    return Medicine.countDocuments({ patientId: { $in: patientIds }, isActive: true });
};
