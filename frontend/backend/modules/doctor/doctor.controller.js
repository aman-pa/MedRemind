import { getMyProfileService, updateProfileService } from "./doctor.service.js";

export const getMyProfile = async (req, res, next) => {
    try {
        const doctor = await getMyProfileService(req.user.id);
        return res.status(200).json({
            success: true,
            data: doctor,
        });
    }catch(error){
        next(error);
    }
};

export const updateProfile = async (req, res, next) => {
    try{
        const doctor = await updateProfileService(req.user.id, req.body);
        return res.status(200).json({
            success: true,
            data: doctor,
        })
    }catch(error){
        next(error);
    }
};