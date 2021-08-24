const mongoose = require('mongoose')

const FacultySchema = new mongoose.Schema(
	{
		profId: {type: String, required: true, unique: true},
		profName: { type: String, required: true},
		email: {type: String, required: true},
		branch: { type: String, required: true},
		phoneNumber: {type: Number, required: true},
		password: { type: String, required: true },
		issueDate:{ type: Date, default: Date.now()},
		isApproved:{ type: Boolean, default: false}
	}
)

module.exports = mongoose.model('FacultySchema', FacultySchema)
