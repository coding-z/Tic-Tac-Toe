import { useState } from "react";
import clsx from "clsx";

function Square({ value, onSquareClick, isWin }) {
  return (
    <button
      className={clsx(
        "square",
        value === "X" && "x",
        value === "O" && "o",
        isWin && "win"
      )}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {  
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }

    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares, i);
  }

  const winnerSquares = calculateWinner(squares);
  const draw = !winnerSquares && !squares.includes(null);
  let status;
  let player;

  if (winnerSquares) {
    status = "Winner: ";
    player = squares[winnerSquares[0]];
  } else if (draw) {
    status = "Draw";
    player = undefined;
  } else {
    status = "Next player: ";
    player = (xIsNext ? "X" : "O");
  }
  
  return (
    <div className="game-main">
      <div className="status">
        {status}
        <span className={clsx(player === "X" ? "x" : "o")}>{player}</span>
      </div>
      <div className="game-board">
        {
          Array(9).fill(null).map((_, i) => (
            <Square
              key={i}
              value={squares[i]}
              onSquareClick={() => handleClick(i)}
              isWin={winnerSquares?.includes(i)}
            />
          ))
        }
      </div>
    </div>
  );
}

function HistoryItem({ move, description, onHistoryMoveClick }) {
  return (
    <li>
      <button
        className={clsx("history-item", (move % 2 || !move) ? "x" : "o")}
        onClick={onHistoryMoveClick}
      >
        {description}
      </button>
    </li>
  )
}

function History({ history, onMoveChange }) {
  function handleHistoryMoveClick(jumpToMove) {
    onMoveChange(jumpToMove);
  }

  
  const description = (move, coords) => {
    const movePlayer = move % 2 ? "X" : "O";
    const moveCoords = coords && `(${coords.row}, ${coords.col})`;

    if (move === 0) {
      return "Go to game start";
    } else if (move === history.length - 1) {
      return `At move #${move}: ${movePlayer} on ${moveCoords}`;
    } else {
      return `Go to move #${move}: ${movePlayer} on ${moveCoords}`;
    }
  };

  return (
    <div className="game-info">
      <ol>
        {history.map(({ board, moveCoords }, move) => (
          <HistoryItem
            key={move}
            move={move}
            description={description(move, moveCoords)}
            onHistoryMoveClick={() => handleHistoryMoveClick(move)}
          />
        ))}
      </ol>
    </div>
  );
}

export default function Game() {
  const [history, setHistory] = useState([{
    board: Array(9).fill(null),
    moveCoords: null
  }]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].board;

  function handlePlay(nextSquares, moveCoordIndex) {
    const coords = {
      row: Math.floor(moveCoordIndex / 3),
      col: moveCoordIndex % 3
    };
    const nextHistory = [
      ...history.slice(0, currentMove + 1),
      { board: nextSquares, moveCoords: coords }
    ];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }  
  
  return (
    <div className="game">
      <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      <History history={history} onMoveChange={setCurrentMove} />
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a, b, c];
    }
  }
  return null;
}
