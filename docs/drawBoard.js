//dessiner du plateu
function drawBoard() {
    boardCanvas.width = size;
    boardCanvas.height = size;

    boardContext.clearRect(0, 0, size, size);

    for (let i = 1; i <= boardSize; i++) {
        boardContext.beginPath();
        boardContext.moveTo(i * cellSize, 0.25 * cellSize);
        boardContext.lineTo(i * cellSize, size - 0.25 * cellSize);
        boardContext.stroke();

        boardContext.beginPath();
        boardContext.moveTo(0.25 * cellSize, i * cellSize);
        boardContext.lineTo(size - 0.25 * cellSize, i * cellSize);
        boardContext.stroke();
    }
}

//dessiner une pierre
function drawStone(i, j, color) {
    stoneContext.beginPath();
    stoneContext.arc((i + 1) * cellSize, (j + 1) * cellSize, cellSize * 2 / 5, 0, 2 * Math.PI);
    stoneContext.fillStyle = color;
    stoneContext.fill();
    stoneContext.stroke();
}

//supprimer une pierre
function clearStone(i, j) {
    const radius = cellSize * 3 / 5;
    stoneContext.clearRect((i + 1) * cellSize - radius, (j + 1) * cellSize - radius, radius * 2, radius * 2);
}

//dessiner toute les pierres
function drawStones() {
    stoneContext.clearRect(0, 0, stoneCanvas.width, stoneCanvas.height); // Effacer toutes les pierres
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (board[i][j] !== null) {
                drawStone(i, j, board[i][j]);
            }
        }
    }
}
