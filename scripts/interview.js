const chatBody = document.querySelector(".chat-body");
const messageInput = document.querySelector(".message-input");
const sendMessageButton = document.querySelector("#send-message");

const API_KEY = "AIzaSyBcTsbJoFWx6agnKAMZBtBIYe89d_5DhyI";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

// Interview logic state
let currentQuestionIndex = 0;
let totalQuestions = 6;
let generatedQuestions = [];
let interviewStarted = false;
let userAnswers = [];
let interviewData = []; // stores question-answer pairs

// Create message element with dynamic classes and return it
const createMessageElement = (content, ...classes) => {
  const div = document.createElement("div");
  div.classList.add("message", ...classes);
  div.innerHTML = content;
  return div;
};

// Ask the next question from the list
function askNextQuestion() {
  if (currentQuestionIndex < generatedQuestions.length) {
    const question = generatedQuestions[currentQuestionIndex];
    const messageContent = `<div class="message-text">${question}</div>`;
    const messageDiv = createMessageElement(messageContent, "bot-message");
    chatBody.appendChild(messageDiv);
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
    interviewStarted = true;
  } else {
    // Interview ends
    const endMsg = `<div class="message-text">Thank you for your responses. The interview is now complete!</div>`;
    const endDiv = createMessageElement(endMsg, "bot-message");
    chatBody.appendChild(endDiv);

    // Show summary
    // const summary = userAnswers
    //   .map(
    //     (ans, i) =>
    //       `<div><strong>Q${i + 1}:</strong> ${
    //         generatedQuestions[i]
    //       }<br/><strong>Your Answer:</strong> ${ans}</div><br/>`
    //   )
    //   .join("");
    // const summaryDiv = createMessageElement(
    //   `<div class="message-text">${summary}</div>`,
    //   "bot-message"
    // );
    // chatBody.appendChild(summaryDiv);

    // Redirect to report page after 4 seconds
    setTimeout(() => {
      window.location.href = "report.html";
    }, 4000);
  }
}

// Generate interview questions using Gemini API
const generateInterviewQuestions = async () => {
  const prompt = `You are an AI interviewer. Generate ${totalQuestions} basic web development interview questions. The first question should always be: "Welcome to the interview. What's your name?" Only return a list of questions, numbered.`;

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    }),
  };

  try {
    const response = await fetch(API_URL, requestOptions);
    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;

    // Extract questions from the Gemini response
    generatedQuestions = text.split(/\d+\.\s/).filter((q) => q.trim() !== "");

    askNextQuestion(); // Start the interview
  } catch (error) {
    console.error("Failed to generate questions:", error);
    const errorMsg = createMessageElement(
      `<div class="message-text">Failed to start interview: ${error.message}</div>`,
      "bot-message"
    );
    chatBody.appendChild(errorMsg);
  }
};

// Handle outgoing user message
const handleOutgoingMessage = (e) => {
  e.preventDefault();
  const userMessage = messageInput.value.trim();
  if (!userMessage) return;
  messageInput.value = "";
  messageInput.style.height = "50px"; // Reset height immediately after sending

  const outgoingDiv = createMessageElement(
    `<div class="message-text">${userMessage}</div>`,
    "user-message"
  );
  chatBody.appendChild(outgoingDiv);
  chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });

  if (interviewStarted && currentQuestionIndex < generatedQuestions.length) {
    const currentQuestion = generatedQuestions[currentQuestionIndex];

    // If it's the name question (first question)
    if (currentQuestionIndex === 0) {
      const greetMsg = createMessageElement(
        `<div class="message-text">Nice to meet you, ${userMessage}!</div>`,
        "bot-message"
      );
      chatBody.appendChild(greetMsg);
      chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });

      currentQuestionIndex++; // Move to next question (but do NOT store name)
      setTimeout(() => {
        askNextQuestion();
      }, 800);
      return;
    }

    // Validate user answer (skip saving junk/short responses)
    const lowerAnswer = userMessage.toLowerCase();
    const isTooShort =
      userMessage.length < 5 && !/^(ok|hi|no|yo|uh)$/i.test(userMessage);
    const isRandom =
      /(asdf|qwerty|lol|idk|no idea|random|none|12345)/i.test(lowerAnswer) ||
      /^[^a-zA-Z\s]*$/.test(userMessage);

    if (isTooShort || isRandom) {
      const botResponse = createMessageElement(
        `<div class="message-text">Could you please elaborate a bit more on that?</div>`,
        "bot-message"
      );
      chatBody.appendChild(botResponse);
      chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
      return;
    }

    // Save only valid questions & answers (excluding name)
    userAnswers.push(userMessage);
    interviewData.push({
      question: currentQuestion,
      answer: userMessage,
    });
    localStorage.setItem("interviewData", JSON.stringify(interviewData));

    currentQuestionIndex++;
    setTimeout(() => {
      askNextQuestion();
    }, 800);
  } else if (!interviewStarted) {
    generateInterviewQuestions();
  }
};


// Send message with Enter key
messageInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleOutgoingMessage(e);
  }
});

// Auto-Resize on Input
messageInput.addEventListener("input", () => {
  messageInput.style.height = "50px"; // Reset height
  messageInput.style.height = Math.min(messageInput.scrollHeight, 150) + "px"; // Resize up to 150px
});

// Send message with button
sendMessageButton.addEventListener("click", (e) => handleOutgoingMessage(e));

// Optional: Start interview on page load
window.onload = () => {
  localStorage.removeItem("interviewData"); // Clear past interview data
  setTimeout(() => {
    generateInterviewQuestions();
  }, 100);
};
