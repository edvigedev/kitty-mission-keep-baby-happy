//Script.js, houses the events listeners + make the game keyboard responsive

/*When you use window.onload = function () { ... }, you’re telling the browser to wait 
until everything on the page has loaded, and then execute the code inside the function.*/
let myGame;
window.onload = function () {
  //declared globally to allow the start of the game

  const startBtn = document.getElementById("start-button");

  startBtn.addEventListener("click", function () {
    startGame();
  });

  //keydown for listening to keyboard
  document.addEventListener("keydown", (event) => {
    if (event.code === "ArrowRight") {
      myGame.player.directionX = 2;
    }
    if (event.code === "ArrowLeft") {
      myGame.player.directionX = -2;
    }
    if (event.code === "ArrowUp") {
      myGame.player.directionY = -2;
    }
    if (event.code === "ArrowDown") {
      myGame.player.directionY = 2;
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
  }
};
