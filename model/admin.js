const mongoose = require('mongoose')

const AdminSchema = new mongoose.Schema(
	{
		username: {type: String, required: true},
		password: { type: String, required: true }
	},
	{ collection: 'Admin' }
)

module.exports = mongoose.model('AdminSchema', AdminSchema)
