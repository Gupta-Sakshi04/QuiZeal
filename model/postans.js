const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const options = new Schema({
  option: {
    type: String,
    required: true
  }
});

const questions = new Schema({
    question: {
        type: String,
        required: true
    },
    answers: [options],

    answer: {
      type: String,
      required: true
    }, 
    
    explanation:{
      type: String,
      default: ""
    }

}, {
    timestamps: true
});
const qSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },

    branch: {
      type: String,
      required: true,
      default: null,
      enum: ['CSE','IT','ECE','EEE','MECH','BIOTECH']
    },

    instructions: {
        type: String,
    },
    
    isEnabled: {
        type: Boolean,
        default: true
    },

    questions: [questions],

    duration :{
      hours : {
        type : Number,
        default: 0,
        min: 0,
        required: true
      },

      minutes : {
        type : Number,
        default: 0,
        min: 0,
        max: 59,
        required: true
      },

      seconds : {
        type : Number,
        default: 0,
        min: 0,
        max: 59,
        required: true
      }

    }
}, {
    timestamps: true
});

var Tests = mongoose.model('Test', qSchema);

module.exports = Tests;