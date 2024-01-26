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

// Button and function
const colorPicker = document.getElementById("colorPicker");
const colorBtn = document.getElementById("colorBtn");
const rainbowBtn = document.getElementById("rainbowBtn");
const gradientBtn = document.getElementById("gradientBtn");
const eraserBtn = document.getElementById("eraserBtn");
const clearBtn = document.getElementById("clearBtn");
const sizeValue = document.getElementById("sizeValue");
const sizeSlider = document.getElementById("sizeSlider");
const grid = document.getElementById("grid");
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
    let opacity = 0.1;
    e.target.style.backgroundColor = "#000";
    e.target.style.opacity = opacity;
    e.target.addEventListener("mousedown", function () {
      const interval = setInterval(function () {
        if (opacity < 1) {
          opacity += 0.1;
          e.target.style.opacity = opacity;
        } else {
          clearInterval(interval);
        }
      }, 100);
    });
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

// Reload the page here
window.onload = () => {
  setupGrid(DEFAULT_SIZE);
  activateButton(DEFAULT_MODE);
  clickedBtn();
};
