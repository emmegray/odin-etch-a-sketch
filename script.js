// Variables and utilities
const DEFAULT_COLOR = "#333333";
const DEFAULT_MODE = "color";
const DEFAULT_SIZE = 16;
const DEFAULT_OPACITY = 0;
const CONTAINER = document.querySelector(".container");

let currentColor = DEFAULT_COLOR;
let currentMode = DEFAULT_MODE;
let currentSize = DEFAULT_SIZE;
let currentOpacity = DEFAULT_OPACITY;

let clickCount = 0;

function setCurrentColor(newColor) {
  currentColor = newColor;
}

function setCurrentMode(newMode) {
  activateButton(newMode);
  currentMode = newMode;
}

function setCurrentSize(newSize) {
  currentSize = newSize;
}

// Button
const colorPicker = document.getElementById("colorPicker");
const bgColorPicker = document.getElementById("bgColorPicker");
const colorBtn = document.getElementById("colorBtn");
const rainbowBtn = document.getElementById("rainbowBtn");
const gradientBtn = document.getElementById("gradientBtn");
const eraserBtn = document.getElementById("eraserBtn");
const clearBtn = document.getElementById("clearBtn");
const confirmBtn = document.getElementById("confirmBtnReset");
const cancelBtn = document.getElementById("cancelBtnReset");
const sizeValue = document.getElementById("sizeValue");
const sizeSlider = document.getElementById("sizeSlider");
const grid = document.getElementById("grid");

// Functions
colorPicker.oninput = (e) => setCurrentColor(e.target.value);
colorBtn.onclick = () => setCurrentMode("color");
rainbowBtn.onclick = () => setCurrentMode("rainbow");
eraserBtn.onclick = () => setCurrentMode("eraser");
gradientBtn.onclick = () => setCurrentMode("gradient");

clearBtn.onclick = () => reloadGrid();

sizeSlider.onmousemove = (e) => updateSizeValue(e.target.value);
sizeSlider.onchange = (e) => changeSize(e.target.value);

let mouseDown = false;
document.body.onmousedown = () => (mouseDown = true);
document.body.onmouseup = () => (mouseDown = false);

function changeSize(value) {
  setCurrentSize(value);
  updateSizeValue(value);
  reloadGrid();
}

function updateSizeValue(value) {
  sizeValue.innerHTML = `${value} x ${value}`;
}

function reloadGrid() {
  CONTAINER.style.display = 'block';
  confirmBtn.classList.remove("clicked");  
  cancelBtn.classList.remove("clicked");

  confirmBtn.addEventListener("click", () => {
    clearGrid();
    setupGrid(currentSize);
    CONTAINER.style.display = 'none';
  });

  cancelBtn.addEventListener("click", () => {
    CONTAINER.style.display = 'none';
  });
}

function clearGrid() {
  grid.innerHTML = "";
}

function setupGrid(size) {
  grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  grid.style.gridTemplateRows = `repeat(${size}, 1fr)`;

  for (let i = 0; i < size * size; i++) {
    const gridElement = document.createElement("div");
    gridElement.classList.add("grid-element");
    gridElement.addEventListener("mouseover", changeColor);
    gridElement.addEventListener("mousedown", changeColor);
    grid.appendChild(gridElement);
  }
}

// Colors
function changeColor(e) {
  if (e.type === "mouseover" && !mouseDown) return;

  if (currentMode === "rainbow") {
    const randomR = Math.floor(Math.random() * 256);
    const randomG = Math.floor(Math.random() * 256);
    const randomB = Math.floor(Math.random() * 256);
    e.target.style.backgroundColor = `rgb(${randomR}, ${randomG}, ${randomB})`;
  } else if (currentMode === "color") {
    e.target.style.backgroundColor = currentColor;
    document.getElementById("iconColorBtn").style.color = currentColor;
  } else if (currentMode === "gradient") {

        // WIP still not working :c

        // Incrementa il contatore dei click
        // clickCount++;

        // Calcola il valore di luminosità (da 0 a 255)
        // const brightness = Math.min(255, Math.floor((clickCount / 100) * 255));
    
        // Imposta il colore di sfondo in base alla luminosità
        // e.target.style.backgroundColor = `rgb(${brightness}, ${brightness}, ${brightness})`;
        
      } else if (currentMode === "eraser") {
    e.target.style.backgroundColor = "#fefefe";
  }
}

// Change color to Brush Icon when select a color
document.getElementById("iconColorBtn").style.color = currentColor;

function activateButton(newMode) {
  const modes = ["rainbow", "eraser"];
  modes.forEach(mode => {
    const btn = document.querySelector("#" + mode + "Btn");
    if (currentMode === mode) {
      btn.classList.remove("active");
    }
    if (newMode === mode) {
      btn.classList.add("active");
    }
  });
}

// BTN clicked
function clickedBtn() {
  let lastClickedBtn = null;
  const btn = document.getElementsByTagName("button");
  for (let i = 0; i < btn.length; i++) {
    btn[i].addEventListener("click", function () {
      if (lastClickedBtn !== null) {
        lastClickedBtn.classList.remove("clicked");
      }
      this.classList.toggle("clicked");
      lastClickedBtn = this;
    });
  }
}

// WIP Screenshot
const screenshotBtn = document.querySelector("#screenBtn");
screenshotPreview = document.querySelector(".src-preview");
closeBtn = screenshotPreview.querySelector("#close-btn");

const captureScreen = async () => {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({ preferCurrentTab: true });
    const video = document.createElement("video");

    video.addEventListener("loadedmetadata", () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      video.play();
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      stream.getVideoTracks()[0].stop();

      screenshotPreview.querySelector("img").src = canvas.toDataURL();
      screenshotPreview.classList.add("show");
    });
    video.srcObject = stream;
  } catch (error) {
    alert("Failed to capture screenshot, try again");
  }
}

closeBtn.addEventListener("click", () => screenshotPreview.classList.toogle("show"));
screenshotBtn.addEventListener("click", captureScreen);
// Can't save the image :c

// Reload the page
window.onload = () => {
  setupGrid(DEFAULT_SIZE);
  activateButton(DEFAULT_MODE);
  clickedBtn();
};
