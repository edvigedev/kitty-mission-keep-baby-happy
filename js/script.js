//Script.js, houses the events listeners + make the game keyboard responsive

/*When you use window.onload = function () { ... }, you’re telling the browser to wait 
until everything on the page has loaded, and then execute the code inside the function.*/

window.onload = function () {
    //declared globally to allow the start of the game
    let myGame;
  const startBtn = document.getElementById("start-button");

  startBtn.addEventListener("click", function () {
    startGame();
  });
}

function startGame() {
    // console.log("start game");
    //this has to be made global
    let myGame = new Game();
    myGame.start();
}