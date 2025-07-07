// Mic icon reference
const mic = document.getElementById("mic");

// Check for browser support
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = true; // Live update while speaking
  recognition.continuous = false; // Stop after a pause

  mic.addEventListener("click", () => {
    recognition.start();
    mic.classList.add("listening");
    textArea.placeholder = "Listening...";
  });

  // Live transcription to textarea
  recognition.addEventListener("result", (event) => {
    const transcript = Array.from(event.results)
      .map((result) => result[0].transcript)
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
