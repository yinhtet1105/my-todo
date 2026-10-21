
"use strict";
const elements = {
  dropZone: document.getElementById("dropZone"),
  fileInput: document.getElementById("fileInput"),
  chooseBtn: document.getElementById("chooseBtn"),
  fileCard: document.getElementById("fileCard"),
  fileName: document.getElementById("fileName"),
  status: document.getElementById("status"),
  progressBar: document.getElementById("progressBar"),
  successText: document.getElementById("successText"),
  count: document.getElementById("count"),
  message: document.getElementById("message"),
  hint: document.getElementById("hint"),
  basketBall: document.getElementById("basketBall"),
};

const {
  dropZone,
  fileInput,
  chooseBtn,
  fileCard,
  fileName,
  status,
  progressBar,
  successText,
  count,
  message,
  hint,
  basketBall,
} = elements;



let uploadedCount = 0;
let uploadTimers = [];


const CONFIG = {
  allowedExtension: /\.docx$/i,
  progressSteps: [
    {
      delay: 150,
      progress: 35,
      text: "Document accepted...",
    },
    {
      delay: 400,
      progress: 70,
      text: "Processing document...",
    },
    {
      delay: 850,
      progress: 100,
      text: "✓ Demo completed successfully",
    },
  ],
};

const COLORS = {
  primary: "#625bd6",
  success: "#238453",
  error: "#c4364e",
};



function openFilePicker() {
  fileInput.click();
}

chooseBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  openFilePicker();
});

dropZone.addEventListener("click", (event) => {
  
  if (event.target.closest("#chooseBtn")) {
    return;
  }

  openFilePicker();
});

fileInput.addEventListener("change", (event) => {
  const file = event.target.files?.[0];

  if (file) {
    handleFile(file);
  }

  
  fileInput.value = "";
});


["dragenter", "dragover"].forEach((eventName) => {
  dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropZone.classList.add("dragover");

    hint.textContent = "Release to shoot! 🏀";
  });
});

["dragleave", "drop"].forEach((eventName) => {
  dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropZone.classList.remove("dragover");
  });
});

dropZone.addEventListener("drop", (event) => {
  const file = event.dataTransfer?.files?.[0];

  if (file) {
    handleFile(file);
  }
});


function clearUploadTimers() {
  uploadTimers.forEach((timer) => {
    clearTimeout(timer);
  });

  uploadTimers = [];
}

function scheduleUploadStep(callback, delay) {
  const timer = setTimeout(callback, delay);
  uploadTimers.push(timer);
}


function showMessage(text, color) {
  message.textContent = text;
  message.style.color = color;
}

function resetProgress() {
  progressBar.style.width = "0%";
  successText.textContent = "";
}

function resetAnimation() {
  basketBall.classList.remove("shoot");

  // Restart the CSS animation.
  void basketBall.offsetWidth;

  basketBall.classList.add("shoot");
}

function showFile(file) {
  fileCard.classList.add("show");
  fileName.textContent = file.name;

  status.textContent = "Processing...";
  successText.textContent = "Checking DOCX file...";
}

function showInvalidFile() {
  fileCard.classList.remove("show");
  resetProgress();

  showMessage(
    "❌ Only .docx files are allowed!",
    COLORS.error
  );

  hint.textContent = "Please choose a Word document.";
}


function isValidFile(file) {
  return CONFIG.allowedExtension.test(file.name);
}


function simulateUpload(file) {
  resetAnimation();
  showFile(file);
  resetProgress();

  status.textContent = "Processing...";

  showMessage(
    "🏀 Processing your document...",
    COLORS.primary
  );

  hint.textContent = "Please wait...";

  CONFIG.progressSteps.forEach((step, index) => {
    scheduleUploadStep(() => {
      progressBar.style.width = `${step.progress}%`;
      successText.textContent = step.text;

      if (index === CONFIG.progressSteps.length - 1) {
        status.textContent = "Done";

        showMessage(
          "🏀 Swish! Demo completed successfully!",
          COLORS.success
        );

        hint.textContent =
          "Nice shot! Choose another DOCX file.";

        uploadedCount += 1;
        count.textContent = `Uploaded ${uploadedCount}`;
      }
    }, step.delay);
  });
}


function handleFile(file) {
  clearUploadTimers();

  if (!isValidFile(file)) {
    showInvalidFile();
    return;
  }

  simulateUpload(file);
}


count.textContent = `Uploaded ${uploadedCount}`;
hint.textContent = "Choose or drop a DOCX file here.";
