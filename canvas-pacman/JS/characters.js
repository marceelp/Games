import { c, canvas } from "./app.js"
import { createImage } from "./helper.js";
import { Wall } from "./objects.js";

export class Player {
  constructor({ position, velocity, controls }) {
    this.controls = controls;
    this.position = position;
    this.velocity = velocity;
    this.radius = 15;
    this.speed = 5;
    this.radians = 0.75;
    this.openRate = 0.12;
    this.rotation = 0;
  }

  draw() {
    c.save();
    c.translate(this.position.x, this.position.y);
    c.rotate(this.rotation);
    c.translate(-this.position.x, -this.position.y);
    c.beginPath();
    c.arc(
      this.position.x,
      this.position.y,
      this.radius,
      this.radians,
      Math.PI * 2 - this.radians
    );
    c.lineTo(this.position.x, this.position.y);
    c.fillStyle = "#FFFF00";
    c.fill();
    c.closePath();
    c.restore();
  }

  move() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }

  animate() {
    //rotate pacman when changing direction
    if (this.velocity.x > 0) this.rotation = 0;
    else if (this.velocity.x < 0) this.rotation = Math.PI;
    else if (this.velocity.y > 0) this.rotation = Math.PI / 2;
    else if (this.velocity.y < 0) this.rotation = Math.PI * 1.5;

    //open and close mouth
    if (this.radians < 0 || this.radians > 0.75) {
      this.openRate = -this.openRate;
    }
    this.radians += this.openRate;
  }

  update() {
    this.draw();
    this.move();
    this.animate();

    //use shortcuts
    if (
      this.position.x >= canvas.width &&
      this.position.y >= Wall.height * 6
    ) {
      setTimeout(() => {
        this.position.x = 0;
      }, 0);
    }
    if (this.position.x <= 0 && this.position.y >= Wall.height * 6) {
      setTimeout(() => {
        this.position.x = canvas.width
      }, 0);
    }
  }
}

export class Ghost {
  static speed = 2;
  constructor({ position, velocity, currentSx, currentSy }) {
    this.image = createImage("../img/all-ghosts.png");
    this.image.onload = () => {
      this.position = position;
      this.width = 40;
      this.height = 40;
    };
    this.position = position;
    this.width = 40
    this.height = 40
    this.currentSx = currentSx;
    this.currentSy = currentSy;
    this.velocity = velocity;
    this.speed = 2;
    this.scared = false;
    this.start = false;
    this.prevCollisions = [];
    this.dead = false;
  }

  draw() {
    c.drawImage(
      this.image,
      this.currentSx,
      this.currentSy,
      160,
      160,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  move() {
    //use shortcuts
    if (
      this.position.x >= canvas.width - this.width / 2 && 
      this.position.y >= Wall.height * 6 &&
      this.velocity.x == 2
    ) {
      setTimeout(() => {
        this.position.x = 0 - Wall.width;
        this.velocity.x = 2
      }, 0);
    }
    if (this.position.x < 0 && this.position.y >= Wall.height * 6 && this.velocity.x < 0) {
      setTimeout(() => {
        this.position.x = canvas.width;
      }, 0);
    }
  }

  update() {
    this.draw();
    this.move();

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}
