// Variables and utilities
const DEFAULT_COLOR = "#333333";
const DEFAULT_MODE = "color";
const DEFAULT_SIZE = 16;

let currentColor = DEFAULT_COLOR;
let currentMode = DEFAULT_MODE;
let currentSize = DEFAULT_SIZE;

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
const colorBtn = document.getElementById("colorBtn");
const rainbowBtn = document.getElementById("rainbowBtn");
const gradientBtn = document.getElementById("gradientBtn");
const eraserBtn = document.getElementById("eraserBtn");
const clearBtn = document.getElementById("clearBtn");
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
  clearGrid();
  setupGrid(currentSize);
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
  } else if (currentMode === "eraser") {
    e.target.style.backgroundColor = "#fefefe";
  } else if (currentMode === "gradient") {
    // Nee to fix it :c
    let opacity = 0;
    const interval = setInterval(() => {
      if (opacity >= 1) {
        clearInterval(interval);
      } else {
        opacity += 0.1;
        e.target.style.backgroundColor = `rgba(0, 0, 0, ${opacity})`;
      }
    }, 100);
  }
}

function activateButton(newMode) {
  switch (newMode) {
    case "rainbow":
      rainbowBtn.classList.add("active");
      break;
    case "color":
      colorBtn.classList.add("active");
      break;
    case "eraser":
      eraserBtn.classList.add("active");
      break;
    case "gradient":
      gradientBtn.classList.add("active");
      break;
    default:
      console.error("Invalid mode:", newMode);
  }
}

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

// Reload the page
window.onload = () => {
  setupGrid(DEFAULT_SIZE);
  activateButton(DEFAULT_MODE);
  clickedBtn();
};
