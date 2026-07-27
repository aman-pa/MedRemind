import Doctor from "./doctor.model.js";
import ApiError from "../../shared/utils/ApiError.js";

export const getMyProfileService = async (userId) => {
    const doctor = await Doctor.findOne({userId}).populate({
        path: "userId",
        select: "name email role",
    });

    if(!doctor){
        throw new ApiError(404, "Doctor not found");
    }
    return doctor;
};

export const updateProfileService = async (userId, updateData) => {
    const doctor = await Doctor.findOne({userId})
    if(!doctor){
        throw new ApiError(404, "Doctor not found");
    }
    const allowedFields = [
        "specialization",
        "qualification",
        "experience",
        "hospital",
        "department",
        "licenseNumber",
        "consultationFee",
        "address",
    ];

    for (const field of allowedFields) {
        if (field in updateData) {
            doctor[field] = updateData[field];
        }
    }

    doctor.profileCompleted = Boolean(doctor.specialization && doctor.qualification && doctor.hospital && doctor.department && doctor.licenseNumber );
    await doctor.save();

    return doctor.populate({
        path: "userId",
        select: "name email role",
    });
};