const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const User= require('./model/user')
var cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken')
const jwt_secret = require('./auth/jwtauth')

mongoose.connect('mongodb://localhost:27017/quiz-app', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
})

const con = mongoose.connection
con.on('open', ()=>{
    console.log('Database Connected')
})

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cookieParser());

app.set("view engine","ejs")

app.use(express.static(path.join(__dirname+'///public')));
console.log(path.join(__dirname+'///public'));
app.use(express.static(path.join(__dirname+'///public/HTML')));
app.use(express.static(path.join(__dirname+'///public/CSS')));
app.use(express.static(path.join(__dirname+'///public/JS')));
app.use(express.static(path.join(__dirname,"../public/error 404")));
app.use('/public', express.static(path.join(__dirname,"./views/assets")));
app.use('/imgs',express.static(path.join(__dirname,"./views/assets/img")));
app.use('/csses',express.static(path.join(__dirname,"./views/assets/css")));
app.get('/',(req,res)=>{
	res.redirect("/home.html")
})

app.get("/wait",(req,res) => {
	res.render("WaitForApproval")
})
app.get("/form",(req,res) => {
	res.render("form")
})

app.use('/home',(req,res,next)=>{
	res.sendFile(path.join(__dirname+'///public/HTML/home.html'))
})

app.use('/adminboard',(req,res,next)=>{
	res.sendFile(path.join(__dirname+'///public/HTML/adminHome.html'))
})
app.use('/facultydash',(req,res,next)=>{
	res.sendFile(path.join(__dirname+'///public/HTML/facultyHome.html'))
})

const userroute = require('./routes/userRoutes')
app.use('/api/user',userroute)

const facultyroute=require('./routes/facultyRoutes')
app.use('/api/faculty',facultyroute)

const adminroutes=require('./routes/adminRoutes')
app.use('/api/admin',adminroutes)

const testroute=require('./routes/testRoute')
app.use('/api/test',testroute)

const anstest=require('./routes/reponseRoutes')
app.use('/api/response',anstest)

app.get('/stuhome',verifyuser,async (req,res)=>{
	var t= req.headers["cookie"]
	t=t.substr(6);
	const user = await User.findOne({token:t}).lean()
	res.render("StudentHome",{user})
})
app.get('/studentLogin',async(req,res) => {
	var u = {
		"status": "ok"
	}
	res.render("login",{u})
})
app.get('*', function(req, res){
	res.status(404).redirect("/pageNotFound.html");
  });

app.listen(3000, () => {
	console.log('Server up at 3000')
})

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