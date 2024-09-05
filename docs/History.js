//gestion de l'historique
function addMoveToHistory() {
    // Enregistrez une copie de l'état actuel du plateau et du joueur
    const boardCopy = board.map(row => [...row]);
    moveHistory = moveHistory.slice(0, currentMoveIndex + 1); // Supprimez les coups futurs si on annule un coup puis joue un nouveau coup
    moveHistory.push({
        "board": boardCopy,
        "player": currentPlayer,
        "turn": turnCount,
        "black": capturedBlackStones,
        "white": capturedWhiteStones
    });
    currentMoveIndex++;
}
function undoMove() {
    if (currentMoveIndex > 0) {
        currentMoveIndex--;
        const { board, currentPlayer } = moveHistory[currentMoveIndex];
        restoreGameState(board, currentPlayer);
    }
}
function redoMove() {
    if (currentMoveIndex < moveHistory.length - 1) {
        currentMoveIndex++;
        const { board, currentPlayer } = moveHistory[currentMoveIndex];
        restoreGameState(board, currentPlayer);
    }
}
function restoreGameState() {
    // Restaurer l'état du plateau et du joueur actif
    turnCount = moveHistory[currentMoveIndex]["turn"];
    currentPlayer = moveHistory[currentMoveIndex]["player"];
    board = moveHistory[currentMoveIndex]["board"].map(row => [...row]);
    capturedBlackStones = moveHistory[currentMoveIndex]["black"];
    capturedWhiteStones = moveHistory[currentMoveIndex]["white"];
    recharge();
}