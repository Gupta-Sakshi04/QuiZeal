const express = require('express')
const router = express.Router()
const User= require('../model/user')
const Tests = require('../model/postans');
const StudentDB = require('../model/studentresponsedb');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const jwt_secret = require('../auth/jwtauth');
const { render } = require('ejs');

router.post('/login', async (req, res) => {
	const { email, password } = req.body
	const user = await User.findOne({ email }).lean()
	var u = {
		"status": "Invalid Creds"
	}
	if (!user) {
		// alert("User Doesn't Exist. Please Consider Signing Up")
		return res.render("login",{u})
		// res.json({ status: 'error', error: 'Invalid username/password' })
	}
	if (await bcrypt.compare(password, user.password)) {
		if(user.isApproved===true)
		{
			const token = jwt.sign(
				{
					id: user._id,
					email: user.email
				},
				jwt_secret.user_secret, {
					algorithm: jwt_secret.algorithm
					}
			)
			
			res.cookie('token',token,{
				httpOnly: true
			});
			await User.findOneAndUpdate({email}, {
				$set: {token: token}
			}, { new: true })
			return res.status(201).render("StudentHome",{user});
			// return res.json({ status: 'ok', data: token })
		}
		else
		{
			return res.status(400).redirect('/waitForApproval.html')
		} 
		
	}
	res.render("login",{u})
	// res.json({ status: 'error', error: 'Invalid username/password' })
})

router.post('/register', async (req, res) => {
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
		// alert("Response is Registered. Please Wait Until you are Approved")
		res.redirect('/waitForApproval.html')
	} catch (error) {
		if (error.code === 11000) {
			var u = {
				"status" : "Already in Use"
			}
			return res.render("login",{u})
			// return res.json({ status: 'error', error: 'Account already in use' })
		}
		throw error
	}
	return res.status(201).redirect('/waitForApproval.html');
	// res.json({ status: 'ok' })
})

router.route('/tests/:branch/:id')
	//  api/list_of_tests
    .get(verifyuser,async (req, res, next) => {
        var userData = await Tests.find({isEnabled : true,branch: req.params.branch})
		var user = await User.findById(req.params.id)
		var stur = []
		stur = await fetchingData(req.params.id,userData);
		if(!userData) throw new Error('No records Found');
        res.render('tests',{userData,user,stur})
    })
router.route('/tests/:id')
	//  api/list_of_tests
    .get(verifyuser,async (req, res, next) => {
		var user = await StudentDB.find({stuid: req.params.id})
		if(!user) throw new Error('No records Found');
        res.render('marksdetails',{user})
    })
router.route('/:testId/:userId')
// api/display_a_specific_test
    .get(verifyuser,async (req, res, next) => {
        var userData = await Tests.findById(req.params.testId)
		var user = await User.findById(req.params.userId)
		var stures = {
			"stuid" : req.params.userId,
			"testId" : req.params.testId,
			"rollNumber" : user.rollNumber,
			"branch" : user.branch,
			"name" : userData.name,
			"isdisabled": true,
		}
		var tally = await getNewField(userData.questions)
		await StudentDB.create(stures)
		if(!userData) throw new Error('No records Found');
        res.render('quizform',{userData,user,stures,tally})
            // .then((test) => {
            //     res.statusCode = 200;
            //     res.setHeader('Content-Type', 'application/json');
            //     res.json(test);
            // }, (err) => next(err))
            // .catch((err) => next(err));
    })
router.route('/:testId/questions')
// api/display_all_ques_of_a_test
    .get(verifyuser,(req, res, next) => {
        Tests.findById(req.params.testId)
            .then((test) => {
                if (test != null) {
                    if(test.questions != null) {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(test.questions);}
                    else{
                        err = new Error('test ' + req.params.testId + ' has no Questions');
                        err.statusCode = 404;
                        return next(err);
                    }
                }
                else {
                    err = new Error('test ' + req.params.testId + ' not found');
                    err.statusCode = 404;
                    return next(err);
                }
            }, (err) => next(err)).catch((err) => next(err));
    })
// router.get('/api',(req,res)=>{
// 	res.send('Hii there')
// })
module.exports = router

async function verifyuser (req,res,next){
	// const t = req.headers.token
	var t= req.headers["cookie"]
	t=t.substr(6);
	try{
		await jwt.verify(t, jwt_secret.user_secret,jwt_secret.algorithm)
		return next();
	}
	catch(error){
		res.json({ status: 'error', error: 'Error Occured' })
	}
}
async function fetchingData(stuid,userData)
{
	stures = []
	for(const data of userData){
		var temp = await StudentDB.find({stuid: stuid, testId: data.id})
		if(temp.length==0)
		{
			var t = {
				"testid": false
			}
			stures.push(t)
		}
		else
		{
			var t = {
				"testid": true
			}
			stures.push(t)
		}
	}
	return stures;
}
function getNewField(arr)
{
	ty = {}
	let gh = 0;
	for(const d of arr)
	{
		ty[d.id] = d.answer
	}
	return ty;
}