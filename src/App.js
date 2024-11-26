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
    onPlay(nextSquares);
  }

  const winnerSquares = calculateWinner(squares);
  let status;
  let player;

  if (winnerSquares) {
    status = "Winner: ";
    player = squares[winnerSquares[0]];
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
        <Square
          value={squares[0]}
          onSquareClick={() => handleClick(0)}
          isWin={winnerSquares?.includes(0)}
        />
        <Square
          value={squares[1]}
          onSquareClick={() => handleClick(1)}
          isWin={winnerSquares?.includes(1)}
        />
        <Square
          value={squares[2]}
          onSquareClick={() => handleClick(2)}
          isWin={winnerSquares?.includes(2)}
        />
        <Square
          value={squares[3]}
          onSquareClick={() => handleClick(3)}
          isWin={winnerSquares?.includes(3)}
        />
        <Square
          value={squares[4]}
          onSquareClick={() => handleClick(4)}
          isWin={winnerSquares?.includes(4)}
        />
        <Square
          value={squares[5]}
          onSquareClick={() => handleClick(5)}
          isWin={winnerSquares?.includes(5)}
        />
        <Square
          value={squares[6]}
          onSquareClick={() => handleClick(6)}
          isWin={winnerSquares?.includes(6)}
        />
        <Square
          value={squares[7]}
          onSquareClick={() => handleClick(7)}
          isWin={winnerSquares?.includes(7)}
        />
        <Square
          value={squares[8]}
          onSquareClick={() => handleClick(8)}
          isWin={winnerSquares?.includes(8)}
        />
      </div>
    </div>
  );
}

function HistoryItem({ move, description, onHistoryMoveClick }) {
  return (
    <li>
      <button
        className={clsx("history-item", move % 2 ? "o" : "x")}
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

  const description = (move) => (
    move > 0 ? (
      move === history.length - 1 ? (
        "You are at move #" + move
      ) : (
        "Go to move #" + move
      )
    ) : (
      "Go to game start"
    )
  );

  return (
    <div className="game-info">
      <ol>
        {history.map((squares, move) => (
          <HistoryItem
            key={move}
            move={move}
            description={description(move)}
            onHistoryMoveClick={() => handleHistoryMoveClick(move)}
          />
        ))}
      </ol>
    </div>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
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
