class Obstacle {
  constructor() {
    this.gameScreen = document.getElementById("game-screen");

    // Define width and height for the obstacle
    this.width = 180;
    this.height = 150;

    // Set the initial position at the top of the screen
    this.top = -200; // Start dropping from the top, smoothly

    // Dynamically set the left position based on the screen width
    const screenWidth = this.gameScreen.clientWidth;
    this.left = Math.floor(Math.random() * (screenWidth - this.width)); // Random position across screen width

    //Array of image paths for different obstacle images
    const images = [
      "/kitty-mission-keep-baby-happy/images/panettone.png",
      "/kitty-mission-keep-baby-happy/images/coffee.png",
      "/kitty-mission-keep-baby-happy/images/chocolate.png",
    ];
    // Select a random image for the obstacle
    const randomImageIndex = Math.floor(Math.random() * images.length);
    const selectedImage = images[randomImageIndex];

    //.src adds the path to the image, since it is an argument we can
    //change it, aka different cars every time the game starts
    //creating the obstacle
    this.element = document.createElement("img");
    this.element.src = selectedImage;
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
    this.top += 6;
    this.updatePosition();
  }

  updatePosition() {
    this.element.style.top = `${this.top}px`;
  }
  isOutofScreen() {
    return this.left > this.gameScreen.clientWidth;
  }
}
