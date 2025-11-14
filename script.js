document.addEventListener('DOMContentLoaded', () => {
    // Game elements
    const balanceElement = document.getElementById('balance');
    const betAmountElement = document.getElementById('bet-amount');
    const spinButton = document.getElementById('spin-btn');
    const betButton = document.getElementById('bet-btn');
    const reel1 = document.getElementById('reel1');
    const reel2 = document.getElementById('reel2');
    const reel3 = document.getElementById('reel3');
    const winMessage = document.getElementById('win-message');
    const winAmount = document.getElementById('win-amount');
    
    // Game state
    let balance = 1000;
    let betAmount = 10;
    let isSpinning = false;
    
    // Symbols for the slot machine
    const symbols = ['🍒', '🍋', '🍇', '⭐', '🔔', '💎', '🎰', '7️⃣'];
    
    // Lấy dữ liệu admin (ép biểu tượng ra)
    let adminSymbol = localStorage.getItem('adminSymbol') || null;

    // Cập nhật liên tục (phòng trường hợp admin đổi khi game đang mở)
    setInterval(() => {
        adminSymbol = localStorage.getItem('adminSymbol') || null;
    }, 1000);

    // Update balance display
    function updateBalance() {
        balanceElement.textContent = balance;
    }
    
    // Update bet amount display
    function updateBetAmount() {
        betAmountElement.textContent = betAmount;
    }
    
    // Change bet amount
    betButton.addEventListener('click', () => {
        if (isSpinning) return;
        
        if (betAmount === 10) {
            betAmount = 25;
        } else if (betAmount === 25) {
            betAmount = 50;
        } else if (betAmount === 50) {
            betAmount = 100;
         } else if (betAmount === 100) {
            betAmount = 10000;
        {
        } else {
            betAmount = 10;
        }
        
        updateBetAmount();
    });

    // Spin the reels
    spinButton.addEventListener('click', () => {
        if (isSpinning) return;
        if (balance < betAmount) {
            alert("Not enough balance!");
            return;
        }
        
        isSpinning = true;
        winMessage.classList.add('hidden');
        balance -= betAmount;
        updateBalance();
        
        // Add spinning animation
        document.querySelectorAll('.slot-reel').forEach(reel => {
            reel.classList.add('spinning');
        });
        
        // Generate random symbols or use admin override
        setTimeout(() => {
            let symbol1, symbol2, symbol3;

            if (adminSymbol) {
                // Nếu admin chọn biểu tượng, ép ra biểu tượng đó
                symbol1 = symbol2 = symbol3 = adminSymbol;
            } else {
                // Random bình thường
                symbol1 = symbols[Math.floor(Math.random() * symbols.length)];
                symbol2 = symbols[Math.floor(Math.random() * symbols.length)];
                symbol3 = symbols[Math.floor(Math.random() * symbols.length)];
            }
            
            reel1.textContent = symbol1;
            reel2.textContent = symbol2;
            reel3.textContent = symbol3;
            
            // Remove spinning animation
            document.querySelectorAll('.slot-reel').forEach(reel => {
                reel.classList.remove('spinning');
            });
            
            // Check for win
            if (symbol1 === symbol2 && symbol2 === symbol3) {
                let winValue = 0;
                switch(symbol1) {
                    case '🍒': winValue = 20; break;
                    case '🍋': winValue = 30; break;
                    case '🍇': winValue = 40; break;
                    case '⭐': winValue = 100; break;
                    case '🔔': winValue = 150; break;
                    case '💎': winValue = 200; break;
                    case '🎰': winValue = 500; break;
                    case '7️⃣': winValue = 1000; break;
                }
                
                winValue *= betAmount / 10; // Scale win based on bet
                balance += winValue;
                winAmount.textContent = winValue;
                winMessage.classList.remove('hidden');
                winMessage.classList.add('win-animation');
                
                // Remove animation class after animation completes
                setTimeout(() => {
                    winMessage.classList.remove('win-animation');
                }, 1000);
            }
            
            updateBalance();
            isSpinning = false;
        }, 1000);
    });

    // Initialize displays
    updateBalance();
    updateBetAmount();
});
