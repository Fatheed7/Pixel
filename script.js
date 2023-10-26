const canvas = document.getElementById('pixelCanvas');
const context = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const colorPaletteDiv = document.getElementById('colorPalette');
const cellSize = 40;
const lockedCells = new Set();
let isDrawing = false;
let colouredCells = 0;
let gameState = 0;

const predefinedColors = {
    1: '#ffffff', // White
    2: '#000000', // Black
    3: '#ff0000', // Red
};

const grid = [
    [1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1],
    [1, 1, 2, 2, 3, 3, 3, 2, 1, 1, 2, 3, 3, 3, 2, 2, 1, 1],
    [1, 2, 3, 3, 3, 3, 3, 3, 2, 2, 3, 3, 3, 3, 3, 3, 2, 1],
    [1, 2, 3, 3, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 1],
    [2, 3, 3, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2],
    [2, 3, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2],
    [2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2],
    [2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2],
    [1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 1],
    [1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 1],
    [1, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 1, 1],
    [1, 1, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 1, 1, 1],
    [1, 1, 1, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 2, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 2, 3, 3, 3, 3, 3, 3, 2, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 2, 3, 3, 3, 3, 2, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 2, 3, 3, 2, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1]
];

const totalCells = grid.reduce((total, row) => total + row.length, 0);

function checkAllCellsColoured() {
    if (colouredCells === totalCells) {
        allCellsColoured();
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
    const color = predefinedColors[number];
    const colorButton = document.createElement('button');
    colorButton.style.backgroundColor = color;
    colorButton.style.width = '40px';
    colorButton.style.height = '40px';
    colorButton.style.margin = '0 10px';
    if (number != 1) {
        colorButton.style.color = 'white';
    } else {
        colorButton.style.color = 'black';
    }
    colorButton.innerText = number;
    colorButton.addEventListener('click', function() {
        colorPicker.value = color;
        switch (color){
        case '#ffffff':
            document.getElementById('currentColor').innerHTML = 'White';
            break;
        case '#000000':
            document.getElementById('currentColor').innerHTML = 'Black';
            break;
        case '#ff0000':
            document.getElementById('currentColor').innerHTML = 'Red';
            break;
        }
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

    const cellSize = 40;
    const row = Math.floor(y / cellSize);
    const col = Math.floor(x / cellSize);

    if (row >= 0 && row < grid.length && col >= 0 && col < grid[row].length) {
        const number = grid[row][col];
        const selectedColor = getColor();
        const expectedColor = predefinedColors[number];

        if (selectedColor === expectedColor) {
            context.fillStyle = selectedColor;
            context.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
            context.strokeRect(col * cellSize, row * cellSize, cellSize, cellSize);
            if (!lockedCells.has(`${col}-${row}`)){
                lockedCells.add(`${col}-${row}`);
                colouredCells++;
                }

            if (gameState === 0) {
            checkAllCellsColoured();
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
