import { auth, db } from "./firebase.js";
import {
  doc,
  collection,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  limit,
  addDoc,
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

window.onload = async () => {
  const loader = document.getElementById("loader");
  const table = document.getElementById("report-table");
  const interviewData = JSON.parse(sessionStorage.getItem("interviewData")) || [];
  const reportAlreadyGenerated =
    localStorage.getItem("reportGenerated") === "true";

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
      <td rowspan="3">${entry.score}</td>`;
    const row2 = document.createElement("tr");
    row2.innerHTML = `<td class="ans-label">Ans</td><td class="desc ans-desc">${entry.answer}</td>`;
    const row3 = document.createElement("tr");
    row3.innerHTML = `<td class="feedback-label">Feedback</td><td class="desc feedback-desc">${entry.feedback}</td>`;

    table.appendChild(row1);
    table.appendChild(row2);
    table.appendChild(row3);
  };

  const getScoreAndFeedbackFromAPI = async (question, answer) => {
    const API_KEY = "AIzaSyB2z24K-5rUmbl2sy_h-YjGv7nv2uiYg8k";
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

    const prompt = `You're a strict technical interviewer evaluating candidate answers.

Evaluate the following answer based on:
- Accuracy
- Relevance
- Completeness

Provide:
1. A score from 0-10 (just the number on the first line)
2. One-line constructive feedback.

Example:
7
Good explanation overall, but it lacked details about async/await.

Now evaluate:
Question: ${question}
Answer: ${answer}`;

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
        }),
      });

      const data = await res.json();
      const text =
        data?.candidates?.[0]?.content?.parts?.[0]?.text || "0\nNo feedback.";
      const lines = text.trim().split("\n");

      return {
        score: lines[0].match(/\d+/)?.[0] || "0",
        feedback: lines.slice(1).join(" ") || "No feedback available.",
      };
    } catch (err) {
      console.error("Gemini API Error:", err);
      return { score: "Error", feedback: "Feedback not available." };
    }
  };

  const saveReportToFirestore = async (uid, scoredReport) => {
    const reportsRef = collection(db, "users", uid, "reports");
    const existingReports = await getDocs(
      query(reportsRef, orderBy("createdAt", "asc"))
    );

    if (existingReports.size >= 5) {
      const oldest = existingReports.docs[0];
      await deleteDoc(doc(reportsRef, oldest.id));
    }

    await addDoc(reportsRef, {
      report: scoredReport,
      createdAt: new Date(),
    });
  };

  loader.style.display = "flex";
  table.style.display = "none";

  onAuthStateChanged(auth, async (user) => {
    let scoredReport = [];

    if (reportAlreadyGenerated) {
      const cached = JSON.parse(localStorage.getItem("scoredReport")) || [];
      let srNo = 1;
      cached.forEach((entry) => createReportRow(srNo++, entry));
      loader.style.display = "none";
      table.style.display = "table";
      return;
    }

    if (!interviewData.length) {
      if (user) {
        const reportsRef = collection(db, "users", user.uid, "reports");
        const latest = await getDocs(
          query(reportsRef, orderBy("createdAt", "desc"), limit(1))
        );

        if (!latest.empty) {
          const savedReport = latest.docs[0].data().report;
          let srNo = 1;
          savedReport.forEach((entry) => createReportRow(srNo++, entry));
          localStorage.setItem("scoredReport", JSON.stringify(savedReport));
          localStorage.setItem("reportGenerated", "true");

          loader.style.display = "none";
          table.style.display = "table";
          return;
        }
      } else {
        const cached = JSON.parse(localStorage.getItem("scoredReport")) || [];
        if (cached.length) {
          let srNo = 1;
          cached.forEach((entry) => createReportRow(srNo++, entry));
          localStorage.setItem("reportGenerated", "true");

          loader.style.display = "none";
          table.style.display = "table";
          return;
        }
      }
    }

    // Generate scored report (first time for this session)
    let srNo = 1;
    for (const entry of interviewData) {
      if (
        entry.question.toLowerCase().includes("what's your name") ||
        isJunkAnswer(entry.answer)
      )
        continue;

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

    // Save report
    localStorage.setItem("scoredReport", JSON.stringify(scoredReport));
    localStorage.setItem("reportGenerated", "true");

    if (user) await saveReportToFirestore(user.uid, scoredReport);

    loader.style.display = "none";
    table.style.display = "table";
  });
};
