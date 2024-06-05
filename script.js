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

// Buttons Slider and Grid
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
    // GRADIENT - Working Process
  } else if (currentMode === "gradient") {
    let opacity = 0;    
    opacity = Math.min(opacity + 0.5, 1);
    e.target.style.opacity = 0.5;
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

// Screenshot
function capture() {
  const captureElement = document.querySelector("#capture")
  html2canvas(captureElement).then(canvas => {
    canvas.style.display = "none"
    document.body.appendChild(canvas)
    return canvas
  })
  .then(canvas => {
    const image = canvas.toDataURL("image/png")
    const a = document.createElement("a")
    a.setAttribute("download", "my-drawing.png")
    a.setAttribute("href", image)
    a.click()
    canvas.remove()
  })
}
const btn = document.querySelector("#screenBtn")
btn.addEventListener("click", capture)


// Reload the page
window.onload = () => {
  setupGrid(DEFAULT_SIZE);
  activateButton(DEFAULT_MODE);
  clickedBtn();
};
