import mongoose from "mongoose";

const emergencyContactSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        relationship: {
            type: String,
            required: true,
            trim: true,
        },
        phone: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        _id: false,
    }
);

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

const patientSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        dateOfBirth: {
            type: Date,
            default: null,
        },
        gender: {
            type: String,
            enum: ["male", "female"],
            default: null,
        },
        bloodGroup: {
            type: String,
            enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
            default: null,
        },
        height: {
            type: Number, // in centimeters
            min: 0,
            default: null,
        },
        weight: {
            type: Number, // in kilograms
            min: 0,
            default: null,
        },
        allergies: {
            type: [String],
            default: [],
        },
        chronicDiseases: {
            type: [String],
            default: [],
        },
        emergencyContacts: {
            type: [emergencyContactSchema],
            default: [],
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

const Patient = mongoose.model("Patient", patientSchema);
export default Patient;