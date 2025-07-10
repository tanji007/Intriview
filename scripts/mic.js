const micButton = document.querySelector("#mic");

// Check browser support
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = SpeechRecognition ? new SpeechRecognition() : null;

if (recognition) {
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = "en-US";

  recognition.onstart = () => {
    micButton.classList.add("listening");
  };

  recognition.onend = () => {
    micButton.classList.remove("listening");
  };

  recognition.onerror = (event) => {
    alert("Speech recognition error: " + event.error);
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.trim();
    messageInput.value = transcript;
    sendMessageButton.style.display = "block";
    messageInput.focus();
  };

  micButton.addEventListener("click", () => {
    recognition.start();
  });
} else {
  micButton.disabled = true;
  micButton.title = "Speech recognition not supported in this browser.";
}
