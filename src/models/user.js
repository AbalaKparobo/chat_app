const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    _UserId: {
        type: mongoose.ObjectId
    },
    fullName: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    }
    }, {
        timestamps: true
    });

module.exports = mongoose.model("User", userSchema);