//Script.js, houses the events listeners + make the game keyboard responsive

/*When you use window.onload = function () { ... }, you’re telling the browser to wait 
until everything on the page has loaded, and then execute the code inside the function.*/
let myGame;
window.onload = function () {
  //declared globally to allow the start of the game

  const startBtn = document.getElementById("start-button");
  const restartBtn = document.getElementById("restart-button");

  restartBtn.addEventListener("click", () => {
    restartGame();
  });

  startBtn.addEventListener("click", function () {
    startGame();
  });

  //keydown for listening to keyboard
  document.addEventListener("keydown", (event) => {
    if (event.code === "ArrowRight") {
      myGame.player.directionX = 5;
    }
    if (event.code === "ArrowLeft") {
      myGame.player.directionX = -5;
    }
    if (event.code === "ArrowUp") {
      myGame.player.directionY = -5;
    }
    if (event.code === "ArrowDown") {
      myGame.player.directionY = 5;
    }
  });
  //keyup for listening to keyboard
  document.addEventListener("keyup", () => {
    myGame.player.directionX = 0;
    myGame.player.directionY = 0;
  });

  function startGame() {
    // console.log("start game");
    //this has to be made global
    myGame = new Game();
    myGame.start();
    //manage the screens
    document.getElementById("start-screen").style.display = "none";
    document.getElementById("game-screen").style.display = "flex";
    document.getElementById("end-screen").style.display = "none";
    document.getElementById("stats").style.display = "flex";
  }

  function restartGame() {
    clearGameScreen(); // Clear game screen

    // Reset screens
    document.getElementById("start-screen").style.display = "none";
    document.getElementById("game-screen").style.display = "flex";
    document.getElementById("end-screen").style.display = "none";

    // Reset and start a new game
    myGame = new Game();
    myGame.score = 0;
    myGame.lives = 3;
    document.getElementById("score").innerText = myGame.score;
    document.getElementById("lives").innerText = myGame.lives;
    myGame.start();
  }
  function clearGameScreen() {
    const gameScreen = document.getElementById("game-screen");
    gameScreen.innerHTML = ""; // Clear all child elements
  }
};
