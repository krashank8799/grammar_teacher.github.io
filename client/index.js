const charval = document.getElementById("textarea");
let totalCount = document.getElementById("total-conter");
let remainingCoutn = document.getElementById("remaining-counter");
const logoutButton = document.getElementById("logout-button");
let para = document.getElementById("para");

let userChar = 0;

let username = localStorage.getItem("name");
username = JSON.parse(username);
const greet = `Hi!! ${username}, `;
para.append(greet);

const updateCounter = () => {
  userChar = charval.value.length;

  totalCount.innerText = userChar;

  remainingCoutn.innerText = 50 - userChar;
  console.log(remainingCoutn.innerHTML)
  
if(remainingCoutn.innerHTML == 0) {
  alert('Please Login for Additional Features!!!');
  window.location.href = "/login";
}
};

charval.addEventListener("keyup", () => updateCounter());

const copyText = () => {
  charval.select();
  charval.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(charval.value);
};

function runSpeechRecognition() {
  // get output div reference
  var output = document.getElementById("textarea");
  // get action element reference
  var action = document.getElementById("action");
      // new speech recognition object
      var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
      var recognition = new SpeechRecognition();
  
      // This runs when the speech recognition service starts
      recognition.onstart = function() {
          action.innerHTML = "listening, please speak...";
          console.log(action)
      };
      
      recognition.onspeechend = function() {
          action.innerHTML = "stopped listening, hope you are done...";
          console.log(action)
          recognition.stop();
      }
    
      // This runs when the speech recognition service returns result
      recognition.onresult = function(event) {
          var transcript = event.results[0][0].transcript;
          var confidence = event.results[0][0].confidence;
          output.innerHTML = transcript;
          output.classList.remove("hide");
      };
    
       // start recognition
       recognition.start();
}

logoutButton.addEventListener("click", function () {
  var request = new XMLHttpRequest();
  request.open("GET", "/logout");
  request.send();

  request.addEventListener("load", function () {
    if (request.responseText === 200) {
      localStorage.clear();
    }
    window.location.href = "/";
  });
});



// synonyms--------
charval.addEventListener("click", function(event) {
  let clickedWord = getClickedWord(event);

  // Call the Datamuse API to fetch synonyms for clickedWord
  fetch(`https://api.datamuse.com/words?rel_syn=${clickedWord}`)
    .then(response => response.json())
    .then(data => {
      // Display the synonyms in a tooltip near the clicked word
      let tooltip = createTooltip(event.clientX, event.clientY, data);
      document.body.appendChild(tooltip);

      // Add a click event listener to each synonym in the tooltip
      let synonymLinks = tooltip.querySelectorAll(".synonym");
      synonymLinks.forEach(link => {
        link.addEventListener("click", function(event) {
          event.preventDefault();
          let newWord = this.textContent;
          replaceWord(clickedWord, newWord);
          tooltip.remove();
        });
      });
    })
    .catch(error => {
      console.error(error);
    });
});

function getClickedWord(event) {
  let textarea = event.target;
  let cursorPos = textarea.selectionStart;
  let textareaContent = textarea.value;

  // Get the word that was clicked by finding the start and end of the word
  let start = textareaContent.lastIndexOf(" ", cursorPos - 1) + 1;
  let end = textareaContent.indexOf(" ", cursorPos);
  if (end === -1) {
    end = textareaContent.length;
  }
  let word = textareaContent.slice(start, end);
  
  return word;
}

function createTooltip(x, y, synonyms) {
  let tooltip = document.createElement("div");
  tooltip.classList.add("tooltip");
  tooltip.style.left = x + "px";
  tooltip.style.top = y + "px";

  let title = document.createElement("div");
  title.classList.add("title");
  title.textContent = "Synonyms:";
  tooltip.appendChild(title);

  let synonymList = document.createElement("ul");
  synonymList.classList.add("synonyms");
  synonyms.forEach(synonym => {
    let synonymItem = document.createElement("li");
    synonymItem.classList.add("synonym");
    synonymItem.textContent = synonym.word;
    synonymList.appendChild(synonymItem);
  });
  tooltip.appendChild(synonymList);

  return tooltip;
}

function replaceWord(oldWord, newWord) {
  let textarea = document.getElementById("textarea");
  let cursorPos = textarea.selectionStart;
  let textareaContent = textarea.value;

  let start = textareaContent.lastIndexOf(" ", cursorPos - 1) + 1;
  let end = textareaContent.indexOf(" ", cursorPos);
  if (end === -1) {
    end = textareaContent.length;
  }
  let currentWord = textareaContent.slice(start, end);

  if (currentWord === oldWord) {
    let newContent = textareaContent.slice(0, start) + newWord + textareaContent.slice(end);
    textarea.value = newContent;
  }
}



let speakButton = document.getElementById("speak-button");

// Add a click event listener to the speak button
speakButton.addEventListener("click", function() {
  let textarea = document.getElementById("textarea");
  let text = textarea.value;

  // Create a new SpeechSynthesisUtterance object with the text to be spoken
  let utterance = new SpeechSynthesisUtterance(text);

  // Use the default voice
  let voices = window.speechSynthesis.getVoices();
  utterance.voice = voices[0];

  // Speak the text
  window.speechSynthesis.speak(utterance);
});


