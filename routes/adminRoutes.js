const express = require('express')
const router = express.Router()
const Admin= require('../model/admin')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../model/user')
const jwt_secret = require('../auth/jwtauth')
const Faculty = require('../model/faculty')

router.post('/login', async (req, res) => {
	const { email, password } = req.body
	const admin = await Admin.findOne({ email }).lean()

	if (!admin) {
		return res.json({ status: 'error', error: 'Invalid email/password' })
	}
	if (await bcrypt.compare(password, admin.password)) {

		const token = jwt.sign(
			{
				id: admin._id,
				email: admin.email
			},
			jwt_secret.admin_secret, {
				algorithm: jwt_secret.algorithm,
				}
		)
		res.cookie('token',token,{
			httpOnly: true
		});
		// return res.status(201).redirect('/adminboard');
		return res.json({ status: 'ok', error: 'Login Successful' })
	}
	res.json({ status: 'error', error: 'Invalid username/password' })
})

router.post('/register', async (req, res) => {
	const { username, password: plainTextPassword } = req.body

	if (!username || typeof username !== 'string') {
		return res.json({ status: 'error', error: 'Invalid RollNumber' })
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
		const response = await Admin.create({
            username, password
		})
		console.log('Admin created successfully: ', response)
	} catch (error) {
		if (error.code === 11000) {
			return res.json({ status: 'error', error: 'Account already in use' })
		}
		throw error
	}
	res.json({ status: 'ok' })
})

router.get('/getusers',verifyadmin,(req,res)=>{
	try {
		User.find({})
		.then(users => {
			res.send(users);
		}).catch(err => {
			res.status(500).send({
				message: err.message || "Some error occurred while retrieving users."
			})
		})
		} catch (error) {
			console.log(error)
			res.json({ status: 'error', error: 'Error Occured' })
		}
})

router.get('/getfaculty',verifyadmin,(req,res)=>{
	try {
		Faculty.find({})
		.then(faculty => {
			res.send(faculty);
		}).catch(err => {
			res.status(500).send({
				message: err.message || "Some error occurred while retrieving faculty."
			})
		})
	} catch (error) {
		console.log(error)
		res.json({ status: 'error', error: 'Error Occured' })
	}
})

// router.put('/approvestudents',verifyadmin, async(req,res)=>{
// 	const {_id} = req.body

// 	try {
// 		const isApproved=true
// 		await User.updateOne(
// 			{ _id },
// 			{
// 				$set: { isApproved }
// 			}
// 		)
// 		res.json({ status: 'ok', message: 'Account Approved' })
// 	} catch (error) {
// 		console.log(error)
// 		res.json({ status: 'error', error: 'Error Occured' })
// 	}
// })
router.put('/approvestudents/:id',verifyadmin, (req,res,next)=>{
    User.find({_id: req.params.id, email: {$exists:true}})
        .then((resp) => {
            if(resp!=null){
                User.updateOne(
                    { _id: req.params.id },
                    {
                        "$set": {"isApproved" : true}
                    }
                )
                .then((resp) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(resp);
                },(err) => next(err))
                .catch((err) => next(err));

            }
                else{
                    err = new Error(req.body._id + ' not found');
                    err.statusCode = 404;
                    return next(err);
                }
        }, (err) => next(err))
        .catch((err) => next(err));
})

router.put('/approvefaculty/:id',verifyadmin, (req,res,next)=>{
    Faculty.find({_id: req.params.id, email: {$exists:true}})
        .then((resp) => {
            if(resp!=null){
                Faculty.updateOne(
                    { _id: req.params.id },
                    {
                        "$set": {"isApproved" : true}
                    }
                )
                .then((resp) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(resp);
                },(err) => next(err))
                .catch((err) => next(err));
            }
                else{
                    err = new Error(req.body._id + ' not found');
                    err.statusCode = 404;
                    return next(err);
                }
        }, (err) => next(err))
        .catch((err) => next(err));
})
// router.post('/approvefaculty', verifyadmin, async(req,res)=>{
// 	const { _id} = req.body

// 	try {
// 		const isApproved=true
// 		await Faculty.updateOne(
// 			{ _id },
// 			{
// 				$set: { isApproved }
// 			}
// 		)
// 		res.json({ status: 'ok', message: 'Account Approved' })
// 	} catch (error) {
// 		console.log(error)
// 		res.json({ status: 'error', error: 'Error Occured' })
// 	}
// })

router.delete('/deletefaculty', verifyadmin, async(req,res)=>{
	const{_id}=req.body
	Faculty.findByIdAndDelete(_id)
    .then(faculty => {
        if(!faculty) {
            return res.status(404).send({
                message: "Faculty not found with id"
            });
        }
        res.send({message: "Faculty Removed!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Faculty not found with id "
            }) }
		})
})

router.delete('/deletestudent', verifyadmin, async(req,res)=>{
	const{_id}=req.body

	User.findByIdAndDelete(_id)
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with id"
            });
        }
        res.send({message: "Student Removed!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "User not found with id "
            }) }
		})
	})	
	router.post('/adduser', verifyadmin, async (req, res) => {
		const { rollNumber, fullName, email, branch, phoneNumber, password: plainTextPassword } = req.body
	
		if (!rollNumber || typeof rollNumber !== 'string') {
			return res.json({ status: 'error', error: 'Invalid RollNumber' })
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
			const response = await User.create({
				rollNumber, fullName, email, branch, phoneNumber, password
			})
			console.log("register Working fine")
			console.log('User created successfully: ', response)
		} catch (error) {
			if (error.code === 11000) {
				return res.json({ status: 'error', error: 'Account already in use' })
			}
			throw error
		}
		// return res.status(201).redirect('/');
		return res.json({ status: 'ok' })
	})	

module.exports = router
async function verifyadmin (req,res,next){
	
	var token = req.headers["cookie"]
	token=token.substr(6);
	// console.log(token)
	try{
		await jwt.verify(token, jwt_secret.admin_secret,jwt_secret.algorithm)
		// console.log('verified')
		return next();
	}
	catch(error){
		console.log('token expired here')
		// console.log(error)
		res.json({ status: 'error', error: 'Error Occured' })
	}
	// console.log('verifyuserdone')
}