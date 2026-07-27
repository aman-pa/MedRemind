import Patient from "./patient.model.js"
import ApiError from "../../shared/utils/ApiError.js";

export const getMyProfileService = async (userId) => {
    const patient = await Patient.findOne({userId}).populate({
        path: "userId",
        select: "name email role",
    });

    if(!patient){
        throw new ApiError(404, "Patient not found");
    }
    return patient;
};

export const updateProfileService = async (userId, updateData) => {
    const patient = await Patient.findOne({userId})
    if(!patient){
        throw new ApiError(404, "Patient not found");
    }
    const allowedFields = [
        "dateOfBirth",
        "gender",
        "bloodGroup",
        "height",
        "weight",
        "allergies",
        "chronicDiseases",
        "emergencyContacts",
        "address",
    ];

    for (const field of allowedFields) {
        if (field in updateData) {
            patient[field] = updateData[field];
        }
    }

    patient.profileCompleted = (patient.dateOfBirth && patient.gender && patient.bloodGroup && patient.height && patient.weight && patient.emergencyContacts.length > 0);
    await patient.save();

    return patient.populate({
        path: "userId",
        select: "name email role",
    });
};