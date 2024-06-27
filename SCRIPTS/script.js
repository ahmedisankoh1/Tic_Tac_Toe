const board = document.getElementById('board');
var cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('reset');
const toggleModeButton = document.getElementById('toggle-mode');
const messageDisplay = document.getElementById('message');
const difficultySelect = document.getElementById('difficulty');
let currentPlayer = 'X';
let boardState = ['', '', '', '', '', '', '', '', ''];
let aiMode = true; // Default mode is single-player against AI
let gameOver = false; // Flag to check if the game is over

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick, { once: true });
});

resetButton.addEventListener('click', resetGame);
toggleModeButton.addEventListener('click', toggleMode);

function handleCellClick(event) {
    if (gameOver) return;

    const cell = event.target;
    const index = cell.getAttribute('data-index');

    if (boardState[index] === '') {
        boardState[index] = currentPlayer;
        cell.textContent = currentPlayer;

        const winningCombination = checkWin(currentPlayer);
        if (winningCombination) {
            highlightWinningCells(winningCombination);
            gameOver = true;
            displayMessage(`${currentPlayer} wins!`);
        } else if (boardState.every(cell => cell !== '')) {
            gameOver = true;
            displayMessage('Draw!');
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            if (aiMode && currentPlayer === 'O') {
                setTimeout(makeAIMove, 1000); // AI waits for 1 second before making a move
            }
        }
    }
}

function makeAIMove() {
    if (gameOver) return;

    const difficulty = difficultySelect.value;
    let bestMove;

    switch (difficulty) {
        case 'easy':
            bestMove = getRandomMove();
            break;
        case 'medium':
            bestMove = getMediumMove();
            break;
        case 'hard':
            bestMove = minimax(boardState, currentPlayer).index;
            break;
    }

    boardState[bestMove] = currentPlayer;
    cells[bestMove].textContent = currentPlayer;
    cells[bestMove].removeEventListener('click', handleCellClick);

    const winningCombinationAI = checkWin(currentPlayer);
    if (winningCombinationAI) {
        highlightWinningCells(winningCombinationAI);
        gameOver = true;
        displayMessage(`${currentPlayer} wins!`);
    } else if (boardState.every(cell => cell !== '')) {
        gameOver = true;
        displayMessage('Draw!');
    } else {
        currentPlayer = 'X';
    }
}

function getRandomMove() {
    const availableMoves = boardState
        .map((cell, index) => cell === '' ? index : null)
        .filter(index => index !== null);
    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    return availableMoves[randomIndex];
}

function getMediumMove() {
    for (let combination of winningCombinations) {
        let [a, b, c] = combination;

        // AI wins
        if (boardState[a] === currentPlayer && boardState[b] === currentPlayer && boardState[c] === '') return c;
        if (boardState[a] === currentPlayer && boardState[b] === '' && boardState[c] === currentPlayer) return b;
        if (boardState[a] === '' && boardState[b] === currentPlayer && boardState[c] === currentPlayer) return a;

        // AI blocks player
        if (boardState[a] === 'X' && boardState[b] === 'X' && boardState[c] === '') return c;
        if (boardState[a] === 'X' && boardState[b] === '' && boardState[c] === 'X') return b;
        if (boardState[a] === '' && boardState[b] === 'X' && boardState[c] === 'X') return a;
    }

    // Fallback to random move if no strategic move found
    return getRandomMove();
}

function checkWin(player) {
    for (let combination of winningCombinations) {
        if (combination.every(index => boardState[index] === player)) {
            return combination;
        }
    }
    return null;
}

function highlightWinningCells(winningCombination) {
    winningCombination.forEach(index => {
        cells[index].classList.add('winning-cell');
    });
}

function displayMessage(message) {
    messageDisplay.textContent = message;
}

function minimax(newBoard, player) {
    const availSpots = newBoard.filter(s => s === '');

    if (checkWin('X')) {
        return { score: -10 };
    } else if (checkWin('O')) {
        return { score: 10 };
    } else if (availSpots.length === 0) {
        return { score: 0 };
    }

    const moves = [];
    for (let i = 0; i < newBoard.length; i++) {
        if (newBoard[i] === '') {
            const move = {};
            move.index = i;
            newBoard[i] = player;

            if (player === 'O') {
                const result = minimax(newBoard, 'X');
                move.score = result.score;
            } else {
                const result = minimax(newBoard, 'O');
                move.score = result.score;
            }

            newBoard[i] = '';
            moves.push(move);
        }
    }

    let bestMove;
    if (player === 'O') {
        let bestScore = -10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = 10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}

function resetGame() {
    boardState = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameOver = false;
    messageDisplay.textContent = '';
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('winning-cell');
        cell.addEventListener('click', handleCellClick, { once: true });
    });
}

function toggleMode() {
    aiMode = !aiMode;
    resetGame();
    toggleModeButton.textContent = aiMode ? 'Switch to Two Player Mode' : 'Switch to AI mode';
}
