const express = require('express')
const router = express.Router()
const Faculty= require('../model/faculty')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const jwt_secret = require('../auth/jwtauth')

router.post('/login', async (req, res) => {
	// console.log(req.body)
	const { email, password } = req.body
	// console.log(email)
	const faculty = await Faculty.findOne({ email }).lean()
	if (!faculty) {
		return res.json({ status: 'error', error: 'Faculty Not Found' })
	}
	if(!faculty.isApproved)
	{
		return res.json({ status: 'error', error: 'Account not approved' })
	}
	if (await bcrypt.compare(password, faculty.password)) {

		const token = jwt.sign(
			{
				id: faculty._id,
				email: faculty.email
			},
			jwt_secret.fac_secret, {
				algorithm: jwt_secret.algorithm
				}
		)
		// console.log(token)
		res.cookie('token',token,{
			httpOnly: true
		});
		// return res.status(201).redirect('/facultydash');
		return res.json({ status: 'ok', data: faculty })
	}
	res.json({ status: 'error', error: 'Invalid username/password' })
})

router.post('/register', async (req, res) => {
	const { profId, profName, email, branch, phoneNumber, password: plainTextPassword } = req.body

	if (!profId || typeof profId !== 'string') {
		return res.json({ status: 'error', error: 'Invalid ProfId' })
	}
	if (!plainTextPassword || typeof plainTextPassword !== 'string') {
		return res.json({ status: 'error', error: 'Invalid password' })
	}
	if (plainTextPassword.length < 6) {
		return res.json({
			status: 'error',
			error: 'Minimum Password Length is 6'
		})
	}
	const password = await bcrypt.hash(plainTextPassword, 10)
	try {
		const response = await Faculty.create({
            profId, profName, email, branch, phoneNumber, password
		})
		console.log('Faculty created successfully: ', response)
	} catch (error) {
		if (error.code === 11000) {
			return res.json({ status: 'error', error: 'Account already in use' })
		}
		throw error
	}
	res.json({ status: 'ok' })
})

module.exports = router

async function verifyfac (req,res,next){
	var t = req.headers["cookie"]
	t=t.substr(6);
	// console.log(t)
	try{
		await jwt.verify(t, jwt_secret.fac_secret,jwt_secret.algorithm)
		// console.log('verified')
		return next();
	}
	catch(error){
		// console.log('token expired')
		console.log(error)
		res.json({ status: 'error', error: 'Error Occured' })
	}
	// console.log('verifyuserdone')
}