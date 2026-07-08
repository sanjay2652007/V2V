const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    vehicleNumber: {
        type: String,
        required: true,
        unique: true
    },

    latitude: {
        type: Number
    },

    longitude: {
        type: Number
    },

    loginTime: {

        type: Date

    },

    logoutTime: {

        type: Date

    },

    status: {

        type: String

    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Vehicle", vehicleSchema);