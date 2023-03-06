import { createImg } from "./helper.js"
import { c } from "../app.js"

export class Player {
  constructor(controls) {
    this.image = createImg("../img/platform.png");
    this.image.addEventListener("load", this.handleImageLoad);
    this.speedX = 0;
    this.speedY = 0;
    this.frames = 1;
    this.gravity = 1;
    this.position = {x: 100, y: innerHeight / 2};
    this.direction = 'right';
    this.controls = controls;
    this.sprites = {
      stand: {
        right: createImg("../img/spriteStandRight.png"),
        left: createImg("../img/spriteStandLeft.png"),
        cropWidth: 177,
        width: 60,
      },
      run: {
        right: createImg("../img/spriteRunRight.png"),
        left: createImg("../img/spriteRunLeft.png"),
        cropWidth: 341,
        width: 127.875,
      },
    };
    this.currentSprite = this.sprites.stand.right;
    this.currentCropWidth = 177;
  }

  handleImageLoad = () => {
    this.width = 60;
    this.height = this.image.naturalHeight;
  };

  draw() {
    c.drawImage(
      this.currentSprite,
      this.currentCropWidth * this.frames,
      0,
      this.currentCropWidth,
      400,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  stand() {
    if (!this.controls.right && !this.controls.left) {
      this.speedX = 0;
      this.currentSprite = this.sprites.stand[this.direction];
      this.currentCropWidth = this.sprites.stand.cropWidth;
      this.width = this.sprites.stand.width
    }
  }
  
  move() {
    if (this.controls.right && this.position.x <= 9950) {
      this.speedX = 10;
      this.currentSprite = this.sprites.run.right;
      this.currentCropWidth = this.sprites.run.cropWidth;
      this.width = this.sprites.run.width;
      this.direction = 'right';
    }
    if (this.controls.left && this.position.x > 100) {
      this.speedX = -10;
      this.currentSprite = this.sprites.run.left;
      this.currentCropWidth = this.sprites.run.cropWidth;
      this.width = this.sprites.run.width;
      this.direction = "left";
    }
  }

  jump() {
    if (this.controls.up === true) {
      this.speedY = -15;
    }
    if (this.controls.down === true) {
      this.speedY = 15;
    }
    //gravity
    if (this.position.y + this.height + this.speedY <= innerHeight) {
      this.speedY += this.gravity;
    }
  }

  update() {
    //player animation frames
    this.frames++;
    if (
      this.frames > 58 &&
      (this.currentSprite === this.sprites.stand.right ||
        this.currentSprite === this.sprites.stand.left)
    ) {
      this.frames = 0;
    } else if (
      this.frames > 28 &&
      (this.currentSprite == this.sprites.run.right ||
        this.currentSprite == this.sprites.run.left)
    ) {
      this.frames = 0;
    }

    this.scrollOffset += this.speedX;
    this.position.x += this.speedX;
    this.position.y += this.speedY;

    this.draw();
    this.stand();
    this.move();
    this.jump();
  }
}
