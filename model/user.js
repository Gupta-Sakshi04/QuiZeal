const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
	{
		rollNumber: {type: String, required: true, unique: true},
		fullName: { type: String, required: true },
		email: {type: String, required: true,unique: true },
		branch: { type: String, required: true },
		phoneNumber: {type: Number, required: true,unique:true },
		password: { type: String, required: true },
		issueDate:{ type: Date, default: Date.now() },
		isApproved:{ type: Boolean, default: false },
		token: {type: String},
	}
)

module.exports = mongoose.model('UserSchema', UserSchema)
