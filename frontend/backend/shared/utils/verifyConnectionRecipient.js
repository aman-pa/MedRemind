import Doctor from "../../modules/doctor/doctor.model.js";
import Patient from "../../modules/patient/patient.model.js";
import ApiError from "./ApiError.js";

export const verifyConnectionRecipient = async (connection, user) => {
    let receiverUserId;

    if (connection.requestedBy === "doctor") {
        // Doctor sent the request → Patient is the receiver
        const patient = await Patient.findById(connection.patientId);

        if (!patient) {
            throw new ApiError(404, "Patient profile not found.");
        }

        receiverUserId = patient.userId.toString();

    } else if (connection.requestedBy === "patient") {
        // Patient sent the request → Doctor is the receiver
        const doctor = await Doctor.findById(connection.doctorId);

        if (!doctor) {
            throw new ApiError(404, "Doctor profile not found.");
        }

        receiverUserId = doctor.userId.toString();

    } else {
        throw new ApiError(500, "Invalid connection request.");
    }

    if (receiverUserId !== user.id) {
        throw new ApiError(
            403,
            "Only the recipient can accept or reject this connection request."
        );
    }
};