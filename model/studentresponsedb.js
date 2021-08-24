const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Sresp = new Schema({
    stuid : {type: String, required: true},
    rollNumber : {type: String, required: true},
    marks: {type: String, default: null},
    testId: {type: String, required: true},
    name: {type: String, required: true},
    branch: {type: String, required: true, enum: ['CSE','IT','ECE','EEE','MECH','BIOTECH']},
    isdisabled: {type: Boolean, default: false}
});


var StudentDB = mongoose.model('sturespdb', Sresp);

module.exports = StudentDB;