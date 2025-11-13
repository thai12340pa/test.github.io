document.addEventListener('DOMContentLoaded', () => {
    // Game state
    const gridSize = 4;
    let grid = [];
    let score = 0;
    let bestScore = localStorage.getItem('bestScore') || 0;
    let gameOver = false;
    let win = false;

    // DOM Elements
    const gridContainer = document.getElementById('grid');
    const scoreDisplay = document.getElementById('score');
    const bestScoreDisplay = document.getElementById('best-score');
    const newGameBtn = document.getElementById('new-game-btn');
    const tryAgainBtn = document.getElementById('try-again-btn');
    const gameMessage = document.getElementById('game-message');
    const messageText = document.getElementById('message-text');

    // Initialize game
    function initGame() {
        createGrid();
        resetGame();
        updateBestScore();
        
        // Event listeners
        document.addEventListener('keydown', handleKeyPress);
        newGameBtn.addEventListener('click', resetGame);
        tryAgainBtn.addEventListener('click', resetGame);
    }
    // Create grid structure
    function createGrid() {
        gridContainer.innerHTML = '';
        for (let i = 0; i < gridSize * gridSize; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            gridContainer.appendChild(cell);
        }
    }
// Reset game state
    function resetGame() {
        // Reset game state
        grid = Array(gridSize).fill().map(() => Array(gridSize).fill(0));
        score = 0;
        gameOver = false;
        win = false;
        
        // Update UI
        updateScore();
        hideMessage();
        
        // Add initial tiles
        addRandomTile();
        addRandomTile();
        
        // Render grid
        renderGrid();
    }

    // Add a random tile (2 or 4) to an empty cell
    function addRandomTile() {
        const emptyCells = [];
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                if (grid[row][col] === 0) {
                    emptyCells.push({ row, col });
                }
            }
        }
        
        if (emptyCells.length > 0) {
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            // 90% chance for 2, 10% chance for 4
            grid[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    // Render grid to the DOM
    function renderGrid() {
        const cells = gridContainer.querySelectorAll('.cell');
        
        // Clear existing tiles
        cells.forEach(cell => {
            while (cell.firstChild) {
                cell.removeChild(cell.firstChild);
            }
        });
        
        // Add tiles
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                const value = grid[row][col];
                if (value !== 0) {
                    const tile = document.createElement('div');
                    tile.className = `tile tile-${value}`;
                    tile.textContent = value;
                    cells[row * gridSize + col].appendChild(tile);
                }
            }
        }
    }

    // Handle keyboard input
    function handleKeyPress(e) {
        if (gameOver) return;
        
        let moved = false;
        
        switch(e.key) {
            case 'ArrowUp':
                moved = moveUp();
                break;
            case 'ArrowDown':
                moved = moveDown();
                break;
            case 'ArrowLeft':
                moved = moveLeft();
                break;
            case 'ArrowRight':
                moved = moveRight();
                break;
            default:
                return; // Exit for irrelevant keys
        }
        
        if (moved) {
            addRandomTile();
            renderGrid();
            checkGameStatus();
        }
    }

    // Move functions
    function moveLeft() {
        let moved = false;
        
        for (let row = 0; row < gridSize; row++) {
            const originalRow = [...grid[row]];
            const newRow = grid[row].filter(val => val !== 0);
            
            // Merge tiles
            for (let i = 0; i < newRow.length - 1; i++) {
                if (newRow[i] === newRow[i + 1]) {
                    newRow[i] *= 2;
                    newRow[i + 1] = 0;
                    score += newRow[i];
                }
            }
            
            // Remove zeros after merge
            const mergedRow = newRow.filter(val => val !== 0);
            
            // Pad with zeros
            while (mergedRow.length < gridSize) {
                mergedRow.push(0);
            }
            
            // Update grid
            grid[row] = mergedRow;
            
            // Check if row changed
            if (!arraysEqual(originalRow, grid[row])) {
                moved = true;
            }
        }
        
        return moved;
    }

    function moveRight() {
        let moved = false;
        
        for (let row = 0; row < gridSize; row++) {
            const originalRow = [...grid[row]];
            let newRow = grid[row].filter(val => val !== 0);
            
            // Merge tiles
            for (let i = newRow.length - 1; i > 0; i--) {
                if (newRow[i] === newRow[i - 1]) {
                    newRow[i] *= 2;
                    newRow[i - 1] = 0;
                    score += newRow[i];
                }
            }
            
            // Remove zeros after merge
            newRow = newRow.filter(val => val !== 0);
            
            // Pad with zeros at the beginning
            while (newRow.length < gridSize) {
                newRow.unshift(0);
            }
            
            // Update grid
            grid[row] = newRow;
            
            // Check if row changed
            if (!arraysEqual(originalRow, grid[row])) {
                moved = true;
            }
        }
        
        return moved;
    }

    function moveUp() {
        let moved = false;
        
        for (let col = 0; col < gridSize; col++) {
            const originalCol = getColumn(col);
            let newCol = originalCol.filter(val => val !== 0);
            
            // Merge tiles
            for (let i = 0; i < newCol.length - 1; i++) {
                if (newCol[i] === newCol[i + 1]) {
                    newCol[i] *= 2;
                    newCol[i + 1] = 0;
                    score += newCol[i];
                }
            }
            
            // Remove zeros after merge
            newCol = newCol.filter(val => val !== 0);
            
            // Pad with zeros
            while (newCol.length < gridSize) {
                newCol.push(0);
            }
            
            // Update grid
            setColumn(col, newCol);
            
            // Check if column changed
            if (!arraysEqual(originalCol, getColumn(col))) {
                moved = true;
            }
        }
        
        return moved;
    }

    function moveDown() {
        let moved = false;
        
        for (let col = 0; col < gridSize; col++) {
            const originalCol = getColumn(col);
            let newCol = originalCol.filter(val => val !== 0);
            
            // Merge tiles
            for (let i = newCol.length - 1; i > 0; i--) {
                if (newCol[i] === newCol[i - 1]) {
                    newCol[i] *= 2;
                    newCol[i - 1] = 0;
                    score += newCol[i];
                }
            }
            
            // Remove zeros after merge
            newCol = newCol.filter(val => val !== 0);
            
            // Pad with zeros at the beginning
            while (newCol.length < gridSize) {
                newCol.unshift(0);
            }
            
            // Update grid
            setColumn(col, newCol);
            
            // Check if column changed
            if (!arraysEqual(originalCol, getColumn(col))) {
                moved = true;
            }
        }
        
        return moved;
    }

    // Helper functions for columns
    function getColumn(colIndex) {
        return grid.map(row => row[colIndex]);
    }

    function setColumn(colIndex, newCol) {
        for (let i = 0; i < gridSize; i++) {
            grid[i][colIndex] = newCol[i];
        }
    }

    // Utility function to compare arrays
    function arraysEqual(a, b) {
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }

    // Check game status (win/lose)
    function checkGameStatus() {
        updateScore();
        
        // Check for win
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                if (grid[row][col] === 2048 && !win) {
                    win = true;
                    showMessage("You Win!");
                    return;
                }
            }
        }
        
        // Check for possible moves
        if (isGameOver()) {
            gameOver = true;
            showMessage("Game Over!");
        }
    }

    // Check if no moves are possible
    function isGameOver() {
        // Check for empty cells
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                if (grid[row][col] === 0) {
                    return false;
                }
            }
        }
        
        // Check for possible merges horizontally
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize - 1; col++) {
                if (grid[row][col] === grid[row][col + 1]) {
                    return false;
                }
            }
        }
        
        // Check for possible merges vertically
        for (let col = 0; col < gridSize; col++) {
            for (let row = 0; row < gridSize - 1; row++) {
                if (grid[row][col] === grid[row + 1][col]) {
                    return false;
                }
            }
        }
        
        return true;
    }

    // Update score display
    function updateScore() {
        scoreDisplay.textContent = score;
        if (score > bestScore) {
            bestScore = score;
            localStorage.setItem('bestScore', bestScore);
            updateBestScore();
        }
    }
    // Update best score display
    function updateBestScore() {
        bestScoreDisplay.textContent = bestScore;
    }

    // Show game message (win/game over)
    function showMessage(text) {
        messageText.textContent = text;
        gameMessage.classList.remove('hidden');
    }

    // Hide game message
    function hideMessage() {
        gameMessage.classList.add('hidden');
    }

    // Initialize the game when the page loads
    initGame();
});

