//player.js
/*This file goes above the game.js in the HTML, so the game.js can access it
In the same constructor, you can make the player appear on the screen
the method move() moves the player in JS, and it is called in game.js
updatePosition() is what moves the player on the screen */


class Player {
    constructor(playerImage, top, left) {
        this.gameScreen = document.getElementById("game-screen");
        this.top = top
        this.left = left;
        //leave them out as they will always be the same
        this.width = 200;
        this.height = 180;
        //we need the variables direction x and direction y for directions
        this.directionX = 0; // left right
        this.directionY = 0; // up and down
        //this is the players' picture, aka the car
        this.element = document.createElement('img');
        //.src adds the path to the image, since it is an argument we can 
        //change it, aka different cars every time the game starts
        this.element.src = playerImage
        this.element.style.position = "absolute"
        this.element.style.height = `${this.height}px`
        this.element.style.width = `${this.width}px`;
        this.element.style.top = `${this.top}px`;
        this.element.style.left = `${this.left}px`;

        //add the car to the screen
        this.gameScreen.appendChild(this.element);
    }
}