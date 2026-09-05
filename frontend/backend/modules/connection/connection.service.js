import Connection from "./connection.model.js";
import User from "../user/user.model.js";
import Doctor from "../doctor/doctor.model.js";
import Patient from "../patient/patient.model.js";
import ApiError from "../../shared/utils/ApiError.js";
import { getProfile } from "../../shared/utils/getProfile.js";
import { verifyConnectionRecipient } from "../../shared/utils/verifyConnectionRecipient.js";


export const sendConnectionRequestService = async (user, email) => {
    const receivingUser = await User.findOne({email});
    if(!receivingUser){
        throw new ApiError(404,"User not found.");
    }
    if(user.role === receivingUser.role){
        throw new ApiError(400,"Users must have different roles to connect.");
    }

    const senderProfile = await getProfile(user.role, user.id);
    if (!senderProfile) {
        throw new ApiError(404, "Sender profile not found.");
    }

    const receiverProfile = await getProfile(receivingUser.role, receivingUser._id);
    if (!receiverProfile) {
        throw new ApiError(404, "Receiver profile not found.");
    }

    let doctorId;
    let patientId;

    if (user.role === 'doctor') {
        doctorId = senderProfile._id;
        patientId = receiverProfile._id;
    } else {
        patientId = senderProfile._id;
        doctorId = receiverProfile._id;
    }

    let connection = await Connection.findOne({doctorId, patientId});

    if(connection) {
        if (connection.status === "accepted") {
            throw new ApiError(409, "Connection already exists.");
        }

        if (connection.status === "pending") {
            throw new ApiError(409, "Connection request is already pending.");
        }

        if (connection.status === "rejected") {
            connection.status = "pending";
            connection.requestedBy = user.role;
            await connection.save();
        }
    }else{
        connection = await Connection.create({
            doctorId,
            patientId,
            status: "pending",
            requestedBy: user.role,
        });
    }
    return connection;
};

export const acceptConnectionRequestService = async (user, connectionId) => {
    const connection = await Connection.findById(connectionId);

    if (!connection) {
        throw new ApiError(404, "Connection not found.");
    }

    if (connection.status === "accepted") {
        throw new ApiError(409, "Connection has already been accepted.");
    }

    if (connection.status === "rejected") {
        throw new ApiError(409, "Connection has already been rejected.");
    }

    await verifyConnectionRecipient(connection, user);

    connection.status = "accepted";
    await connection.save();

    return connection;
};

export const rejectConnectionRequestService = async (user, connectionId) => {
    const connection = await Connection.findById(connectionId);
    
    if (!connection) {
        throw new ApiError(404, "Connection not found.");
    }
    
    if (connection.status === "accepted") {
        throw new ApiError(409, "Connection has already been accepted.");
    }
    
    if (connection.status === "rejected") {
        throw new ApiError(409, "Connection has already been rejected.");
    }
    
    await verifyConnectionRecipient(connection, user);
    
    connection.status = "rejected";
    await connection.save();
    
    return connection;
    
};

export const getPendingRequestsService = async (user) => {
    let profile = await getProfile(user.role, user.id);
    if(!profile){
        throw new ApiError(404, "Profile not found.");
    }

    const profileId = profile._id;
    const profileField = user.role === "doctor" ? "doctorId" : "patientId";
    const populateField = user.role === "doctor" ? "patientId" : "doctorId";
    const expectedRequester = user.role === "doctor" ? "patient" : "doctor";

    const connections = await Connection.find({
        [profileField]: profileId,
        status: "pending",
        requestedBy: expectedRequester,
    }).populate({
        path: populateField,
        populate: {
            path: "userId",
            select: "name",
        },
    });
    return connections;
};

export const getConnectionsService = async (user) => {
    let profile = await getProfile(user.role, user.id);
    if(!profile){
        throw new ApiError(404, "Profile not found.");
    }

    const profileId = profile._id;
    const profileField = user.role === "doctor" ? "doctorId" : "patientId";
    const populateField = user.role === "doctor" ? "patientId" : "doctorId";

    const connections = await Connection.find({
        [profileField]: profileId,
        status: "accepted",
    }).populate({
        path: populateField,
        populate: {
            path: "userId",
            select: "name",
        },
    });
    return connections;
};

export const disconnectConnectionService = async (connectionId, user) => {
    const connection = await Connection.findById(connectionId);
    if (!connection) {
        throw new ApiError(404, "Connection not found.");
    }

    const profile = await getProfile(user.role, user.id);
    if (!profile) {
        throw new ApiError(404, "Profile not found.");
    }

    const connectionProfileId =
        user.role === "doctor"
            ? connection.doctorId.toString()
            : connection.patientId.toString();

    if (connectionProfileId !== profile._id.toString()) {
        throw new ApiError(
            403,
            "You are not authorized to disconnect this connection."
        );
    }

    await connection.deleteOne();
};










