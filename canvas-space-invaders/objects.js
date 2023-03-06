import { createImg } from "./helper.js"
import { canvas, c } from "./app.js"

export class Player {
  constructor(controls, projectiles) {
    this.controls = controls;
    this.projectiles = projectiles;
    this.rotation = 0.15;
    this.opacity = 1;
    this.image = createImg("./img/spaceship.png");
    this.image.onload = () => {
      this.width = this.image.naturalWidth * 0.2;
      this.height = this.image.naturalHeight * 0.2;
      this.position = {
        x: canvas.width / 2 - this.width / 2,
        y: canvas.height - this.height - 20,
      };
    };
    //console error when not declared outside of this.image.onload
    this.width = this.image.naturalWidth * 0.2;
    this.height = this.image.naturalHeight * 0.2;
    this.position = {
      x: canvas.width / 2 - this.width / 2,
      y: canvas.height - this.height - 20,
    };
  }

  draw() {
    c.save();
    c.globalAlpha = this.opacity
    c.translate(
      this.position.x + this.width / 2,
      this.position.y + this.height / 2
    );
    c.rotate(this.rotation);
    c.drawImage(
      this.image,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );
    c.restore();
  }

  move() {
    if (this.controls.right && this.position.x + this.width < canvas.width) {
      this.rotation = 0.15;
      this.position.x += 10;
    } else if (this.controls.left && this.position.x > 0) {
      this.rotation = -0.15;
      this.position.x -= 10;
    } else {
      this.rotation = 0;
    }
  }

  shoot() {
    if (this.controls.space) {
      this.projectiles.push(
        new Projectile({
          position: { x: this.position.x + this.width / 2, y: this.position.y },
          velocity: { x: 0, y: -10 },
        })
      );
    }
  }

  update() {
    this.draw();
    this.move();
    this.shoot();
  }
}

export class Projectile {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;
    this.radius = 4;
  }

  draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = "red";
    c.fill();
    c.closePath();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

export class InvaderProjectile {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;
    this.width = 4
    this.height = 10
  }

  draw() {
    c.beginPath();
    c.rect(this.position.x, this.position.y, this.width, this.height)
    c.fillStyle = 'yellow'
    c.fill()
    c.closePath();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

export class Invader {
  constructor({ position }, projectiles) {
    this.projectiles = projectiles;
    this.direction = "right";
    this.image = createImg("./img/invader.png");
    this.image.onload = () => {
      this.width = this.image.naturalWidth;
      this.height = this.image.naturalHeight;
      this.position = {
        x: position.x,
        y: position.y,
      };
    };
    //error if not declared outside of this.image.onload too
    this.width = this.image.naturalWidth;
    this.height = this.image.naturalHeight;
    this.position = {
      x: position.x,
      y: position.y,
    };
  }

  draw() {
    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  shoot(invaderProjectiles) {
    invaderProjectiles.push(
      new InvaderProjectile({ position: {x: this.position.x + this.width / 2, y: this.position.y + this.height}, velocity: {x: 0, y: 5} })
    );
  }

  update({ velocity }) {
    this.draw();
    this.shoot
    this.position.x += velocity.x;
    this.position.y += velocity.y;
  }
}

export class Grid {
  constructor() {
    this.invaders = []
    this.position = {
      x: 0,
      y: 0
    }
    this.velocity = {
      x: 3,
      y: 0
    }
    const rows = Math.floor(Math.random() * 5 + 4)
    const columns = Math.floor(Math.random() * 10 + 12)
    this.width = columns * 30
    this.height = rows * 30
    for (let x = 0; x < columns; x++) {
      for (let y = 0; y < rows; y++) {
        this.invaders.push(new Invader({position: {x: x * 30, y: y * 30}}))
      }
    }
  }

  update() {
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
      this.velocity.x = -this.velocity.x
      this.velocity.y = 30
    } else this.velocity.y = 0
  }
}

export class ExplosionParticle {
  constructor({ position, velocity, radius, color, fades }) {
    this.position = position;
    this.velocity = velocity;
    this.radius = radius
    this.color = color
    this.opacity = 1;
    this.fades = fades
  }

  draw() {
    c.save()
    c.globalAlpha = this.opacity;
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
    c.restore()
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (this.fades) this.opacity -= 0.03
  }
}
