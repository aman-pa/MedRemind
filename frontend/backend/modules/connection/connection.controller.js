import { sendConnectionRequestService, acceptConnectionRequestService, rejectConnectionRequestService, getPendingRequestsService, getConnectionsService, disconnectConnectionService } from "./connection.service.js";

export const sendConnectionRequest = async (req, res, next) => {
    try{
        const connection = await sendConnectionRequestService(req.user, req.body.email);
        return res.status(201).json({
            success: true,
            message: "Connection request sent successfully.",
            data: connection,
        });
    }catch(error){
        next(error);
    }
};

export const acceptConnectionRequest = async (req, res, next) => {
    try{
        const connection = await acceptConnectionRequestService(req.user, req.params.id);
        return res.status(200).json({
            success: true,
            message: "Connection request accepted successfully.",
            data: connection,
        });
    }catch(error){
        next(error);
    }
};
export const rejectConnectionRequest = async (req, res, next) => {
    try{
        const connection = await rejectConnectionRequestService(req.user, req.params.id);
        return res.status(200).json({
            success: true,
            message: "Connection request rejected successfully.",
            data: connection,
        });
    }catch(error){
        next(error);
    }
};
export const getPendingRequests = async (req, res, next) => {
    try{
        const connection = await getPendingRequestsService(req.user);
        return res.status(200).json({
            success: true,
            message: "Pending requests send successfully.",
            data: connection,
        });
    }catch(error){
        next(error);
    }
};
export const getConnections = async (req, res, next) => {
    try{
        const connection = await getConnectionsService(req.user);
        return res.status(200).json({
            success: true,
            message: "Connections send successfully.",
            data: connection,
        });
    }catch(error){
        next(error);
    }
};
export const disconnectConnection = async (req, res, next) => {
    try{
        await disconnectConnectionService(req.params.id, req.user);
        return res.status(200).json({
            success: true,
            message: "Connection disconnected successfully.",
        });
    }catch(error){
        next(error);
    }
};
