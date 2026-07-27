import {
    getPatientAnalyticsService,
    getDoctorAnalyticsService,
    getDashboardOverviewService,
} from "./analytics.service.js";
import ApiError from "../../shared/utils/ApiError.js";

export const getPatientAnalytics = async (req, res, next) => {
    try {
        if (req.user.role !== "patient") {
            throw new ApiError(403, "Only patients can access patient analytics.");
        }
        const data = await getPatientAnalyticsService(req.user);
        return res.status(200).json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

export const getDoctorAnalytics = async (req, res, next) => {
    try {
        if (req.user.role !== "doctor") {
            throw new ApiError(403, "Only doctors can access doctor analytics.");
        }
        const data = await getDoctorAnalyticsService(req.user);
        return res.status(200).json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

export const getDashboardOverview = async (req, res, next) => {
    try {
        const data = await getDashboardOverviewService(req.user);
        return res.status(200).json({ success: true, data });
    } catch (error) {
        next(error);
    }
};
