let timeLeft = 60; // in seconds
const display = document.getElementById("countdown");

const countdown = setInterval(() => {
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  display.textContent = `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;

  if (timeLeft <= 0) {
    clearInterval(countdown);
    display.textContent = "Time's up!";
    return;
  }

  timeLeft--;
}, 1000);
