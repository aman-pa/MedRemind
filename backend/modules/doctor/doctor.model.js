import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
    {
        street: {
            type: String,
            trim: true,
            default: "",
        },
        city: {
            type: String,
            trim: true,
            default: "",
        },
        state: {
            type: String,
            trim: true,
            default: "",
        },
        country: {
            type: String,
            trim: true,
            default: "",
        },
        pincode: {
            type: String,
            trim: true,
            default: "",
        },
    },
    {
        _id: false,
    }
);

const doctorSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },

        specialization: {
            type: String,
            trim: true,
            default: null,
        },

        qualification: {
            type: String,
            trim: true,
            default: null,
        },

        experience: {
            type: Number,
            min: 0,
            default: null,
        },

        hospital: {
            type: String,
            trim: true,
            default: null,
        },

        department: {
            type: String,
            trim: true,
            default: null,
        },

        licenseNumber: {
            type: String,
            trim: true,
            default: null,
        },

        consultationFee: {
            type: Number,
            min: 0,
            default: null,
        },

        address: {
            type: addressSchema,
            default: () => ({}),
        },

        profileCompleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const Doctor = mongoose.model("Doctor", doctorSchema);
export default Doctor;