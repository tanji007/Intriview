// When the window loads, show the first question after 1.5 seconds
window.onload = function () {
  setTimeout(() => {
    addQue(); // Start the interview
  }, 1500);
};

// DOM element that holds all chat content (questions & answers)
let chatContainer = document.querySelector(".chat");

// Variable to hold the user's name (if needed later)
let Name;

// Predefined questions (reverse order for stack-like access)
const questions = [
  "What is Your Name",
  "Hello Yash!"
];
questions.reverse(); // So we can use pop() to get them in order

// Array to hold user answers temporarily
let ans = [];

// Function to add a question to the chat
function addQue() {
  if (questions.length === 0) return; // Stop if no more questions

  let questionDiv = document.createElement("div");
  questionDiv.classList.add("que");
  questionDiv.textContent = questions.pop(); // Get the next question
  chatContainer.appendChild(questionDiv);
}

// Reference to the textarea input
let textArea = document.querySelector("textarea");

// Function to fetch and store the user's answer
function getAns() {
  let input = textArea.value.trim(); // Get and clean input
  ans.push(input); // Store the answer
  textArea.value = ""; // Clear the textarea
}

// Function to display the last stored answer in the chat
function addAns() {
  let answerDiv = document.createElement("div");
  answerDiv.classList.add("ans");
  answerDiv.textContent = ans.pop(); // Get last answer
  chatContainer.appendChild(answerDiv);
}

// Handle Enter key to submit answer
textArea.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault(); // Prevent new line
    getAns();           // Capture input
    addAns();           // Display answer
    setTimeout(() => {
      addQue();         // Show next question after 1 second
    }, 1000);
  }
});

// Mic icon reference
const mic = document.getElementById("mic");

// Check for browser support
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = true; // Live update while speaking
  recognition.continuous = false;    // Stop after a pause

  mic.addEventListener("click", () => {
    recognition.start();
    mic.classList.add("listening");
    textArea.placeholder = "Listening...";
  });

  // Live transcription to textarea
  recognition.addEventListener("result", (event) => {
    const transcript = Array.from(event.results)
      .map(result => result[0].transcript)
      .join("");

    textArea.value = transcript;
  });

  // Stop listening visuals
    recognition.addEventListener("end", () => {
    mic.classList.remove("listening");
    textArea.placeholder = "Type your response";
    // No auto-submit here
  });
} else {
  alert("Speech Recognition is not supported in this browser.");
}
