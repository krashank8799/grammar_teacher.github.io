var otpInput = document.getElementById("exampleInputOTP1")
var passwordInput = document.getElementById("exampleInputPassword")
// var passwordConfirmInput = document.getElementById("exampleInputPassword")
var onSubmitButton = document.getElementById("onSubmitButton")

onSubmitButton.addEventListener("click" ,function(event)
{
  event.preventDefault();
  onSubmitOTPDetails();
})

function onSubmitOTPDetails()
{
  var details = {
    otp : otpInput.value,
    password : passwordInput.value
  }

  if(otpInput.value != "" && passwordInput.value != "")
  {
    var request = new XMLHttpRequest();
    request.open("POST" , "/passwordreset");
    request.setRequestHeader("Content-type" , "application/json");
    request.send(JSON.stringify(details));

    request.addEventListener("load" , function()
    {
      if(request.status===400)
      {
        alert("Something went Wrong");
      }
      else if(request.status === 200)
      {
        console.log("password reset successfully")
        window.location.href = "/";
      }
    })
  }
  else
  {
    alert("Please fill the details")
  }
}