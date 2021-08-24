const express = require('express');
const Responses = require("../model/answertest");
const ResRouter = express.Router();
const User= require('../model/user')
const jwt = require('jsonwebtoken')
const jwt_secret = require('../auth/jwtauth')
const StudentDB = require('../model/studentresponsedb');
ResRouter.use(express.json());

ResRouter.route('/')

// Display all the Responses
    .get(verifyfac,(req,res,next) => {
        Responses.find({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                // console.log(resp)
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
// Delete all the Responses
    .delete(verifyfac,(req,res,next) => {
        Responses.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

// Create a new Response
    .post(verifyuser,async (req,res,next) => {
        const user = await User.findById(req.body.stuid)
        await Responses.create(req.body)
        await StudentDB.findOneAndUpdate({stuid: req.body.stuid, testId: req.body.testId}, {
            $set: req.body
        }, { new: true })
        // await StudentDB.create(req.body)
        .then((resp) => {
            res.statusCode = 200;
            // res.setHeader('Content-Type','application/json');
            res.json(user)
            // res.render("StudentHome",{user})
        }, (err) => next(err))
        .catch((err) => next(err));
    });

ResRouter.route('/:testid')
// Get Responses Specific to a test
    .get(verifyfac,(req,res,next) => {
        console.log(req.params.testid)
        Responses.find({testId : req.params.testid})
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            console.log(resp)
            return res.json(resp);
        }, (err) => next(err))
        .catch((err) => next(err));
    })

// Delete all Responses corresponding to a test
    .delete(verifyfac,(req,res,next) => {
        Responses.remove({testId : req.params.testid})
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(resp);
        }, (err) => next(err))
        .catch((err) => next(err));
    });

    module.exports = ResRouter;

async function verifyfac (req,res,next){
    var t= req.headers["cookie"]
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

async function verifyuser (req,res,next){
	// const t = req.headers.token
    var t= req.headers["cookie"]
	t=t.substr(6);
	// console.log(t)
	try{
		await jwt.verify(t, jwt_secret.user_secret, jwt_secret.algorithm)
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
