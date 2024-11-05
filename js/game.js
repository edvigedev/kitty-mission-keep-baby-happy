/*Game.js, first steps with the screen, the interval (the engine of the
game), and the update, where the "action" happens
We also have player as null initially and obstacle (array) empty
Obstacles handling (the class is in obstacle.js)*/

class Game {
  // code to be added
  constructor() {
    /*These properties store references to specific HTML elements by their IDs. 
                These elements are used to show different screens (start, game, end) and display 
                the score and lives during the game.*/
    this.startScreen = document.getElementById("start-screen");
    this.gameScreen = document.getElementById("game-screen");
    this.endScreen = document.getElementById("end-screen");
    this.scoreElement = document.getElementById("score");
    this.livesElement = document.getElementById("lives");

    /*Initialise the  player
                This initializes the player object using the Player class. 
                The parameters (1200, 500, "../images/sashi.png") are:
                1200: The initial x position of the player (Sashi), positioned towards the right side.
                500: The initial y position of the player.
                "../images/sashi.png": The file path for the player’s image 
                (in this case, an image of Sashi). */
    this.player = new Player(1200, 500);
    /* we do not put px to have the ability to change
              the unit of measurement later.*/

    /*These properties define the height and width of the game area.
                Here, it’s set to 600px by 500px, which is important
                for collision detection, player boundaries, and obstacle movement 
                within the game.*/

    // this.height = window.innerHeight;
    // this.width = window.innerWidth;

    /*This array stores obstacles in the game. Here, it starts with one obstacle created 
                by new Obstacle(this.gameScreen), where this.gameScreen provides a reference to the 
                game screen where obstacles will appear.*/
    this.obstacles = [new Obstacle()];
    this.treats = [];
    // this.obstacles = [new Obstacle(this.gameScreen)];

    /*These properties keep track of the player’s score and remaining lives.
                The game starts with a score of 0 and 3 lives.These values are  updated 
                as the game progresses, affecting win / lose conditions.*/
    this.score = 0;
    this.lives = 3;

    /*This boolean property indicates if the game is over (true) or still active (false). 
               It’s used to control the flow of the game, allowing the game loop to end when 
               isGameover is true. */
    this.isGameover = false;

    /*This variable holds the ID of the interval that controls the game loop. It’s initialized to null and 
               will store the interval ID when the loop is started. This ID can be used to stop the game 
               loop by calling clearInterval(this.gameIntervalId) if needed. */
    this.gameIntervalId = null;

    /*This.gameLoopFrequency, a number that indicates
              the interval in milliseconds at which the game loop will execute.This will give the 
              smooth illusion the cars are moving and makes it reacting to the keyboard*/

    this.gameLoopFrequency = Math.round(1000 / 60);

    /*This counts the number of frames that has passed since the game started, 
              which are useful to add obstacles every n frame.*/
    this.frames = 0;
  }

  start() {
    // window.addEventListener("resize", () => {
    //     this.gameScreen.style.height = `${window.innerHeight}px`;
    //     this.gameScreen.style.width = `${window.innerWidth}px`;
    // });

    //hide the start-screen
    this.startScreen.style.display = "none";
    //
    this.gameScreen.style.display = "flex";
    this.isGameover = false;
    this.frames = 0;

    /*start the game loop, aka turn on the engine
            The setInterval function creates a loop that calls this.gameLoop() every 
            this.gameLoopFrequency milliseconds. This creates a game loop 
            that updates at a fixed frequency.*/
    this.gameIntervalId = setInterval(() => {
      this.gameLoop();
    }, this.gameLoopFrequency);
  }

  /* Once the engine is on, the frames update and the player moves until it is gameover*/

  gameLoop() {
    // console.log('this is a game loop');
    this.frames++;
    this.update();

    // if gameover is true, we call the gameOver() method
    if (this.isGameover) {
      clearInterval(this.gameIntervalId);
      this.gameOver();
    }

    //this adds a new obstacle to the array every so many frames

    if (this.frames % 180 === 0) {
      this.obstacles.push(new Obstacle());
    }
  }

