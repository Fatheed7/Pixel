const canvas = document.getElementById('pixelCanvas');
const context = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const colorPaletteDiv = document.getElementById('colorPalette');
const lockedCells = new Set();
let isDrawing = false;
let colouredCells = 0;
let gameState = 0;
const filledCells = new Array(Object.keys(predefinedColors).length).fill(0);
let colorCounts = [];

const totalCells = grid.reduce((total, row) => total + row.length, 0);

function checkAllCellsColoured() {
    if (colouredCells === totalCells) {
        allCellsColoured();
    }
}

function countCellsByColor() {
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            const number = grid[y][x];
            const color = predefinedColors[number].hex;

            if (color) {
                if (colorCounts[color]) {
                    colorCounts[color]++;
                } else {
                    colorCounts[color] = 1;
                }
            }
        }
    }

    return colorCounts;
}

function generateRemainingColors() {
    for (let i = 0; i < Object.keys(predefinedColors).length; i++) {
        const remainingElement = document.querySelector('.remaining');
        const listItem = document.createElement('li');
        listItem.classList.add(`color-item-${i+1}`);
        listItem.textContent = `Color: ${predefinedColors[i+1].name}, Remaining: ${colorCounts[predefinedColors[i+1].hex]}`;
        remainingElement.appendChild(listItem);
    }
}


function updateRemainingColors(number, selectedColor) {
    const count = colorCounts[predefinedColors[number].hex] - filledCells[number - 1];
    const listItem = document.querySelector(`.color-item-${number}`);
    if (listItem) {
        listItem.textContent = `Color: ${predefinedColors[number].name}, Remaining: ${count}`;
    }
}


for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
        const number = grid[y][x];
        context.fillStyle = 'white';
        context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        context.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
        context.fillStyle = 'black';
        if (Number.isInteger(number)) {
            const textWidth = context.measureText(number.toString()).width;
            const textX = x * cellSize + (cellSize - textWidth) / 2;
            const textY = y * cellSize + cellSize / 2 + 5;
            context.fillText(number.toString(), textX, textY);
        }
    }
}

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);

for (const number in predefinedColors) {
    const color = predefinedColors[number].hex;
    const colorButton = document.createElement('button');
    colorButton.style.backgroundColor = color;
    colorButton.style.width = "40px";
    colorButton.style.height = "40px";
    colorButton.style.margin = '0 10px';
    if (number != 1) {
        colorButton.style.color = 'white';
    } else {
        colorButton.style.color = 'black';
    }
    colorButton.innerText = number;
    colorButton.addEventListener('click', function() {
        colorPicker.value = color;
        document.getElementById('currentColor').innerHTML = predefinedColors[number].name ;
        });
    colorPaletteDiv.appendChild(colorButton);
}



function startDrawing(event) {
    isDrawing = true;
    draw(event);
}

function draw(event) {
    if (!isDrawing) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const row = Math.floor(y / cellSize);
    const col = Math.floor(x / cellSize);

    if (row >= 0 && row < grid.length && col >= 0 && col < grid[row].length) {
        const number = grid[row][col];
        const selectedColor = getColor();
        const expectedColor = predefinedColors[number].hex;

        if (selectedColor === expectedColor) {
            context.fillStyle = selectedColor;
            context.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
            context.strokeRect(col * cellSize, row * cellSize, cellSize, cellSize);
            if (!lockedCells.has(`${col}-${row}`)){
                lockedCells.add(`${col}-${row}`);
                colouredCells++;
                filledCells[number - 1]++;
                }

            if (gameState === 0) {
            checkAllCellsColoured();
            updateRemainingColors(number, selectedColor);
            }
        }
    }
}

function stopDrawing() {
    isDrawing = false;
}


function getColor() {
    return colorPicker.value;
}

function allCellsColoured() {
    alert('All cells are colored!');
    gameState = 1;
}

countCellsByColor();
generateRemainingColors();