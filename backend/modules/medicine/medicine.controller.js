import {
    createMedicineService,
    getMedicinesService,
    getMedicineByIdService,
    updateMedicineService,
    deleteMedicineService,
} from "./medicine.service.js";

export const createMedicine = async (req, res, next) => {
    try {
        const medicine = await createMedicineService(req.user, req.body);
        return res.status(201).json({ success: true, data: medicine });
    } catch (error) {
        next(error);
    }
};

// GET /api/medicines?patientId=...&activeOnly=true
export const getMedicines = async (req, res, next) => {
    try {
        const { patientId, activeOnly } = req.query;
        const medicines = await getMedicinesService(req.user, {
            patientId,
            activeOnly: activeOnly === "true",
        });
        return res.status(200).json({ success: true, data: medicines });
    } catch (error) {
        next(error);
    }
};

export const getMedicineById = async (req, res, next) => {
    try {
        const medicine = await getMedicineByIdService(req.user, req.params.id);
        return res.status(200).json({ success: true, data: medicine });
    } catch (error) {
        next(error);
    }
};

export const updateMedicine = async (req, res, next) => {
    try {
        const medicine = await updateMedicineService(req.user, req.params.id, req.body);
        return res.status(200).json({ success: true, data: medicine });
    } catch (error) {
        next(error);
    }
};

export const deleteMedicine = async (req, res, next) => {
    try {
        const medicine = await deleteMedicineService(req.user, req.params.id);
        return res.status(200).json({ success: true, data: medicine });
    } catch (error) {
        next(error);
    }
};
