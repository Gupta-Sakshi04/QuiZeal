const express = require('express');
const Tests = require('../model/postans');
const jwt = require('jsonwebtoken')
const jwt_secret = require('../auth/jwtauth')
const TestRouter = express.Router();
TestRouter.use(express.json());

// localhost:8081/test/
TestRouter.route('/list')
//  api/list_of_tests
    .get((req, res, next) => {
        Tests.find()
            .then((tests) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(tests);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
// api/creating a new Test
    .post((req, res, next) => {
        Tests.create(req.body)
            .then((test) => {
                console.log('Test Created: ', test);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(test);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
// api/Deleting all the Existing Tests
    .delete(verifyfac,(req, res, next) => {
        Tests.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

// localhost:8081/test/:testId
TestRouter.route('/list/:testId')
// api/display_a_specific_test
    .get(verifyfac,(req, res, next) => {
        Tests.findById(req.params.testId)
            .then((test) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(test);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
// api/updating_any_other_parameter_of_test_other_than_ques&answers
    .put(verifyfac,(req, res, next) => {
        console.log(req.body)
        Tests.findByIdAndUpdate(req.params.testId, {
            $set: req.body
        }, { new: true })
            .then((test) => {
                // console.log(test)
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(test);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
// api/delete_specific_test
    .delete(verifyfac,(req, res, next) => {
        Tests.findByIdAndRemove(req.params.testId)
            .then((test) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(test);
            }, (err) => next(err))
            .catch((err) => next(err));
    });


// localhost:8081/test/:testId/questions
TestRouter.route('/:testId/questions')
// api/display_all_ques_of_a_test
    .get(verifyfac,(req, res, next) => {
        Tests.findById(req.params.testId)
            .then((test) => {
                if (test != null) {
                    if(test.questions != null) {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(test);}
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
// api/add_a_ques_to_test
    .post(verifyfac,(req, res, next) => {
        Tests.findById(req.params.testId)
            .then((test) => {
                if (test != null) {
                    test.questions.push(req.body);
                    test.save()
                        .then((test) => {
                            Tests.findById(test._id)
                                .then((test) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    return res.json({ status: 'ok', data:test })
                                })
                        }, (err) => next(err));
                }
                else {
                    err = new Error('test ' + req.params.testId + ' not found');
                    err.statusCode = 404;
                    return next(err);
                }
            }, (err) => next(err)).catch((err) => next(err));
    })
// api/delete_all_quesfrom test
    .delete(verifyfac,(req, res, next) => {
        Tests.findById(req.params.testId)
            .then((test) => {
                if (test != null) {
                    for (var i = (test.questions.length - 1); i >= 0; i--) {
                        test.questions.id(test.questions[i]._id).remove();
                    }
                    test.save()
                        .then((test) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(test.questions);
                        }, (err) => next(err));
                }
                else {
                    err = new Error('test ' + req.params.testId + ' not found');
                    err.statusCode = 404;
                    return next(err);
                }
            }, (err) => next(err)).catch((err) => next(err));
    });


// localhost:8080/test/:testId/questions/:questionId
TestRouter.route('/:testId/questions/:questionId')
// api/get_a_specific_ques
    .get(verifyfac,(req, res, next) => {
        Tests.findById(req.params.testId)
            .then((test) => {
                if (test != null && test.questions.id(req.params.questionId) != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(test.questions.id(req.params.questionId));
                }
                else if (test == null) {
                    err = new Error('test ' + req.params.testId + ' not found');
                    err.statusCode = 404;
                    return next(err);
                }
                else {
                    err = new Error('Question ' + req.params.questionId + ' not found');
                    err.statusCode = 404;
                    return next(err);
                }
            }, (err) => next(err)).catch((err) => next(err));
    })
// api/update a specific ques
    .put(verifyfac,(req, res, next) => {
        Tests.findById(req.params.testId)
            .then((test) => {

                if (test != null && test.questions.id(req.params.questionId) != null) {
                    if (req.body.question) {
                        test.questions.id(req.params.questionId).question = req.body.question;
                    }
                    if (req.body.answers) {
                        test.questions.id(req.params.questionId).answers = req.body.answers;
                    }
                    if (req.body.answer) {
                        test.questions.id(req.params.questionId).answer = req.body.answer;
                    }
                    test.save()
                        .then((test) => {
                            Tests.findById(test._id)
                                .then((test) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(test.questions.id(req.params.questionId));
                                })
                        }, (err) => next(err));
                }
                else if (test == null) {
                    err = new Error('test ' + req.params.testId + ' not found');
                    err.statusCode = 404;
                    return next(err);
                }
                else {
                    err = new Error('Question ' + req.params.questionId + ' not found');
                    err.statusCode = 404;
                    return next(err);
                }
            }, (err) => next(err)).catch((err) => next(err));
    })
// api/delete a ques
    .delete(verifyfac,(req, res, next) => {
        Tests.findById(req.params.testId)
            .then((test) => {
                if (test != null && test.questions.id(req.params.questionId) != null) {
                    test.questions.id(req.params.questionId).remove();
                    test.save()
                        .then((test) => {
                            Tests.findById(test._id)
                                .then((test) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(test);
                                })
                        }, (err) => next(err));
                }
                else if (test == null) {
                    err = new Error('test ' + req.params.testId + ' not found');
                    err.statusCode = 404;
                    return next(err);
                }
                else {
                    err = new Error('Question ' + req.params.questionId + ' not found');
                    err.statusCode = 404;
                    return next(err);
                }
            }, (err) => next(err)).catch((err) => next(err));
    });

module.exports = TestRouter;

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