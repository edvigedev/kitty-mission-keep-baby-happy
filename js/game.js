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
    this.highScoresElement = document.getElementById("high-scores");
    this.finalscoreElement = document.getElementById("final-score");
    this.finalLivesElement = document.getElementById("final-lives");
    this.finalStatsElement = document.getElementById("final-stats");

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
    this.treats = [new Treat()];
    this.projectiles = [];
    // this.obstacles = [new Obstacle(this.gameScreen)];
    //

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
    //adding audio effects
    this.purr = new Audio("audio/purr.mp3");
    this.angry = new Audio("audio/angry.mp3");
    this.angry.volume = 0.2;
    this.laugh = new Audio("audio/laugh.mp3");
    this.laugh.volume = 0.5;
    this.cry = new Audio("audio/cry.mp3");
    this.cry.volume = 0.2;

    //adding audio background
    this.backGroundMusic = new Audio("audio/background.mp3");
    // this.backgroundMusic.loop = true; // Set it to loop continuously
    this.backGroundMusic.volume = 0.1; // avoid the full volume

    //this establishes if the player can shoot or not
    this.canShoot = true;
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
    //play background music
    this.backGroundMusic.loop = true;
    this.backGroundMusic.play();

    this.isGameover = false;
    this.frames = 0;

    //add heart elements to the lives
    this.updateLifeHearts();

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
      this.backGroundMusic.pause();
    }

    //this adds a new obstacle to the array every so many frames

    if (this.frames % 100 === 0) {
      this.obstacles.push(new Obstacle());
    }

    if (this.frames % 100 === 0) {
      this.treats.push(new Treat());
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
        console.log("Collision with obstacle detected");
        // - 1 life
        this.lives--;
        //update the lives DOM to the new value (this is for number as a life)
        this.livesElement.innerText = this.lives;
        //update the lives DOM with an image
        this.updateLifeHearts();
        //splice the obstacle out of the array
        this.obstacles.splice(oneObstacleIndex, 1);
        oneObstacle.element.remove();
        //play angry sound on collision
        this.angry.play();
        this.angry.play().catch((error) => {
          console.error("Error playing angry sound:", error);
        });

        // End the game if lives reach zero
        if (this.lives === 0) {
          this.isGameover = true;
        }
      }
    });



    this.projectiles.forEach((oneProjectile, projectileIndex) => {
      oneProjectile.move();
      this.obstacles.forEach((oneObstacle, obstacleIndex) => {
        //check if the projectile collide with the obstacle
        if (oneProjectile.didCollide(oneObstacle)) {
          this.score += 2;
          //update the score DOM to the new value
          this.scoreElement.innerText = this.score;
          //splice the projectile and obstacle out of the array
          this.projectiles.splice(projectileIndex, 1);
          oneProjectile.element.remove();
          this.obstacles.splice(obstacleIndex, 1);
          oneObstacle.element.remove();
        }
      });
    });

    this.treats.forEach((oneTreat, oneTreatIndex) => {
      oneTreat.move();
      //check that the treat passes the bottom, then remove it from the array and DOM
      if (oneTreat.top > this.gameScreen.clientHeight) {
        //splice removes objects from the array
        this.treats.splice(oneTreatIndex, 1);
        //the remove() method removes the treat from the game screen
        oneTreat.element.remove();
      }
      //this checks each oneTreat if it collided with my player, it returns true or false
      const treatHitSashi = this.player.didCollide(oneTreat);

      //set the super treat
      const isSpecialTreat = oneTreat.element.src.includes("happy_baby.png");
      //if the obstacle hits Sashi, add a score point, remove the treat from the array and
      //remove the treat from the DOM
      if (treatHitSashi) {
        if (isSpecialTreat && this.lives < 3) {
          console.log("Collision with special treat detected");
          this.lives += 1;
          this.livesElement.innerText = this.lives;
          this.updateLifeHearts();
          this.treats.splice(oneTreatIndex, 1);
          oneTreat.element.remove();
          // play laughing sound when colliding with a special treat
          this.laugh.play();
          this.laugh.play().catch((error) => {
            console.error("Error playing laugh sound:", error);
          });
        } else {
          console.log("Collision with treat detected");
          // - 1 life
          this.score++;
          //update the score DOM to the new value
          this.scoreElement.innerText = this.score;
          //splice the treat out of the array
          this.treats.splice(oneTreatIndex, 1);
          oneTreat.element.remove();
          // play purr sound when colliding with a treat
          this.purr.play();
          this.purr.volume = 1.0;
        }
      }
    });
  }

  gameOver() {
    console.log("Game Over triggered");
    console.log("Final Score:", this.score);
    console.log("Final Lives:", this.lives);
    this.gameScreen.style.display = "none";
    this.endScreen.style.display = "flex";
    this.finalStatsElement.style.display = "flex";

    //update the final stats
    this.finalscoreElement.innerText = this.score;
    this.finalLivesElement.innerText = this.lives;

    //make baby cry
    this.cry.play();

    //storing the high scores, we cannot use arrays, this.score has to be stringified

    //we have to convert into an array first, and then push
    // Safely retrieve high scores from localStorage or initialize as an empty array
    // Retrieve high scores from localStorage, or initialize as an empty array if not found
    let scoresInLocalStorage;
    const storedScores = localStorage.getItem("highScores");

    if (storedScores) {
      try {
        scoresInLocalStorage = JSON.parse(storedScores);
      } catch (error) {
        console.error("Error parsing highScores from localStorage:", error);
        scoresInLocalStorage = []; // Fallback to an empty array on error
      }
    } else {
      scoresInLocalStorage = []; // Initialize as an empty array if not present
    }

    // Add the current score to the array and sort the scores
    scoresInLocalStorage.push(parseInt(this.score));
    scoresInLocalStorage.sort((a, b) => b - a);
    const topThree = scoresInLocalStorage.slice(0, 3);

    // Save updated top three scores back to local storage
    localStorage.setItem("highScores", JSON.stringify(topThree));

    // Add high scores to the DOM
    const highScoresList = document.getElementById("high-scores");
    highScoresList.innerHTML = ""; // Clear any existing list items

    // if (scoresInLocalStorage) {
    //   //this is AFTER the first game, when there are scores
    //   scoresInLocalStorage.push(this.score);
    //   //after pushing, we sort descending
    //   scoresInLocalStorage.sort((a, b) => b - a);
    //   //after sorting, splice only first 3 for the top 3 scores
    //   topThree = scoresInLocalStorage.slice(0, 3);
    //   localStorage.setItem("highScores", JSON.stringify(topThree));
    // } else {
    //   //this is the fist game with no scores in the local storage
    //   const currentScore = JSON.stringify(this.score);
    //   localStorage.setItem("highScores", currentScore);
    // }

    // after setting all the scores, add the scores to the DOM
    topThree.forEach((oneScore) => {
      const liElement = document.createElement("li");
      liElement.innerText = oneScore;
      this.highScoresElement.appendChild(liElement);
    });

    // // Display the final score and lives on the end screen
    // this.scoreElement.innerText = this.score;
    // this.livesElement.innerText = this.lives;
  }

  updateLifeHearts() {
    this.livesElement.innerHTML = "";
    for (let i = 0; i < this.lives; i++) {
      const imgElement = document.createElement("img");
      imgElement.src = "images/life.png";
      this.livesElement.appendChild(imgElement);
    }
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
