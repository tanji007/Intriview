// Get the 'type' parameter from the URL
const params = new URLSearchParams(window.location.search);
const type = params.get("type");

// Map values to readable titles
const titles = {
  technical: "Technical Interview",
  star: "STAR-Based Interview",
  hr: "HR Interview",
};

// Set title text based on type
if (type && titles[type]) {
  document.getElementById("interviewTitle").textContent = titles[type];
} else {
  document.getElementById("interviewTitle").textContent = "Interview Options";
}

const uploadButton = document.getElementById("resume_button");
const fileInput = document.getElementById("resume_input");
const fileDisplay = document.getElementById("file_name_display");

uploadButton.addEventListener("click", () => {
  fileInput.click(); // Simulate click on hidden input
});

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (file) {
    if (file.type !== "application/pdf") {
      uploadButton.textContent = "❌ Only PDF files allowed.";
      fileInput.value = ""; // reset the input
      return;
    }

    uploadButton.textContent = `${file.name}`;

    // Optional: store name or content in localStorage (mockup only)
    localStorage.setItem("resumeFileName", file.name);
  }
});