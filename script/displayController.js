import Gameboard from './gameboard.js';
import GameController from './gameController.js';

const DisplayController = (() => {
    const welcomeScreen = document.getElementById('home');
    const letsPlayBtn = document.getElementById('home-btn');
    const mainContent = document.getElementById('main-content');
    const playerForm = document.getElementById('player-form');
    const gameContainer = document.getElementById('game-container');
    const boardElement = document.getElementById('board');
    const messageElement = document.getElementById('message');
    const currentPlayerElement = document.getElementById('current-player');
    const startButton = document.getElementById('start-game');
    const restartButton = document.getElementById('restart-game');
    const player1Input = document.getElementById('player1');
    const player2Input = document.getElementById('player2');
    const player2Container = document.getElementById('player2-container');
    const gameModeSelect = document.getElementById('game-mode');
  
    const player1Icons = document.querySelectorAll('#player1-icons button');
    const player2Icons = document.querySelectorAll('#player2-icons button');
  
    // Modal elements
    const resultModal = document.getElementById('result-modal');
    const modalMessage = document.getElementById('modal-message');
    const modalCloseBtn = document.getElementById('modal-close-btn');
  
    let vsAI = false;
    let aiThinking = false;
  
    // Default icons and colors
    let player1Icon = '<i class="fa-solid fa-star"></i>';
    let player2Icon = '<i class="fa-solid fa-heart"></i>';
    let player1IconColor = '#F59E0B'; // Tailwind amber-500 approx
    let player2IconColor = '#DC2626'; // Tailwind red-600
  
    const init = () => {
      createBoard();
      setupEventListeners();
      togglePlayer2Input();
      setupIconSelection();
      
      letsPlayBtn.addEventListener('click', () => {
        welcomeScreen.classList.add('hidden');
        mainContent.classList.remove('hidden');
        playerForm.classList.remove('hidden');
        gameContainer.classList.add('hidden');
        setMessage('');
      });
    };
    
  
    letsPlayBtn.addEventListener('click', () => {
      welcomeScreen.classList.add('hidden');
      mainContent.classList.remove('hidden');
      // Show player form and hide game container
      playerForm.classList.remove('hidden');
      gameContainer.classList.add('hidden');
      setMessage('');
      });
  
    const togglePlayer2Input = () => {
      if (gameModeSelect.value === 'pvc') {
        player2Input.value = 'Computer';
        player2Input.disabled = true;
        vsAI = true;
        player2Container.classList.add('opacity-70');
        disableIconButtons(player2Icons, true);
      } else {
        player2Input.value = 'Player 2';
        player2Input.disabled = false;
        vsAI = false;
        player2Container.classList.remove('opacity-70');
        disableIconButtons(player2Icons, false);
      }
    };
  
    const disableIconButtons = (buttons, disable) => {
      buttons.forEach(btn => {
        btn.disabled = disable;
        if (disable) {
          btn.classList.add('cursor-not-allowed', 'opacity-50');
        } else {
          btn.classList.remove('cursor-not-allowed', 'opacity-50');
        }
      });
    };
  
    gameModeSelect.addEventListener('change', () => {
      togglePlayer2Input();
    });
  
    // Setup icon selection with mutual exclusion and color tracking
    const setupIconSelection = () => {
      let selectedIconP1 = 'fa-star';
      let selectedIconP2 = 'fa-heart';
  
      player1Icons.forEach(btn => {
        btn.classList.remove('border-primary');
        if (btn.dataset.icon === selectedIconP1) {
          btn.classList.add('border-primary');
          player1Icon = btn.innerHTML;
          player1IconColor = btn.dataset.color || getComputedStyle(btn).color;
        }
      });
      player2Icons.forEach(btn => {
        btn.classList.remove('border-accent');
        if (btn.dataset.icon === selectedIconP2) {
          btn.classList.add('border-accent');
          player2Icon = btn.innerHTML;
          player2IconColor = btn.dataset.color || getComputedStyle(btn).color;
        }
      });
  
      player2Icons.forEach(btn => {
        btn.disabled = (btn.dataset.icon === selectedIconP1);
        btn.classList.toggle('opacity-50', btn.disabled);
        btn.classList.toggle('cursor-not-allowed', btn.disabled);
      });
  
      player1Icons.forEach(btn => {
        btn.disabled = (btn.dataset.icon === selectedIconP2);
        btn.classList.toggle('opacity-50', btn.disabled);
        btn.classList.toggle('cursor-not-allowed', btn.disabled);
      });
  
      player1Icons.forEach(btn => {
        btn.addEventListener('click', () => {
          if (btn.disabled) return;
  
          player1Icons.forEach(b => b.classList.remove('border-primary'));
          btn.classList.add('border-primary');
          player1Icon = btn.innerHTML;
          player1IconColor = btn.dataset.color || getComputedStyle(btn).color;
  
          player2Icons.forEach(b => {
            if (b.dataset.icon === selectedIconP1) {
              b.disabled = false;
              b.classList.remove('opacity-50', 'cursor-not-allowed');
            }
          });
  
          player2Icons.forEach(b => {
            if (b.dataset.icon === btn.dataset.icon) {
              b.disabled = true;
              b.classList.add('opacity-50', 'cursor-not-allowed');
            }
          });
  
          selectedIconP1 = btn.dataset.icon;
        });
      });
  
      player2Icons.forEach(btn => {
        btn.addEventListener('click', () => {
          if (btn.disabled) return;
  
          player2Icons.forEach(b => b.classList.remove('border-accent'));
          btn.classList.add('border-accent');
          player2Icon = btn.innerHTML;
          player2IconColor = btn.dataset.color || getComputedStyle(btn).color;
  
          player1Icons.forEach(b => {
            if (b.dataset.icon === selectedIconP2) {
              b.disabled = false;
              b.classList.remove('opacity-50', 'cursor-not-allowed');
            }
          });
  
          player1Icons.forEach(b => {
            if (b.dataset.icon === btn.dataset.icon) {
              b.disabled = true;
              b.classList.add('opacity-50', 'cursor-not-allowed');
            }
          });
  
          selectedIconP2 = btn.dataset.icon;
        });
      });
    };
  
    const createBoard = () => {
      boardElement.innerHTML = '';
      for (let i = 0; i < 9; i++) {
        const cell = document.createElement('button');
        cell.classList.add('cell', 'bg-primary', 'rounded-lg', 'aspect-square', 'text-4xl', 'flex', 'items-center', 'justify-center', 'transition', 'duration-200', 'hover:bg-primary/80');
        cell.dataset.index = i;
        boardElement.appendChild(cell);
      }
    };
  
    const render = () => {
      const board = Gameboard.getBoard();
      const cells = boardElement.querySelectorAll('.cell');
  
      cells.forEach((cell, index) => {
        const markIcon = board[index];
        if (markIcon) {
          if (markIcon === player1Icon) {
            cell.innerHTML = `<span style="color: ${player1IconColor}; filter: drop-shadow(0 0 3px ${player1IconColor});">${markIcon}</span>`;
          } else if (markIcon === player2Icon) {
            cell.innerHTML = `<span style="color: ${player2IconColor}; filter: drop-shadow(0 0 3px ${player2IconColor});">${markIcon}</span>`;
          } else {
            cell.innerHTML = markIcon;
          }
          cell.disabled = true;
        } else {
          cell.innerHTML = '';
          cell.disabled = false;
        }
      });
  
      if (GameController.isGameOver()) {
        currentPlayerElement.textContent = '';
      } else {
        const currentPlayer = GameController.getCurrentPlayer();
        currentPlayerElement.textContent = `${currentPlayer.name}'s turn`;
      }
    };
  
    const setMessage = (msg, isError = false) => {
      messageElement.textContent = msg;
      messageElement.className = 'text-center mt-6 text-lg font-semibold min-h-[2rem] ' +
        (isError ? 'text-destructive animate-pulse' : 'text-foreground');
    };
  
    // Modal functions
    const showModal = (message) => {
      modalMessage.textContent = message;
      resultModal.classList.remove('hidden');
      // Reset gameboard and state immediately
      Gameboard.reset();
      DisplayController.render();
    };
  
    const hideModal = () => {
      resultModal.classList.add('hidden');
    };
  
    modalCloseBtn.addEventListener('click', () => {
      hideModal();
      document.getElementById('home').classList.remove('hidden');
      document.getElementById('main-content').classList.add('hidden');
      setMessage('');
    });
  
    const setupEventListeners = () => {
      startButton.addEventListener('click', () => {
        const player1Name = player1Input.value.trim() || 'Player 1';
        const player2Name = player2Input.value.trim() || (vsAI ? 'Computer' : 'Player 2');
  
        GameController.startGame(player1Name, player1Icon, player2Name, player2Icon, vsAI);
        playerForm.classList.add('hidden');
        gameContainer.classList.remove('hidden');
        setMessage('');
        render();
  
        if (vsAI && GameController.getCurrentPlayer().isAI) {
          aiMove();
        }
      });
  
      restartButton.addEventListener('click', () => {
        playerForm.classList.remove('hidden');
        gameContainer.classList.add('hidden');
        setMessage('');
      });
  
      boardElement.addEventListener('click', async (e) => {
        if (aiThinking) return;
  
        const cell = e.target.closest('.cell');
        if (!cell) return;
        if (GameController.isGameOver()) return;
  
        const index = parseInt(cell.dataset.index);
        const currentPlayer = GameController.getCurrentPlayer();
  
        if (currentPlayer.isAI) return;
  
        const result = GameController.playTurn(index);
        if (!result) {
          setMessage('Invalid move! Try another cell.', true);
          return;
        }
  
        render();
  
        if (result.type === 'win' || result.type === 'tie') {
          showModal(result.message);
        } else {
          setMessage(result.message);
          if (vsAI && GameController.getCurrentPlayer().isAI) {
            await aiMove();
          }
        }
      });
    };
  
    const aiMove = async () => {
      aiThinking = true;
      setMessage("Computer is thinking...");
      await new Promise(r => setTimeout(r, 600));
  
      const emptyCells = GameController.getEmptyCells();
      if (emptyCells.length === 0) {
        aiThinking = false;
        return;
      }
  
      const choice = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      const result = GameController.playTurn(choice);
  
      render();
  
      if (result.type === 'win' || result.type === 'tie') {
        showModal(result.message);
      } else {
        setMessage(result.message);
      }
      aiThinking = false;
    };
  
    return { init, render };
  })();


export default DisplayController;