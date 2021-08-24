const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const response = new Schema({
    questionId: {type: String},
    anschosen: {type: String, default: 'undefined'},
});


const answertest = new Schema({
    testId: {type: String, required: true},
    branch: {
        type: String,
        required: true,
        enum: ['CSE','IT','ECE','EEE','MECH','BIOTECH']
    },
    name: {
        type: String,
        required: true
    },
    rollNumber: {
        type: String,
        required: true
    },
    // year: {
    //     type: String,
    //     required: true
    // },
    responses: [response],
    marks:{type: Number}
});

var Responses = mongoose.model('Responses', answertest);

module.exports = Responses;