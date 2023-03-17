const db = require("./database/index");
const userModel = require("./database/models/users");
const sendMail = require("./utils/verifymail")

sendMail.sendMailToUser

db.start();

var globalUserId, globalUserOtp;


const express = require('express')
const app = express()
const port = 3000;

app.use(express.urlencoded())
app.use(express.json())

app.use(express.static("client"))

app.set('view engine', 'ejs');
app.set("views", "views")



var session = require('express-session');


app.use(session(
{
  secret: 'keyboard cat',  
}))

app.get("/" , function(req , res)
{
  if(req.session.isLoggedIn)
  {
    console.log('true')
    // res.sendFile(__dirname+"/htmlPages/main.html")
    res.render('main', {param: true})
  }
  else {
    console.log('false')
    // res.sendFile(__dirname+"/htmlPages/main.html?param=false")
    res.render('main', {param: false})
  }

})

app.get("/login" , function(req , res)
{
   res.sendFile(__dirname+"/htmlPages/login.html")
})

app.get("/signup" , function(req , res)
{
   res.sendFile(__dirname+"/htmlPages/signup.html")
})

app.post("/signup" , function(req , res)
{
  var user = req.body;

      writeUser(user ,function(result)
      {
        if(result) {
          res.status(200);
          res.sendFile(__dirname+"/htmlPages/login.html")
        } else {
          res.status(400).send('failed');
        }
      })
      
})

app.post("/userlogin" , function(req , res)
{
    var newEmail = req.body.loginID;
    var newPassword = req.body.loginPassword;

    readUserLogin(newEmail , newPassword ,function(user)
    {
      console.log(user)
          if(user)
          {
            console.log(user)
            req.session.isLoggedIn = true;
            req.session.username = user.username;
            req.session.useremail = user.email;
            req.session.userId = user._id;

            res.status(200);
            res.end(req.session.username);

            console.log("login success")
          }
          else
          {
            res.status(400);
            res.end("Login Error")
            console.log("login error")
          }
    })
})

app.get("/logout" , function(req ,res)
{
  res.sendFile(__dirname+"/htmlPages/login.html")
  req.session.destroy();
})

app.get("/forgetPassword" , function(req ,res)
{
  // console.log(res.render)
	// res.render("password.ejs")
  res.sendFile(__dirname+"/htmlPages/email.html")

})


app.post("/forget" , function(req ,res)
{
	var email = req.body.email;
  console.log(email)
	req.session.email = email;

	userModel.findOne({email : email}).then(async function(data)
	{
    console.log('sdsda')
    console.log(data)
    if(data){

		var userId = data._id;
		console.log(userId)

			//Send OTP
			var otp = Math.floor(Math.random() * (999999 - 100000) + 100000);
			req.session.otp = otp;
      req.session.userId = userId
      globalUserId = userId;
      globalUserOtp = otp;
			console.log(otp);

			var url ='<h1>Your OTP is - '+otp+ '</h1>'
			 '<a href= "https://grammarly-3p34g811xx2lcapxx8j.codequotient.in/verifyotp/'+userId+'"> Reset Password</a>'

			sendMail.sendMailToUser(email,url,
			function(bool)
			{
        console.log(bool)
				if(!bool)
				{
          res.status(400);
					res.render("error.ejs",{errorMsg : "Error While Reseting Password!"})
				}
				else
				{
					console.log("OTP sent Successfully");
        
          req.session.destroy();

					res.status(200).json(userId);

					// res.render("message.ejs",{msg :"We have sent an OTP to your Mail Please Check Your Mail"})

				}
			})
    } else {
      res.render("error.ejs" , {errorMsg : "Invalid Email"})
    }
	
	}).catch(function(err)
	{
    console.log(err)
		res.render("error.ejs" , {errorMsg : "something went wrong"})
	})
})

app.get("/forgotPassword" , function(req, res)
{
  res.sendFile(__dirname+"/htmlPages/forgotPassword.html")

	// res.render("reset.ejs", {userId : userId , errorMsg :""});
})

app.post("/passwordreset" , function(req, res)
{
	var userOtp = req.body.otp;
	var newpassword = req.body.password;
	var otp = req.session.otp || globalUserOtp;
	var userId = req.session.userId || globalUserId;
	var email = req.session.email;

	// console.log(userOtp);
	// console.log(otp, userId,'krashank');

    if(userOtp == otp)
    {
        userModel.updateOne({_id : userId} ,{password : newpassword}).then(function(data)
        {
        console.log(data);
        res.status(200);
        res.sendFile(__dirname+"/htmlPages/login.html");

        // sendMail(email,
        // "Password Changed",
        // "Password Changed Successfully",
        // "",
        // function(err)
        // {
        //   if(err)
        //   {
        //     res.render("error.ejs",{errorMsg : "Error While Reseting Password!"})
        //   }
        //   else
        //   {
        //     console.log("Password Changed Successfully");
        //     res.status(200);
        //   }
        // })
      })
    }
    else
    {
      res.render("reset.ejs" ,{userId : "" , errorMsg : "Wrong OTP"})
    }

	
})


function writeUser(user , callback)
{
  userModel.findOne({email:user.email}).then(function(data){
    if(data) {
      callback(false);
    } else {

      userModel.create(user ,function(err)
      {
        if(err)
        {
          console.log(err);
        }
        callback(true);
      })
    }
  })
}

function readUserLogin(newEmail , newPassword ,callback)
{
console.log(newEmail, newPassword)
  userModel.findOne({email : newEmail , password : newPassword}).then(function(users)
  {
    callback(users);
  }).catch(function(err)
  {
    console.log(err)
  })
}

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})
