export class Controls {
  constructor() {
    addEventListener("keydown", this.keyDownEvent.bind(this));
    addEventListener("keyup", this.keyUpEvent.bind(this));
    this.lastKey = "";
  }

  keyDownEvent(event) {
    if (event.key === "d" || event.key === "D") {
      this.right = true;
      this.lastKey = 'd'
    }
    if (event.key === "a" || event.key === "A") {
      this.left = true;
      this.lastKey = "a";
    }
    if (event.key === "w" || event.key === "W") {
      this.up = true;
      this.lastKey = "w";
    }
    if (event.key === "s" || event.key === "S") {
      this.down = true;
      this.lastKey = "s";
    }
  }

  keyUpEvent(event) {
    if (event.key === "d" || event.key === "D") {
      this.right = false;
    }
    if (event.key === "a" || event.key === "A") {
      this.left = false;
    }
    if (event.key === "w" || event.key === "W") {
      this.up = false;
    }
    if (event.key === "s" || event.key === "S") {
      this.down = false;
    }
  }
}
