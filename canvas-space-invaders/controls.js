import { game } from "./app.js"

export class Controls {
    constructor() {
        addEventListener('keydown', this.keyDownEvent.bind(this))
        addEventListener('keyup', this.keyUpEvent.bind(this))
        this.right = false
        this.left = false
        this.up = false
    }

    keyDownEvent(event) {
        if (!game.over && game.active && !this.right && (event.key === "d" || event.key === "D")) {
            this.right = true;
        }
        if (!game.over && game.active && !this.left && (event.key === "a" || event.key === "A")) {
          this.left = true;
        }
        if (!game.over && game.active && !this.space && event.key === " ") {
            this.space = true;
        }
    }

    keyUpEvent(event) {
        if (this.right && (event.key === "d" || event.key === "D")) {
          this.right = false;
        }
        if (this.left && (event.key === "a" || event.key === "A")) {
          this.left = false;
        }
        if (this.space && event.key === " ") {
            this.space = false;
        }
    }
}
