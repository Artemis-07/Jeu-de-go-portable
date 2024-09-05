// script.js

const boardCanvas = document.getElementById('boardCanvas');
const stoneCanvas = document.getElementById('stoneCanvas');
const boardContext = boardCanvas.getContext('2d');
const stoneContext = stoneCanvas.getContext('2d');

let size=600;
let boardSize;
let cellSize;
let board;

let currentPlayer = 'black';
let turnCount = 1;  
let capturedBlackStones = 0;
let capturedWhiteStones = 0;

let moveHistory = [];
let currentMoveIndex = -1;


document.addEventListener('DOMContentLoaded', (event) => { //charger les données de la dernière session
    // Charger les données sauvegardées
    if (localStorage.getItem('turn')) {
        boardSize = parseInt(localStorage.getItem('boardSize'));
        cellSize = localStorage.getItem('cellSize');
        turnCount = localStorage.getItem('turn');
        currentPlayer = localStorage.getItem('player');
        board = JSON.parse(localStorage.getItem('board'));
        capturedBlackStones = parseInt(localStorage.getItem('blackPoints'));
        capturedWhiteStones = parseInt(localStorage.getItem('whitePoints'));
        updateInformation();
        drawBoard();
        drawStones();
    }
});

function saveData() { //sauvegarder les données
    localStorage.setItem('turn', turnCount);
    localStorage.setItem('player', currentPlayer);
    localStorage.setItem('board', JSON.stringify(board));
    localStorage.setItem('blackPoints', capturedBlackStones);
    localStorage.setItem('whitePoints', capturedWhiteStones);
}

function startGame() { //initialisation du jeu
    stoneContext.clearRect(0, 0, stoneCanvas.width, stoneCanvas.height); // Effacer toutes les pierres
    boardSize = parseInt(document.getElementById('board-size').value);
    localStorage.setItem('boardSize', boardSize);
    cellSize = size / (boardSize + 1);
    localStorage.setItem('cellSize', cellSize);
    if (cellSize < 20) { //vérifier que les cases sont d'une taille suffisante
        cellSize = 20
        size = cellSize * (boardSize + 1)
    } else {
        size=600;
    }
    board = Array(boardSize).fill().map(() => Array(boardSize).fill(null));
    capturedBlackStones = 0;
    capturedWhiteStones = 0;
    currentPlayer = 'black';
    turnCount = 0;
    moveHistory = [];
    currentMoveIndex = -1;
    addMoveToHistory();
    updateInformation();
    drawBoard();
}

//fonction de jeu
stoneCanvas.addEventListener('click', (event) =>{ //lorsque que l'utilisateur clique sur le plateau
    const rect = stoneCanvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const i = Math.round(x / cellSize - 1);
    const j = Math.round(y / cellSize - 1);

    if ( i >= 0 && i < boardSize && j >= 0 && j < boardSize && board[i][j] === null) {
        board[i][j] = currentPlayer;
        drawStone(i, j, currentPlayer);
        checkAndCapture(i, j, currentPlayer);
        if (currentMoveIndex > 1 && board === moveHistory[currentMoveIndex-1]["board"]) {
            board = moveHistory[currentMoveIndex]["board"];
            recharge()
        } else {
            nextMove()
        }
    }
});

function nextMove() { //passer le tour
    if (currentPlayer==='white') {
        turnCount++ ;
    } 
    currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
    addMoveToHistory();
    saveData();
    updateInformation();
}

function updateInformation() { //mise à jour de l'affichage des information pour l'utilisateur
    document.getElementById('turn-counter').textContent = turnCount;
    document.getElementById('current-player').style.backgroundColor = currentPlayer;
    document.getElementById('captured-whites-stones').textContent = capturedWhiteStones;
    document.getElementById('captured-blacks-stones').textContent = capturedBlackStones;
}

function captureStones(x, y, color) {   //tester quelles pierres sont controllées
    const opponentColor = color === 'black' ? 'white' : 'black';
    let capturedStones = [];
    let visited = Array(boardSize).fill().map(() => Array(boardSize).fill(false));

    function isCaptured(x, y) {
        if (x < 0 || x >= boardSize || y < 0 || y >= boardSize) {
            return true; // bord du plateau
        }
        if (board[x][y] === null) {
            return false; // espace libre
        }
        if (board[x][y] === color) {
            return true; // pierre alliée
        }
        if (visited[x][y]) {
            return true; // déjà visité
        }
        visited[x][y] = true;

        if (board[x][y] === opponentColor) {
            // Ajout de la pierre adverse à la liste des pierres capturées potentielles
            capturedStones.push([x, y]);

            // Vérification des 4 directions
            if (isCaptured(x - 1, y) && isCaptured(x + 1, y) && isCaptured(x, y - 1) && isCaptured(x, y + 1)) {
                return true;
            } else {
                // Si une direction n'est pas capturée, la région n'est pas capturée
                return false;
            }
        }
        return true;
    }

    if (isCaptured(x, y)) {
        return capturedStones;
    } else {
        return []; // pas de pierres capturées
    }
}

function checkAndCapture(x, y, color) { //foncion de capture de pierre
    const opponentColor = color === 'black' ? 'white' : 'black';
    let totalCaptured = 0 ;     

    // Vérification des 4 directions pour capturer les pierres adverses
    const directions = [
        [x - 1, y],
        [x + 1, y],
        [x, y - 1],
        [x, y + 1]
    ];

    directions.forEach(([dx, dy]) => {
        let captured = captureStones(dx, dy, color);
        if (captured.length > 0) {
            totalCaptured += captured.length;
            for (let stone of captured) {
                board[stone[0]][stone[1]] = null; // enlever les pierres capturées du plateau
                clearStone(stone[0], stone[1]);
            }
        }
    });

    
    if (totalCaptured > 0) {
        // Mettre à jour les compteurs de pierres capturées
        if (color === 'white') {
            capturedBlackStones += totalCaptured;
        } else {
            capturedWhiteStones += totalCaptured;
        }
        return;
    }

    // Si aucune pierre adverse n'a été capturée, vérifier si la pierre placée est capturée
    let captured = captureStones(x, y, opponentColor);
    if (captured.length > 0) {
        for (let stone of captured) {
            board[stone[0]][stone[1]] = null; // enlever les pierres capturées du plateau
            clearStone(stone[0], stone[1]);
        }

        // Mettre à jour les compteurs de pierres capturées
        if (color === 'white') {
            capturedWhiteStones += captured.length;
        } else {
            capturedBlackStones += captured.length;
        }
    }
}

function recharge() { //recharger le plateau
    stoneContext.clearRect(0, 0, stoneCanvas.width, stoneCanvas.height);
    boardContext.clearRect(0, 0, size, size);
    drawBoard();
    drawStones();
    updateInformation();
}


document.getElementById('arrow-container').addEventListener('click', () => { //Fait descendre un ruban en haut de l'écran avec les information utile
    const infoRibbon = document.getElementById('info-ribbon');
    const arrow = document.getElementById('arrow');
    
    if (infoRibbon.style.height === '0px' || infoRibbon.style.height === '') {
        infoRibbon.style.height = '1cm';
        arrow.style.transform = 'rotate(180deg)'; // Pointe vers le haut
    } else {
        infoRibbon.style.height = '0px';
        arrow.style.transform = 'rotate(0deg)'; // Pointe vers le bas
    }
});