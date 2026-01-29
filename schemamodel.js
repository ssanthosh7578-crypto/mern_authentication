import mongoose from "mongoose";

const authen = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    verifyotp: {          // ✅ FIXED
        type: String,
        default: null
    },
    verifyotpExpire: {
        type: Date,
        default: null
    },
    isAccountVerified: {
        type: Boolean,
        default: false
    },
    resetotp: {
        type: String,
        default: null
    },
    resetotpExpire: {
        type: Date,
        default: null
    }
});

export const authenticationmodel = mongoose.model('authentication', authen);
