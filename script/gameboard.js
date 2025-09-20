const Gameboard = (() => {
  const board = Array(9).fill(null);

  const getBoard = () => [...board];

  const setMark = (index, markIcon) => {
    if (index < 0 || index > 8 || board[index]) return false;
    board[index] = markIcon;
    return true;
  };

  const reset = () => {
    for (let i = 0; i < board.length; i++) {
      board[i] = null;
    }
  };

  return { getBoard, setMark, reset };
})();

export default Gameboard;
