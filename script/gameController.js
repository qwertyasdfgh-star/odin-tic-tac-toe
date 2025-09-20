import Gameboard from './gameboard.js';
import Player from './player.js';

const GameController = (() => {
  let players = [];
  let currentPlayerIndex = 0;
  let gameOver = false;

  const winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
  ];

  const startGame = (player1Name, player1Icon, player2Name, player2Icon, vsAI = false) => {
    players = [
      Player(player1Name, player1Icon, false),
      Player(player2Name, player2Icon, vsAI)
    ];
    currentPlayerIndex = 0;
    gameOver = false;
    Gameboard.reset();
  };

  const getCurrentPlayer = () => players[currentPlayerIndex];

  const playTurn = (index) => {
    if (gameOver) return false;

    const currentPlayer = getCurrentPlayer();
    const success = Gameboard.setMark(index, currentPlayer.markIcon);

    if (!success) return false;

    if (checkWin(currentPlayer.markIcon)) {
      gameOver = true;
      return { type: 'win', message: `${currentPlayer.name} wins!` };
    }

    if (checkTie()) {
      gameOver = true;
      return { type: 'tie', message: "It's a tie!" };
    }

    currentPlayerIndex = 1 - currentPlayerIndex;
    return { type: 'next', message: `${players[currentPlayerIndex].name}'s turn` };
  };

  const checkWin = (markIcon) => {
    const board = Gameboard.getBoard();
    return winningCombos.some(combo =>
      combo.every(index => board[index] === markIcon)
    );
  };

  const checkTie = () => {
    const board = Gameboard.getBoard();
    return board.every(cell => cell !== null);
  };

  const isGameOver = () => gameOver;

  const getEmptyCells = () => {
    const board = Gameboard.getBoard();
    return board.reduce((acc, cell, idx) => {
      if (cell === null) acc.push(idx);
      return acc;
    }, []);
  };

  return { startGame, getCurrentPlayer, playTurn, isGameOver, getEmptyCells };
})();

export default GameController;