  update() {
    //this calls the move() method from the player class.
    this.player.move();
    //this calls the move method on each obstacle
    this.obstacles.forEach((oneObstacle, oneObstacleIndex) => {
      oneObstacle.move();
      //check that the obstacle passes the bottom, then remove it from the array and DOM
      if (oneObstacle.top > this.gameScreen.clientHeight) {
        //splice removes objects from the array
        this.obstacles.splice(oneObstacleIndex, 1);
        //the remove() method removes the obstacle from the game screen
        oneObstacle.element.remove();
      }
      //this checks each oneObstacle if it collided with my player, it returns true or false
      const didHitSashi = this.player.didCollide(oneObstacle);
      //if the obstacle hits Sashi, substracts a life, remove obstacle from array and remove from the DOM
      if (didHitSashi) {
        // - 1 life
        this.lives--;
        //update the lives DOM to the new value
        this.livesElement.innerText = this.lives;
        //splice the obstacle out of the array
        this.obstacles.splice(oneObstacleIndex, 1);
        oneObstacle.element.remove();
        // End the game if lives reach zero
        if (this.lives === 0) {
          this.isGameover = true;
        }
      }
    });
  }
  gameOver() {
    this.gameScreen.style.display = "none";
    this.endScreen.style.display = "flex";
  }
}

//   // this calls the move method from the player class
//   updateObstacle() {

//     //We need to do a loop on every obstacle and call the .method on each one, aka oneObstacle

//       //this checks if every obstacle has collided to the player- 60 times per second this will be checked
//       const hitByObstacle = this.player.didCollide(oneObstacle);
//       //console.warn() will log to the console in yellow, console.error() will log in red
//     //   console.warn("Collision?", hitByObstacle);

//       //conditional checking for collision
//       if (hitByObstacle) {
//         // we remove 1 life from the array and the DOM
//         this.lives--;
//         if (this.lives === 0) {
//           this.isGameover = true;
//         }
//         //we make it visible in the DOM
//         this.livesElement.innerText = this.lives;

//         //the obstacle does not disappear after hitting, we need to remove it
//         //we do not call oneObstacle.remove(), as this will equal to say I am calling a method to oneObstacle,
//         // and I have no method called remove()
//         oneObstacle.element.remove();
//         this.obstacles.splice(oneObstacleIndex, 1);
//       } else if (oneObstacle.isOutOfScreen()) {
//         // Remove obstacles that go off-screen
//         oneObstacle.element.remove();
//         this.obstacles.splice(oneObstacleIndex, 1);
//       }
//     });
//   }

//   updateTreat() {
//     this.treats.move();
//     //this calls the move method on each obstacle
//     //We need to do a loop on every obstacle and call the .method on each one, aka oneObstacle

//     this.treats.forEach((oneTreat, oneTreatIndex) => {
//       oneTreat.move();
//       //this checks if every obstacle has collided to the player- 60 times per second this will be checked
//       const hitByTreat = this.player.didCollide(oneTreat);
//       //console.warn() will log to the console in yellow, console.error() will log in red
//       console.log("Great Job!", hitByTreat);

//       //conditional checking for collision
//       if (hitByTreat) {
//         // we remove 1 life from the array and the DOM
//         this.score++;

//         //we make it visible in the DOM
//         this.scoreElement.innerText = this.score;

//         //the obstacle does not disappear after hitting, we need to remove it
//         //we do not call oneObstacle.remove(), as this will equal to say I am calling a method to oneObstacle,
//         // and I have no method called remove()
//         oneTreat.element.remove();
//       }
//     });
//   }
// }

// // + to the right, - to the left
// //to position Sashi to the center, we take into account the width of the screen
// // aka 500px, and the width of the cat, 75px
// //the center is around 250px,
