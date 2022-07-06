const tiles = document.querySelectorAll(".tile");
const board = document.querySelector(".board");
const turnIndicator = document.querySelector(".turn");
const xScore = document.querySelectorAll(".score-x");
const oScore = document.querySelectorAll(".score-o");
const tieScore = document.querySelectorAll(".score-tie");
const modal = document.querySelector(".modal");
const winModal = document.querySelector(".winner");
const restart = document.querySelector(".restart");
const reset = document.querySelector(".reset");
const home = document.querySelector(".logo");
const next = document.querySelector(".next-round");

const CIRCLE_CLASS = "o-mark";
const X_CLASS = "x-mark";

let circleTurn = false;
const winnningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

startGame();
function startGame() {
  circleTurn ? board.classList.add("o") : board.classList.add("x");
  const iconHTML = `
    <div class="icon">
      ${
        circleTurn
          ? '<i class="fa-solid fa-o"></i>'
          : '<i class="fa-solid fa-xmark"></i>'
      }
    </div>
    <span>TURN</span>
  `;
  turnIndicator.insertAdjacentHTML("afterbegin", iconHTML);
  localStorage.setItem("x-score", 0);
  localStorage.setItem("o-score", 0);
  localStorage.setItem("tie-score", 0);
  xScore.forEach(
    (score) => (score.textContent = localStorage.getItem("x-score"))
  );
  oScore.forEach(
    (score) => (score.textContent = localStorage.getItem("o-score"))
  );
  tieScore.forEach(
    (score) => (score.textContent = localStorage.getItem("tie-score"))
  );
}

tiles.forEach(
  (tile, i) => {
    tile.addEventListener("click", handleClick.bind(this, i));
  },
  { once: true }
);

function handleClick(i, e) {
  const tile = e.target;
  if (tile.classList.contains(X_CLASS) || tile.classList.contains(CIRCLE_CLASS))
    return;
  const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;
  // Mark
  placeMark(tile, currentClass, i);
  // Win
  if (checkWin(currentClass)) {
    endGame(false);
  } else if (isDraw()) {
    endGame(true);
    let cTiescore = localStorage.getItem("tie-score");
    localStorage.setItem("tie-score", ++cTiescore);
    tieScore.forEach((score) => {
      score.textContent = cTiescore;
    });
  } else {
    // Swapturn
    swapturn();
    // Change turn states
    setTurn();
  }
}

function checkWin(currentClass) {
  return winnningCombinations.some((combo) => {
    return combo.every((index) => {
      return tiles[index].classList.contains(currentClass);
    });
  });
}
function endGame(draw) {
  if (draw) {
    winModal.textContent = "Draw!";
  } else {
    winModal.textContent = `${circleTurn ? "O" : "X"} Wins!`;
  }
  tiles.forEach((tile) => (tile.style.pointerEvents = "none"));
  modal.style.visibility = "visible";

  if (!draw) {
    if (circleTurn) {
      let cOscore = localStorage.getItem("o-score");
      localStorage.setItem("o-score", ++cOscore);
      oScore.forEach((score) => {
        score.textContent = cOscore;
      });
    } else {
      let cXscore = localStorage.getItem("x-score");
      localStorage.setItem("x-score", ++cXscore);
      xScore.forEach((score) => {
        score.textContent = cXscore;
      });
    }
  }
}

function isDraw() {
  return [...tiles].every((tile) => {
    return (
      tile.classList.contains(X_CLASS) || tile.classList.contains(CIRCLE_CLASS)
    );
  });
}

function placeMark(tile, currentClass, i) {
  tile.classList.add(currentClass);
}

function swapturn() {
  circleTurn = !circleTurn;
}

function setTurn() {
  const iconHTML = `
    <div class="icon">
      ${
        circleTurn
          ? '<i class="fa-solid fa-o"></i>'
          : '<i class="fa-solid fa-xmark"></i>'
      }
    </div>
    <span>TURN</span>
  `;
  turnIndicator.innerHTML = "";
  turnIndicator.insertAdjacentHTML("afterbegin", iconHTML);
  board.classList.remove("o");
  board.classList.remove("x");
  circleTurn ? board.classList.add("o") : board.classList.add("x");
}

next.addEventListener("click", function () {
  modal.style.visibility = "hidden";
  tiles.forEach((tile) => {
    tile.classList.remove(X_CLASS);
    tile.classList.remove(CIRCLE_CLASS);
    tile.style.pointerEvents = "auto";
  });
});

restart.addEventListener("click", function () {
  location.reload();
});

reset.addEventListener("click", function () {
  location.reload();
});

home.addEventListener("click", function () {
  window.location.href = "index.html";
});
