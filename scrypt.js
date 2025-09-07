document.addEventListener('DOMContentLoaded', () => {
    // Game variables
    let cards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let moves = 0;
    let gameStarted = false;
    let timer = 0;
    let timerInterval;
    let boardSize = 16; // Default 4x4

    // DOM elements
    const gameBoard = document.getElementById('game-board');
    const movesCount = document.getElementById('moves-count');
    const timeElement = document.getElementById('time');
    const winMessage = document.getElementById('win-message');
    const restartBtn = document.getElementById('restart-btn');
    const newGameBtn = document.getElementById('new-game-btn');
    const difficultySelect = document.getElementById('difficulty');

    // Emoji symbols for cards
    const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦄', '🦋', '🐙', '🐠', '🐳'];

    // Initialize game
    function initGame() {
        clearInterval(timerInterval);
        moves = 0;
        matchedPairs = 0;
        flippedCards = [];
        timer = 0;
        gameStarted = false;
        movesCount.textContent = moves;
        timeElement.textContent = timer;
        winMessage.textContent = '';
        
        // Set board size based on difficulty
        const difficulty = difficultySelect.value;
        if (difficulty === 'easy') {
            boardSize = 12; // 4x3
            gameBoard.style.gridTemplateColumns = 'repeat(4, 1fr)';
        } else if (difficulty === 'medium') {
            boardSize = 16; // 4x4
            gameBoard.style.gridTemplateColumns = 'repeat(4, 1fr)';
        } else {
            boardSize = 24; // 6x4
            gameBoard.style.gridTemplateColumns = 'repeat(6, 1fr)';
        }
        
        generateCards();
        renderBoard();
    }

    // Generate card values
    function generateCards() {
        const pairs = boardSize / 2;
        const selectedEmojis = emojis.slice(0, pairs);
        
        // Create pairs of cards
        cards = [...selectedEmojis, ...selectedEmojis];
        
        // Shuffle the cards
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }
    }

    // Render the game board
    function renderBoard() {
        gameBoard.innerHTML = '';
        
        cards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.dataset.index = index;
            cardElement.textContent = card;
            cardElement.addEventListener('click', () => flipCard(cardElement, index));
            gameBoard.appendChild(cardElement);
        });
    }

    // Flip a card
    function flipCard(cardElement, index) {
        // Don't allow flipping if already flipped or matched
        if (cardElement.classList.contains('flipped') || cardElement.classList.contains('matched')) {
            return;
        }
        
        // Start timer on first card flip
        if (!gameStarted) {
            startTimer();
            gameStarted = true;
        }
        
        // Flip the card
        cardElement.classList.add('flipped');
        flippedCards.push({element: cardElement, index});
        
        // Check for a match if two cards are flipped
        if (flippedCards.length === 2) {
            moves++;
            movesCount.textContent = moves;
            
            const card1 = cards[flippedCards[0].index];
            const card2 = cards[flippedCards[1].index];
            
            if (card1 === card2) {
                // Match found
                flippedCards[0].element.classList.add('matched');
                flippedCards[1].element.classList.add('matched');
                flippedCards = [];
                matchedPairs++;
                
                // Check for win
                if (matchedPairs === boardSize / 2) {
                    endGame();
                }
            } else {
                // No match, flip back after a delay
                setTimeout(() => {
                    flippedCards[0].element.classList.remove('flipped');
                    flippedCards[1].element.classList.remove('flipped');
                    flippedCards = [];
                }, 1000);
            }
        }
    }

    // Start the game timer
    function startTimer() {
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timer++;
            timeElement.textContent = timer;
        }, 1000);
    }

    // End the game
    function endGame() {
        clearInterval(timerInterval);
        winMessage.textContent = `Congratulations! You won in ${moves} moves and ${timer} seconds!`;
    }

    // Event listeners
    restartBtn.addEventListener('click', initGame);
    newGameBtn.addEventListener('click', initGame);
    difficultySelect.addEventListener('change', initGame);

    // Initialize the game
    initGame();
});