// variables
const startButton = document.querySelector(".start-game-btn");
const initBoard = document.querySelector(".game-board");
const restartGameBtn = document.querySelector(".restart-game-btn");

// Game Board to show the cells when game start.
const GameBoard = (() => {
  let gameboard = ["", "", "", "", "", "", "", "", ""];

  const renderGame = () => {
    let boardHTML = "";
    gameboard.forEach((square, index) => {
      boardHTML += `<div class="square" id="square-${index}">${square}</div>`;
    });
    initBoard.innerHTML = boardHTML;
    const squares = document.querySelectorAll(".square");
    squares.forEach((square) => {
      square.addEventListener("click", StartGame.handleClickFn);
    });
  };

  const update = (index, value) => {
    gameboard[index] = value;
    renderGame();
  };

  //   Accessor function
  const getGameboard = () => gameboard;

  return { renderGame, update, getGameboard };
})();

// Function to display Messages of the Game
const messageController = (() => {
  const renderMessage = (message) => {
    document.querySelector(".message").innerHTML = message;
  };
  return {
    renderMessage,
  };
})();

// factory
const createPlayer = (name, mark) => {
  return {
    name,
    mark,
  };
};

const StartGame = (() => {
  let players = [];
  let currentPlayerIndex;
  let gameOver;

  const startingGame = () => {
    players = [
      createPlayer(document.getElementById("player1").value, "X"),
      createPlayer(document.getElementById("player2").value, "O"),
    ];

    if (!players) {
      console.log("add players name");
    }

    currentPlayerIndex = 0;
    gameOver = false;
    GameBoard.renderGame();
    const squares = document.querySelectorAll(".square");
    squares.forEach((square) => {
      square.addEventListener("click", handleClickFn);
    });
  };

  //   Handle Click Function for each cell
  const handleClickFn = (event) => {
    if (gameOver) {
      return;
    }
    let index = parseInt(event.target.id.split("-")[1]);
    if (GameBoard.getGameboard()[index] !== "") {
      return;
    }
    GameBoard.update(index, players[currentPlayerIndex].mark);
    currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;

    // To check if game is over
    if (
      checkForWin(GameBoard.getGameboard(), players[currentPlayerIndex].mark)
    ) {
      gameOver = true;
      messageController.renderMessage(
        `${players[currentPlayerIndex].name} wins the game🙌`
      );
    } else if (checkForTie(GameBoard.getGameboard())) {
      // To check if its a tie
      gameOver = true;
      messageController.renderMessage("It's  a Tie🤝");
    }
  };

  //   To restart game
  const restart = () => {
    for (let i = 0; i < 9; i++) {
      GameBoard.update(i, "");
    }
    GameBoard.renderGame();
    gameOver = false;
    document.querySelector(".message").innerHTML = "";
  };

  return { startingGame, handleClickFn, restart };
})();

// To check for win
function checkForWin(board) {
  const winninngCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < winninngCombinations.length; i++) {
    const [a, b, c] = winninngCombinations[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return true;
    }
  }
  return false;
}

// Function to check for tie
function checkForTie(board) {
  return board.every((cell) => cell !== "");
}

// Restart Game Event
restartGameBtn.addEventListener("click", () => {
  StartGame.restart();
});

// start game Event
startButton.addEventListener("click", () => {
  StartGame.startingGame();
});
