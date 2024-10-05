// var prompt = require("prompt-sync")({ sigint: true });
const boardElement = document.querySelector(".game-board");
const statusElement = document.querySelector(".game-status");
const resetButton = document.querySelector(".reset-button");
let boardboxes = document.querySelectorAll(".box");
let currentPlayerEl = document.querySelector(".curr-player");

const score0El = document.querySelector("#score-0");
const score1El = document.querySelector("#score-1");
const player0El = document.querySelector(".player-0");
const player1El = document.querySelector(".player-1");

const GameBoard = (function () {
  let board = [" ", " ", " ", " ", " ", " ", " ", " ", " "];

  function printBoard() {
    console.log(
      "\n" +
        " " +
        board[0] +
        " | " +
        board[1] +
        " | " +
        board[2] +
        "\n" +
        "---+---+---\n" +
        " " +
        board[3] +
        " | " +
        board[4] +
        " | " +
        board[5] +
        "\n" +
        "---+---+---\n" +
        " " +
        board[6] +
        " | " +
        board[7] +
        " | " +
        board[8] +
        "\n",
    );
    console.log(`\n`);
  }

  function placeMarker(pos, marker) {
    board[pos] = marker;
    boardboxes[pos].innerHTML = marker;
  }

  const winStates = [
    [0, 1, 2],
    [3, 4, 5],
    [0, 4, 8],
    [6, 4, 2],
    [6, 7, 8],
    [0, 3, 6],
    [2, 5, 8],
    [1, 4, 7],
  ];

  function checkForWin() {
    for (let [a, b, c] of winStates) {
      if (
        (board[a] === "x" && board[b] === "x" && board[c] === "x") ||
        (board[a] === "o" && board[b] === "o" && board[c] === "o")
      ) {
        boardboxes[a].classList.add("animate");
        boardboxes[b].classList.add("animate");
        boardboxes[c].classList.add("animate");
        return true;
      }
    }
  }

  function resetBoard() {
    board = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
  }

  return { board, printBoard, placeMarker, checkForWin, resetBoard };
})();

function Player(name, marker) {
  return { name, marker };
}

const playerName1 = document.querySelector(".p1");
const playerName2 = document.querySelector(".p2");
const updateNameBtn = document.querySelector(".setBtn");

const GameController = (() => {
  // let playerName1 = prompt("Enter your name: ");
  // let player1marker = prompt("choose 'x' or 'o' : ");

  let Player1 = Player("player1", "x");
  let Player2 = Player("player2", "o");

  let score0 = 0;
  let score1 = 0;
  // let playerName2 = prompt("Enter your name: ");
  score0El.innerHTML = score0;
  score1El.innerHTML = score1;

  let currentPlayer = Player1;
  let gameStatus = "playing";

  const initGame = () => {
    for (box of boardboxes) {
      box.classList.remove("animate");
    }
    currentPlayer = Player1;
    currentPlayerEl.textContent = currentPlayer.name;
    statusElement.textContent = "";
    gameStatus = "playing";
  };

  const updatePlayerNames = () => {
    const newName1 = playerName1.value.trim();
    const newName2 = playerName2.value.trim();

    if (newName1) {
      Player1.name = newName1;
      player0El.innerHTML = newName1;
    }
    if (newName2) {
      Player2.name = newName2;
      player1El.innerHTML = newName2;
    }

    currentPlayerEl.textContent = currentPlayer.name;
    updateNameInputs();
  };

  const updateNameInputs = () => {
    playerName1.value = Player1.name;
    playerName2.value = Player2.name;
  };

  const switchTurn = () => {
    currentPlayer = currentPlayer === Player1 ? Player2 : Player1;
    currentPlayerEl.textContent = currentPlayer.name;
  };

  const processMove = (position) => {
    if (gameStatus !== "playing") return;
    if (GameBoard.board[position] === " ") {
      GameBoard.placeMarker(position, currentPlayer.marker);
      checkGameStatus();
      if (gameStatus === "playing") {
        switchTurn();
      }
    } else {
      console.log("already marked! do again!");
    }
  };

  const checkGameStatus = () => {
    if (GameBoard.checkForWin() === true) {
      gameStatus = "win";
      announceResult();
      statusElement.innerHTML = currentPlayer.name + " Win";
      if (currentPlayer === Player1) {
        score0++;
        score0El.innerHTML = score0;
      } else {
        score1++;
        score1El.innerHTML = score1;
      }
    } else if (GameBoard.board.every((cell) => cell !== " ")) {
      gameStatus = "draw";
      statusElement.textContent = "It's a Draw!";
    }
  };

  const announceResult = () => {
    console.log(`${currentPlayer.name} Won the Game.`);
  };

  const playGame = () => {
    while (gameStatus === "playing") {
      console.log(`Current Player ${currentPlayer.name}.`);
      playTurn();
    }
  };

  return {
    initGame,
    processMove,
    playGame,
    currentPlayer,
    updatePlayerNames,
  };
})();

resetButton.addEventListener("click", () => {
  for (let i = 0; i < 9; i++) {
    GameBoard.board[i] = " ";
    boardboxes[i].innerHTML = GameBoard.board[i];
    GameController.initGame();
  }
});

for (let i = 0; i < 9; i++) {
  boardboxes[i].innerHTML = GameBoard.board[i];
  boardboxes[i].addEventListener("click", () => {
    console.log(`${i} clicked`);
    GameController.processMove(i);
  });
}

updateNameBtn.addEventListener("click", () => {
  GameController.updatePlayerNames();
});

document.querySelector(".setBtn").addEventListener("click", () => {
  document.querySelector(".game").classList.remove("hidden");
  document.querySelector(".name-input").classList.add("hidden");
});
