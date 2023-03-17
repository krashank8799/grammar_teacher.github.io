var usernameDetailInput = document.getElementById("exampleInputName1")
var passwordDetailInput = document.getElementById("exampleInputPassword1")
var emailDetailInput = document.getElementById("exampleInputEmail1")
var saveSignupDetail = document.getElementById("savesignupdetail")

saveSignupDetail.addEventListener("click" ,function(event)
{
  event.preventDefault();
  signupDetails();
})

function signupDetails()
{
  var details = {
    username : usernameDetailInput.value,
    password : passwordDetailInput.value,
    email : emailDetailInput.value,
  }

  if(usernameDetailInput.value != "" && passwordDetailInput.value != "" && emailDetailInput.value != "" )
  {
    var request = new XMLHttpRequest();
    request.open("POST" , "/signup");
    request.setRequestHeader("Content-type" , "application/json");
    request.send(JSON.stringify(details));

    request.addEventListener("load" , function()
    {
      if(request.status===400)
      {
        alert("Email already Exist");
      }
      else if(request.status === 200)
      {
        console.log("Signup success")
        window.location.href = "/login.html";
      }
    })
  }
  else
  {
    alert("Please fill the details")
  }
}