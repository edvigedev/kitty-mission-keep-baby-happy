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

        /*actual player
            This initializes the player object using the Player class. 
            The parameters (380, 50, "../images/sashi.png") are:
            380: The initial x position of the player (Sashi), positioned towards the right side.
            50: The initial y position of the player.
            "../images/sashi.png": The file path for the player’s image 
            (in this case, an image of Sashi). */
        this.player = null;

        // this.player = new Player(380, 50, "../images/sashi.png");
        /* we do not put px to have the ability to change
          the unit of measurement later.*/

        /*These properties define the height and width of the game area.
            Here, it’s set to 600px by 500px, which is important
            for collision detection, player boundaries, and obstacle movement 
            within the game.*/

        this.height = window.innerHeight;
        this.width = window.innerWidth;

        /*This array stores obstacles in the game. Here, it starts with one obstacle created 
            by new Obstacle(this.gameScreen), where this.gameScreen provides a reference to the 
            game screen where obstacles will appear.*/
        this.obstacle = [];
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
        window.addEventListener("resize", () => {
            this.gameScreen.style.height = `${window.innerHeight}px`;
            this.gameScreen.style.width = `${window.innerWidth}px`;
        });


        //hide the start-screen
        this.startScreen.style.display = "none";

        //
        this.gameScreen.style.display = "flex";
        this.score = 0;
        this.lives = 3;
        this.isGameover = false;
        this.frames = 0;

        /*start the game loop, aka turn on the engine
        The setInterval function creates a loop that calls this.gameLoop() every 
        this.gameLoopFrequency milliseconds. This creates a game loop 
        that updates at a fixed frequency.*/
        setInterval(() => {
            this.gameLoop();
        }, this.gameLoopFrequency);
    }
    
    /* Once the engine is on, the frames update and the player moves until it is gameover*/
    
    gameLoop() {
        // console.log('this is a game loop');
        this.frames++
        this.update();
        // if gameover is true, we call the gameOver() method
        this.player.move();
        if (this.isGameover) {
            clearInterval(this.gameIntervalId)
            this.isGameover();
        }
    
    
    }
}

 // + to the right, - to the left
        //to position Sashi to the center, we take into account the width of the screen
        // aka 500px, and the width of the cat, 75px
//the center is around 250px, 




     
     