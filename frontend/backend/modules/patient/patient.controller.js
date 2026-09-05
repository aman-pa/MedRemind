import { getMyProfileService, updateProfileService } from "./patient.service.js"

export const getMyProfile = async (req, res, next) => {
    try {
        const patient = await getMyProfileService(req.user.id);
        return res.status(200).json({
            success: true,
            data: patient,
        });
    }catch(error){
        next(error);
    }
};

export const updateProfile = async (req, res, next) => {
    try{
        const patient = await updateProfileService(req.user.id, req.body);
        return res.status(200).json({
            success: true,
            data: patient,
        })
    }catch(error){
        next(error);
    }
};