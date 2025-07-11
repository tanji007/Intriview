window.onload = async () => {
  const loader = document.getElementById("loader");
  const table = document.getElementById("report-table");

  const interviewData = JSON.parse(localStorage.getItem("interviewData")) || [];
  const cachedReport = JSON.parse(localStorage.getItem("scoredReport")) || [];

  const isJunkAnswer = (answer) => {
    const lower = answer.trim().toLowerCase();
    return (
      (lower.length < 5 && !/^(ok|hi|no|yo|uh)$/i.test(lower)) ||
      /(asdf|qwerty|lol|idk|no idea|random|none|12345)/i.test(lower) ||
      /^[^a-zA-Z\s]*$/.test(lower)
    );
  };

  const createReportRow = (srNo, entry) => {
    const row1 = document.createElement("tr");
    row1.innerHTML = `
      <td rowspan="3">${srNo}</td>
      <td class="que-label">Que</td>
      <td class="desc que-desc">${entry.question}</td>
      <td rowspan="3">${entry.score}</td>
    `;

    const row2 = document.createElement("tr");
    row2.innerHTML = `
      <td class="ans-label">Ans</td>
      <td class="desc ans-desc">${entry.answer}</td>
    `;

    const row3 = document.createElement("tr");
    row3.innerHTML = `
      <td class="feedback-label">Feedback</td>
      <td class="desc feedback-desc">${entry.feedback}</td>
    `;

    table.appendChild(row1);
    table.appendChild(row2);
    table.appendChild(row3);
  };

  // Show loader, hide table
  loader.style.display = "flex";
  table.style.display = "none";

  // If cached report is available, use it
  if (cachedReport.length > 0) {
    let srNo = 1;
    cachedReport.forEach((entry) => {
      createReportRow(srNo++, entry);
    });

    loader.style.display = "none";
    table.style.display = "table";
    return;
  }

  // If no cached report, generate it
  const API_KEY = "AIzaSyB2z24K-5rUmbl2sy_h-YjGv7nv2uiYg8k";
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

  const getScoreAndFeedbackFromAPI = async (question, answer) => {
    const prompt = `You're a strict technical interviewer evaluating candidate answers.

Evaluate the following answer based on:
- Accuracy
- Relevance
- Completeness

Provide:
1. A score from 0–10 (just the number on the first line)
2. One-line constructive feedback explaining why the answer received that score.

Example:
7
Good explanation overall, but it lacked details about async/await.

Now evaluate:
Question: ${question}
Answer: ${answer}`;

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
      const rawText =
        data.candidates?.[0]?.content?.parts?.[0]?.text || "Pending";

      const lines = rawText.trim().split("\n");
      const score = lines[0].match(/\d+/)?.[0] || "Pending";
      const feedback = lines.slice(1).join(" ") || "No feedback available.";

      return { score, feedback };
    } catch (err) {
      console.error("Rating API failed:", err);
      return { score: "Error", feedback: "Feedback not available." };
    }
  };

  // Generate and store scored report
  let srNo = 1;
  let scoredReport = [];

  for (const entry of interviewData) {
    if (
      entry.question.toLowerCase().includes("what's your name") ||
      isJunkAnswer(entry.answer)
    ) {
      continue;
    }

    const { score, feedback } = await getScoreAndFeedbackFromAPI(
      entry.question,
      entry.answer
    );

    const fullEntry = {
      question: entry.question,
      answer: entry.answer,
      score,
      feedback,
    };

    scoredReport.push(fullEntry);
    createReportRow(srNo++, fullEntry);
  }

  // Save to localStorage for caching
  localStorage.setItem("scoredReport", JSON.stringify(scoredReport));

  loader.style.display = "none";
  table.style.display = "table";
};
