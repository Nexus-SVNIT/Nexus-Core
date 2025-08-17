const mongoose = require("mongoose");

const teamMembersSchema = new mongoose.Schema({
    admissionNumber: {
        type: String,
        required: true,
    },
    role:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    year:{
        type:String,
        required:true,
    },
    priority: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: false,
    },
    personalEmail: {
        type: String,
        required: false,
    }
});

const teamMembersModel = mongoose.model("teamMembers", teamMembersSchema);

module.exports = teamMembersModel;
