import {
    createReminderService,
    getRemindersForMedicineService,
    updateReminderService,
    deleteReminderService,
} from "./reminder.service.js";

export const createReminder = async (req, res, next) => {
    try {
        const reminder = await createReminderService(req.user, req.body);
        return res.status(201).json({ success: true, data: reminder });
    } catch (error) {
        next(error);
    }
};

// GET /api/reminders/medicine/:medicineId
export const getRemindersForMedicine = async (req, res, next) => {
    try {
        const reminders = await getRemindersForMedicineService(req.user, req.params.medicineId);
        return res.status(200).json({ success: true, data: reminders });
    } catch (error) {
        next(error);
    }
};

export const updateReminder = async (req, res, next) => {
    try {
        const reminder = await updateReminderService(req.user, req.params.id, req.body);
        return res.status(200).json({ success: true, data: reminder });
    } catch (error) {
        next(error);
    }
};

export const deleteReminder = async (req, res, next) => {
    try {
        const reminder = await deleteReminderService(req.user, req.params.id);
        return res.status(200).json({ success: true, data: reminder });
    } catch (error) {
        next(error);
    }
};
