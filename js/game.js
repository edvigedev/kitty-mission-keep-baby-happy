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

    // Initialize player and game objects
    this.obstacles = [new Obstacle()];
    this.treats = [new Treat()];
    this.projectiles = [];

    // Game score, lives, and status
    this.score = 0;
    this.lives = 3;
    this.isGameover = false;

    // Game loop control
    this.gameIntervalId = null;
    this.gameLoopFrequency = Math.round(1000 / 60);
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
    this.backGroundMusic.volume = 0.1;

    //this establishes if the player can shoot or not
    this.canShoot = true;
  }

  start() {
    // Start the game: hide start screen, show game screen, reset stats, and play music
    this.startScreen.style.display = "none";
    this.gameScreen.style.display = "flex";
    //play background music
    this.backGroundMusic.loop = true;
    this.backGroundMusic.play();

    this.isGameover = false;
    this.frames = 0;

    //add heart elements to the lives
    this.updateLifeHearts();

    /*start the game loop
    The setInterval function creates a loop that calls this.gameLoop() every 
    this.gameLoopFrequency milliseconds. This creates a game loop 
    that updates at a fixed frequency.*/
    this.gameIntervalId = setInterval(() => {
      this.gameLoop();
    }, this.gameLoopFrequency);
  }

  gameLoop() {
    this.frames++;
    this.update();

    // Stop game loop if game is over
    if (this.isGameover) {
      clearInterval(this.gameIntervalId);
      this.gameOver();
      this.backGroundMusic.pause();
    }

    // Add a new obstacle every 120 frames and treat every 100 frames

    if (this.frames % 120 === 0) {
      this.obstacles.push(new Obstacle());
    }

    if (this.frames % 100 === 0) {
      this.treats.push(new Treat());
    }
  }

  update() {
    // Move player and obstacles, and check for collisions
    this.player.move(); // .move() is in the player class

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

      // Handle collision between player and obstacle, it returns true or false
      const didHitSashi = this.player.didCollide(oneObstacle);
      //if the obstacle hits the player, substracts a life, remove obstacle from array and remove from the DOM
      if (didHitSashi) {
        console.log("Collision with obstacle detected");

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
        // this.angry.play().catch((error) => {
        //   console.error("Error playing angry sound:", error);
        // });

        // End the game if lives reach zero
        if (this.lives === 0) {
          this.isGameover = true;
        }
      }
    });
    // Handle collision between obstacle and projectile, it returns true or false
    this.projectiles.forEach((oneProjectile, projectileIndex) => {
      oneProjectile.move();
      this.obstacles.forEach((oneObstacle, obstacleIndex) => {
        //check if the projectile collide with the obstacle
        if (oneProjectile.didCollide(oneObstacle)) {
          this.score += 2;
          //update the score DOM to the new value
          this.scoreElement.innerText = this.score;

          // Get collision position
          const collisionX =
            //X-coordinate of the obstacle's left edge
            oneObstacle.element.offsetLeft +
            //X-ccordinate of the center of the obstacle
            oneObstacle.element.offsetWidth / 2;

          const collisionY =
            //Y-coordinate of the obstacle's top edge
            oneObstacle.element.offsetTop +
            //Y-coordinate of the center of the obstacle
            oneObstacle.element.offsetHeight / 2;

          // Trigger particle effect at collision point
          this.createParticles(collisionX, collisionY);

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

  //create the particles at specific coordinates
  createParticles(x, y) {
    const particleCount = 10; // Number of particles
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      particle.classList.add("particle");
      this.gameScreen.appendChild(particle); // Append particle to the game screen

      //randomize particle movement

      //Random direction: multiplying Math.random by 2 * Math.PI (about 6.283) converts it
      //to an angle in radians between 0 and 2π, which represents a full circle in trigonometry,
      // and the direction of the movements of the particles.
      //This direction is anywhere in a full 360 degrees circle

      const angle = Math.random() * 2 * Math.PI;
      const speed = Math.random() * 8 + 1; // Random speed between 1 and 9

      //to move the particles outward of the collision point
      //we multiply the speed and the vectors
      const velocityX = Math.cos(angle) * speed;
      const velocityY = Math.sin(angle) * speed;

      // Apply the particle animation
      particle.animate(
        [
          { transform: `translate(0, 0)`, opacity: 1 },
          {
            transform: `translate(${velocityX * 20}px, ${velocityY * 20}px)`,
            opacity: 0,
          },
        ],
        {
          duration: 500, // Duration in ms
          easing: "ease-out",
        }
      );

      // Remove particle after animation completes
      setTimeout(() => {
        particle.remove();
      }, 500);
    }
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

    // after setting all the scores, add the scores to the DOM
    topThree.forEach((oneScore) => {
      const liElement = document.createElement("li");
      liElement.innerText = oneScore;
      this.highScoresElement.appendChild(liElement);
    });
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
