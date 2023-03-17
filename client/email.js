var emailIDInput = document.getElementById("exampleInputEmail1")
var sendOTPButton = document.getElementById("sendOTP")

sendOTPButton.addEventListener("click" , function(event)
{
  event.preventDefault();
  onClick()
})

function onClick()
{
  if(emailIDInput.value != "")
  {
    var otpDetails = 
    {
      email : emailIDInput.value,
    }

    var request = new XMLHttpRequest();
    request.open("POST" , "/forget");
    request.setRequestHeader("Content-type" , "application/json");
    request.send(JSON.stringify(otpDetails));

    request.addEventListener("load" , function()
    {
       if(request.status === 200)
      {
        alert("We have sent an OTP to your Mail Please Check Your Mail")
        console.log(request)
        let userId = request.responseText
        console.log(userId)
        window.location.href = `/forgotPassword`
      } else if( request.status === 400) {
        alert("something went wrong")

      }
      else
      {
        alert("Invalid email")
      }
    })
  }
  else
  {
    alert("Please fill the details")
  }
}


