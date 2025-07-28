import React, { useState } from "react";
import "./App.css";

// Color palette from requirements
const COLORS = {
  primary: "#1976d2",
  secondary: "#424242",
  accent: "#ffb300",
};

// --- BOARD LOGIC ---
const emptyBoard = () => Array(9).fill(null);

// PUBLIC_INTERFACE
function App() {
  // Game state
  const [board, setBoard] = useState(emptyBoard());
  const [isXNext, setIsXNext] = useState(true);
  const [status, setStatus] = useState("playing"); // 'playing' | 'win' | 'draw'
  const [winner, setWinner] = useState(null);

  // Compute and memoize winner after move
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2], // rows
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6], // columns
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8], // diagonals
      [2, 4, 6],
    ];
    for (let line of lines) {
      const [a, b, c] = line;
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }
    return null;
  }

  // PUBLIC_INTERFACE
  function handleSquareClick(idx) {
    // No action if already has winner, draw, or square is occupied
    if (status !== "playing" || board[idx]) return;

    const boardCopy = [...board];
    boardCopy[idx] = isXNext ? "X" : "O";
    const win = calculateWinner(boardCopy);

    if (win) {
      setBoard(boardCopy);
      setStatus("win");
      setWinner(win);
    } else if (boardCopy.every((cell) => cell !== null)) {
      setBoard(boardCopy);
      setStatus("draw");
      setWinner(null);
    } else {
      setBoard(boardCopy);
      setIsXNext((prev) => !prev);
    }
  }

  // PUBLIC_INTERFACE
  function resetGame() {
    setBoard(emptyBoard());
    setIsXNext(true);
    setStatus("playing");
    setWinner(null);
  }

  let message = "";
  if (status === "win") {
    message = (
      <>
        <span style={{ color: COLORS.accent, fontWeight: 600 }}>
          {winner}
        </span>{" "}
        wins! 🎉
      </>
    );
  } else if (status === "draw") {
    message = (
      <span style={{ color: COLORS.secondary, fontWeight: 500 }}>It's a draw.</span>
    );
  } else {
    message = (
      <>
        Turn:&nbsp;
        <span
          style={{
            color: isXNext ? COLORS.primary : COLORS.accent,
            fontWeight: 600,
            letterSpacing: "2px",
          }}
        >
          {isXNext ? "X" : "O"}
        </span>
      </>
    );
  }

  return (
    <div className="tic-tac-toe-app">
      <div className="ttt-container">
        <h1 className="ttt-title">Tic Tac Toe</h1>
        <div className="ttt-message" role="status" aria-live="polite">
          {message}
        </div>
        <Board
          squares={board}
          onSquareClick={handleSquareClick}
          disabled={status !== "playing"}
        />
        <button className="ttt-reset-btn" onClick={resetGame}>
          Reset
        </button>
      </div>
      <footer className="ttt-footer">
        <span>
          Minimalistic Tic Tac Toe –{" "}
          <span style={{ color: COLORS.primary, fontWeight: 500 }}>React</span>
        </span>
      </footer>
    </div>
  );
}

// PUBLIC_INTERFACE
function Board({ squares, onSquareClick, disabled }) {
  return (
    <div className="ttt-board" style={{}}>
      {squares.map((val, i) => (
        <Square
          key={i}
          value={val}
          onClick={() => onSquareClick(i)}
          disabled={!!val || disabled}
        />
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
function Square({ value, onClick, disabled }) {
  return (
    <button
      className="ttt-square"
      onClick={onClick}
      disabled={disabled}
      aria-label={`${
        value ? value : "Empty"
      } square${disabled ? " (disabled)" : ""}`}
      tabIndex={disabled ? -1 : 0}
    >
      {value}
    </button>
  );
}

export default App;
