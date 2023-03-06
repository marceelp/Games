export class Controls {
  constructor() {
    window.addEventListener('keydown', this.keyDownEvent.bind(this));
    window.addEventListener('keyup', this.keyUpEvent.bind(this))
  }

  keyDownEvent(event) {
    if (!this.left && event.key === "a") {
      this.left = true;
    }
    if (!this.right && event.key === "d") {
      this.right = true;
    }
    if (!this.up && event.key === "w") {
      this.up = true;
    }
    if (!this.down && event.key === "s") {
      this.down = true;
    }
  }

  keyUpEvent(event) {
    if (this.left && event.key === "a") {
      this.left = false;
    }
    if (this.right && event.key === "d") {
      this.right = false;
    }
    if (this.up && event.key === "w") {
      this.up = false;
    }
    if (this.down && event.key === "s") {
      this.down = false;
    }
  }
}
