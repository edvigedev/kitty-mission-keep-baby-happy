class Treat {
  constructor() {
    this.gameScreen = document.getElementById("game-screen");

    // Define width and height for the treat

    const windowWidth = window.innerWidth; // Use viewport width
    const treatSize = windowWidth * 0.05; // 5% of screen width

    this.width = treatSize;
    this.height = treatSize + windowWidth * 0.01; // Different values for baby face

    // this.width = 90;
    // this.height = 120;

    // Set the initial position at the top of the screen
    this.top = -200; // Start dropping from the top, smoothly

    // Dynamically set the left position based on the screen width
    const screenWidth = this.gameScreen.clientWidth;
    this.left = Math.floor(
      Math.random() * Math.floor(screenWidth - this.width)
    ); // Random position across screen width

    //Array of image paths for different treats images
    const images = [
      "/kitty-mission-keep-baby-happy/images/toy_blue.png",
      "/kitty-mission-keep-baby-happy/images/heart.png",
      "/kitty-mission-keep-baby-happy/images/fish_toy2.png",
      "/kitty-mission-keep-baby-happy/images/happy_baby.png",
      "/kitty-mission-keep-baby-happy/images/toy_green.png",
    ];
    // Select a random image for the treat
    const randomImageIndex = Math.floor(Math.random() * images.length);
    const selectedImage = images[randomImageIndex];

    //.src adds the path to the image, since it is an argument we can
    //change it, aka different cars every time the game starts
    //creating the treat
    this.element = document.createElement("img");
    this.element.src = selectedImage;
    this.element.style.position = "absolute";
    this.element.style.height = `${this.height}px`;
    this.element.style.width = `${this.width}px`;
    this.element.style.top = `${this.top}px`;
    this.element.style.left = `${this.left}px`;

    //add the treat to the screen
    this.gameScreen.appendChild(this.element);
  }
  // it does not have directionX or directionY, only falls down
  move() {
    //this is non-responsive to keyboard and it always has to be falling.
    this.top += 8;
    this.updatePosition();
  }

  updatePosition() {
    this.element.style.top = `${this.top}px`;
  }
}
