import { c, canvas, offset } from "./app.js";
import { createImg } from "./helper.js";
import { audio } from "./audio.js";

export class Player {
  constructor() {
    this.frames = {
      val: 0,
      max: 4,
      elapsed: 0,
    };
    this.image = createImg("../img/playerDown.png");
    this.image.onload = () => {
      this.width = this.image.naturalWidth / this.frames.max;
      this.height = this.image.naturalHeight;
      this.position = {
        x: canvas.width / 2 - this.width / 2,
        y: canvas.height / 2 - this.height / 2,
      };
    };
    this.width = this.image.naturalWidth / this.frames.max;
    this.height = this.image.naturalHeight;
    this.position = {
      x: canvas.width / 2 - this.width / 2,
      y: canvas.height / 2 - this.height / 2,
    };
    this.moving = false;
    this.sprites = {
      right: createImg("../img/playerRight.png"),
      left: createImg("../img/playerLeft.png"),
      down: createImg("../img/playerDown.png"),
      up: createImg("../img/playerUp.png"),
    };
  }

  draw() {
    c.drawImage(
      this.image,
      this.frames.val * this.width,
      0,
      this.width,
      this.height,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  animate() {
    //only animate when this.moving
    if (!this.moving) return;

    //for slower animation
    if (this.frames.max > 1) this.frames.elapsed++;

    //only animate when elapsed % 10 = 0
    if (this.frames.elapsed % 8 === 0) {
      if (this.frames.val < this.frames.max - 1) this.frames.val++;
      else this.frames.val = 0;
    }
  }

  update() {
    this.draw();
    this.animate();
  }
}

export class Sprite {
  constructor({
    image,
    position,
    frames = { max: 4, hold: 10 },
    animate,
    isEnemy = false,
    rotation = 0,
    name,
    attacks
  }) {
    this.image = image;
    this.image.onload = () => {
      this.width = this.image.naturalWidth / this.frames.max;
      this.height = this.image.naturalHeight;
    };
    this.image.src = image.src;
    this.position = position;
    this.frames = { ...frames, val: 0, elapsed: 0, ...frames };
    this.animate = animate;
    this.opacity = 1;
    this.health = 100;
    this.isEnemy = isEnemy;
    this.rotation = rotation;
    this.name = name
    this.attacks = attacks
  }

  draw() {
    c.save();
    c.translate(this.position.x + this.width / 2, this.position.y + this.height / 2)
    c.rotate(this.rotation)
    c.translate(-this.position.x - this.width / 2, -this.position.y - this.height / 2)
    c.globalAlpha = this.opacity;
    c.drawImage(
      this.image,
      this.frames.val * this.width,
      0,
      this.width,
      this.height,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
    c.restore();
  }

  move() {
    //only animate when this.animate
    if (!this.animate) return;
    //for slower animation
    if (this.frames.max > 1) this.frames.elapsed++;
    //only animate when elapsed % 10 = 0
    if (this.frames.elapsed % this.frames.hold === 0) {
      if (this.frames.val < this.frames.max - 1) this.frames.val++;
      else this.frames.val = 0;
    }
  }

  attack({ attack, recipient, renderedSprites, musicOff }) {
    document.querySelector('#battle-dialogue-div').style.display = 'block'
    document.querySelector('#battle-dialogue-div').innerHTML = this.name + ' used ' + attack.name
    
    let healthBar = "#enemyHealthBar";
    let rotation = 1
    if (this.isEnemy) {
      healthBar = "#playerHealthBar";
      rotation = -2.5
    }
    recipient.health -= attack.damage;

    switch (attack.name) {
      case "Tackle":
        let movementDistance = 20;
        if (this.isEnemy) movementDistance = -20;

        const tl = gsap.timeline();

        tl.to(this.position, {
          x: this.position.x - movementDistance,
        })
          .to(this.position, {
            x: this.position.x + movementDistance * 2,
            duration: 0.1,
            onComplete: () => {
              if (!musicOff) audio.tackleHit.play()
              gsap.to(healthBar, {
                width: recipient.health + "%",
              });
              gsap.to(recipient.position, {
                x: recipient.position.x + 10,
                yoyo: true,
                repeat: 5,
                duration: 0.08,
              });
              gsap.to(recipient, {
                opacity: 0,
                repeat: 5,
                yoyo: true,
                duration: 0.08,
              });
            },
          })
          .to(this.position, {
            x: this.position.x,
          });
        break;
      case "Fireball":
        if (!musicOff) audio.initFireball.play()
        const fireball = new Sprite({
          image: createImg("../img/fireball.png"),
          position: { x: this.position.x, y: this.position.y },
          animate: true,
          frames: {
            max: 4,
            hold: 10,
          },
          rotation
        });
        renderedSprites.splice(1, 0, fireball);
        gsap.to(fireball.position, {
          x: recipient.position.x,
          y: recipient.position.y,
          duration: 0.5,
          onComplete: () => {
            if (!musicOff) audio.fireballHit.play()
            renderedSprites.splice(1, 1);
            gsap.to(healthBar, {
              width: recipient.health + "%",
            });
            gsap.to(recipient.position, {
              x: recipient.position.x + 10,
              yoyo: true,
              repeat: 5,
              duration: 0.08,
            });
            gsap.to(recipient, {
              opacity: 0,
              repeat: 5,
              yoyo: true,
              duration: 0.08,
            });
          },
        });
        break;
    }
  }

  faint() {
    document.querySelector("#battle-dialogue-div").innerHTML =
      this.name + " fainted!"
    gsap.to(this.position, {
      y: this.position.y + 20
    })
    gsap.to(this, {
      opacity: 0
    })
  }

  update() {
    this.draw();
    this.move();
  }
}

export class Background {
  constructor({ image, position }) {
    this.image = image;
    this.position = position;
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}

export class Boundary {
  static width = 49.2;
  static height = 49.2;
  constructor({ position }) {
    this.position = position;
    this.width = 49.2;
    this.height = 49.2;
  }

  draw() {
    c.beginPath();
    c.rect(this.position.x, this.position.y, this.width, this.height);
    c.fillStyle = "rgba(0, 0, 0, 0)";
    c.fill();
    c.closePath();
  }
}

export class BattleZone {
  static width = 49.2;
  static height = 49.2;
  constructor({ position }) {
    this.position = position;
    this.width = 49.2;
    this.height = 49.2;
  }

  draw() {
    c.beginPath();
    c.rect(this.position.x, this.position.y, this.width, this.height);
    c.fillStyle = "rgba(0, 0, 0, 0  )";
    c.fill();
    c.closePath();
  }
}

export class Foreground {
  constructor() {
    this.image = createImg("../img/foregroundObjects.png");
    this.position = {
      x: offset.x,
      y: offset.y,
    };
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}
