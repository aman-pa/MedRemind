import { createMedicationLogService, getLogsForPatientService } from "./medicationLog.service.js";

export const createMedicationLog = async (req, res, next) => {
    try {
        const log = await createMedicationLogService(req.user, req.body);
        return res.status(201).json({ success: true, data: log });
    } catch (error) {
        next(error);
    }
};

// GET /api/medication-logs?from=...&to=...
export const getMedicationLogs = async (req, res, next) => {
    try {
        const { from, to } = req.query;
        const logs = await getLogsForPatientService(req.user, { from, to });
        return res.status(200).json({ success: true, data: logs });
    } catch (error) {
        next(error);
    }
};
