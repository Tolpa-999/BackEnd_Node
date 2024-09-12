const mongoose = require("mongoose")
const validator = require("validator")
const userRules = require("../utils/userRules")
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        validate: [validator.isEmail, "filled must be a valid email adders "]
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String
    },
    role: {
        type: String,
        enum: [userRules.USER, userRules.ADMIN, userRules.MANAGER],
        default: userRules.USER
    },
    // avatar: {
    //     type: String,
    //     default: 'uploads/avatar.png'
    // }


})



module.exports = mongoose.model("User", userSchema)