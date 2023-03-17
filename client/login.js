var emailIDInput = document.getElementById("exampleInputEmail1")
var passwordInput = document.getElementById("exampleInputPassword1")
var loginButton = document.getElementById("loginbutton")
var signupbutton = document.getElementById("signupbutton")
var forgetPassword = document.getElementById("forgetpassword")

loginButton.addEventListener("click" , function(event)
{
  event.preventDefault();
  onLoginClick()
})

forgetPassword.addEventListener("click" , function(event)
{
  
  event.preventDefault();

      window.location.href ="/forgetPassword";
})

signupbutton.addEventListener("click" , function(event)
{
  event.preventDefault();
  onSignupClick()
})

function onLoginClick()
{
  if(emailIDInput.value != "" && passwordInput.value != "")
  {
    var loginDetails = 
    {
      loginID : emailIDInput.value,
      loginPassword : passwordInput.value
    }

    var request = new XMLHttpRequest();
    request.open("POST" , "/userlogin");
    request.setRequestHeader("Content-type" , "application/json");
    request.send(JSON.stringify(loginDetails));

    request.addEventListener("load" , function()
    {
       if(request.status === 200  || request.responseText == "Logic Success")
      {
        console.log("Login Successfull")

        var username = request.responseText
        console.log(username);

        localStorage.setItem("name" ,JSON.stringify(username))

        window.location.href ="/";
      }
      else
      {
        alert("Invalid email or password")
      }
    })
  }
  else
  {
    alert("Please fill the details")
  }
}

function onSignupClick()
{
  console.log('dfsf')
  window.location.href = "/signup";
}

