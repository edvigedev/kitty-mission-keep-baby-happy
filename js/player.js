//player.js
/*This file goes above the game.js in the HTML, so the game.js can access it
In the same constructor, you can make the player appear on the screen
the method move() moves the player in JS, and it is called in game.js
updatePosition() is what moves the player on the screen */

class Player {
  constructor(top, left) {
    this.gameScreen = document.getElementById("game-screen");
    //where do you want the player to be positioned
    this.top = top;
    this.left = left;
    //player's dimensions
    const screenWidth = window.innerWidth; // Use viewport width
    const playerSize = screenWidth * 0.1; // 10% of screen width

    this.width = playerSize;
    this.height = playerSize; // Same value for width and height to keep square

    //we need the variables direction x and direction y for directions
    this.directionX = 0; // controls Sashi moving left right
    this.directionY = 0; // constrols Sashi moving up and down
    //this is the players' picture, aka the car
    this.element = document.createElement("img");
    //.src adds the path to the image, since it is an argument we can
    this.element.src = "/kitty-mission-keep-baby-happy/images/sashi.png";
    //position of Sashi
    this.element.style.position = "absolute";
    this.element.style.height = `${this.height}px`;
    this.element.style.width = `${this.width}px`;
    this.element.style.top = `${this.top}px`;
    this.element.style.left = `${this.left}px`;

    //add the player, Sashi, to the screen
    this.gameScreen.appendChild(this.element);
  }
  /*move manages the movement of the cat in JS based on directionX and directionY
  within certain boundaries.
  */
  move() {
    /* Here, the left and top properties of this (which represents the cat sprite) 
      are updated based on directionX and directionY.

      These variables (directionX and directionY) control the movement of the cat along 
      the X and Y axes, respectively. */
    this.left += this.directionX;
    this.top += this.directionY;

    /* Each conditional block below prevents the cat 
      from moving outside specific screen boundaries.*/

    const screenWidth = this.gameScreen.clientWidth;
    const screenHeight = this.gameScreen.clientHeight;

    // Boundary checks
    if (this.left < 0) {
      this.left = 0; // Left boundary
    }
    if (this.left + this.width > screenWidth) {
      this.left = screenWidth - this.width; // Right boundary
    }
    if (this.top < 0) {
      this.top = 0; // Top boundary
    }
    if (this.top + this.height > screenHeight) {
      this.top = screenHeight - this.height; // Bottom boundary
    }

    this.updatePosition();
  }

  updatePosition() {
    //actually moving the player on the screen
    this.element.style.left = `${this.left}px`;
    this.element.style.top = `${this.top}px`;
  }

  didCollide(obstacle) {
    const playerRect = this.element.getBoundingClientRect();
    const obstacleRect = obstacle.element.getBoundingClientRect();

    if (
      playerRect.left < obstacleRect.right &&
      playerRect.right > obstacleRect.left &&
      playerRect.top < obstacleRect.bottom &&
      playerRect.bottom > obstacleRect.top
    ) {
      return true;
    } else {
      return false;
    }
  }
}
