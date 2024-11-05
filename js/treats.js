class Treat {
  constructor(gameScreen) {
    this.gameScreen = gameScreen;
    this.position = [
      70, 500, 400, 230, 100, 30, 1500, 800, 1200, 140, 2300, 2500, 3000,
    ];
    this.randomIndex = math.floor(Math.random() * this.position.length);
    this.left = this.position[this.randomIndex];
    this.top = 50;
    this.width = 180;
    this.height = 150;

    //Array of image paths for different obstacle images
    const images = [
      "/kitty-mission-keep-baby-happy/images/tuna.png",
      "/kitty-mission-keep-baby-happy/images/toy_blue.png",
      "/kitty-mission-keep-baby-happy/images/fish_toy2.png",
      "/kitty-mission-keep-baby-happy/images/fish_toy1.png",
      "/kitty-mission-keep-baby-happy/images/heart.png",
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
    this.top += 2;
    this.updatePosition();
  }

  updatePosition() {
    this.element.style.top = `${this.top}px`;
  }
  // Check if the obstacle has moved out of the screen
  
}
