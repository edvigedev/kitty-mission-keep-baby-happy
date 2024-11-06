class Projectile {
  constructor(positionX, positionY) {
    this.gameScreen = document.getElementById("game-screen");

    // Define width and height for the obstacle
    this.width = 80;
    this.height = 50;

    // Set the initial position at the top of the screen
    this.top = positionY; //
    this.left = positionX;

    //.src adds the path to the image, since it is an argument we can
    //change it, aka different cars every time the game starts
    //creating the obstacle
    this.element = document.createElement("img");
    this.element.src = "images/diaper.png";
    this.element.style.position = "absolute";
    this.element.style.height = `${this.height}px`;
    this.element.style.width = `${this.width}px`;
    this.element.style.top = `${this.top}px`;
    this.element.style.left = `${this.left}px`;

    //add the obstacle to the screen
    this.gameScreen.appendChild(this.element);
  }
  // it does not have directionX or directionY, only falls down
  move() {
    //this is non-responsive to keyboard and it always has to be falling.
    this.top -= 15;
    this.updatePosition();
  }

  updatePosition() {
    this.element.style.top = `${this.top}px`;
  }
  isOutofScreen() {
    return this.left > this.gameScreen.clientWidth;
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
