import { createImg } from "./helper.js";
import { c } from "../app.js";


export class Platform {
  constructor({ x, y }) {
    this.image = createImg("../img/platform.png");
    this.image.addEventListener("load", this.handleImageLoad);
    this.position = {
      x,
      y,
    };
  }

  handleImageLoad = () => {
    this.width = this.image.naturalWidth;
    this.height = this.image.naturalHeight;
  };

  draw() {
    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  move(player) {
    this.draw();
    if (player.speedX > 0 && player.position.x < 9950) {
      this.position.x -= player.speedX;
    } else if (player.speedX < 0 && player.position.x > 100) {
      this.position.x -= player.speedX;
    }
  }
}

export class HighPlatform {
  constructor({ x, y }) {
    this.image = createImg("../img/platformSmallTall.png");
    this.image.addEventListener("load", this.handleImageLoad);
    this.position = {
      x,
      y,
    };
  }

  handleImageLoad = () => {
    this.width = this.image.naturalWidth;
    this.height = this.image.naturalHeight;
  };

  draw() {
    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  move(player) {
    this.draw();
    if (player.speedX > 0 && player.position.x < 9950) {
      this.position.x -= player.speedX;
    } else if (player.speedX < 0 && player.position.x > 100) {
      this.position.x -= player.speedX;
    }
  }
}

export class Block {
  constructor({ x, y }) {
    this.image = createImg("../img/block.png");
    this.image.addEventListener("load", this.handleImageLoad);
    this.position = {
      x,
      y,
    };
  }

  handleImageLoad = () => {
    this.width = 100;
    this.height = 100;
  };

  draw() {
    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  move(player) {
    this.draw();
    if (player.speedX > 0 && player.position.x < 9950) {
      this.position.x -= player.speedX;
    } else if (player.speedX < 0 && player.position.x > 100) {
      this.position.x -= player.speedX;
    }
  }
}

export class Background {
  constructor({ x, y }) {
    this.image = createImg("../img/background.png");
    this.image.addEventListener("load", this.handleImageLoad);
    this.position = {
      x,
      y,
    };
  }

  handleImageLoad = () => {
    this.width = this.image.naturalWidth;
    this.height = innerHeight + 3;
  };

  draw() {
    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  move(player) {
    this.draw()
    if (player.speedX > 0 && player.position.x < 9950) {
      this.position.x -= player.speedX / 5;
    } else if (player.speedX < 0 && player.position.x > 100) {
      this.position.x -= player.speedX / 5;
    }
  }
}

export class Hills {
  constructor({ x, y }) {
    this.image = createImg("../img/hills.png");
    this.image.addEventListener("load", this.handleImageLoad);
    this.position = {
      x,
      y,
    };
  }

  handleImageLoad = () => {
    this.width = this.image.naturalWidth;
    this.height = this.image.naturalHeight;
  };

  draw() {
    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  move(player) {
    this.draw();
    if (player.speedX > 0 && player.position.x < 9950) {
      this.position.x -= player.speedX / 3;
    } else if (player.speedX < 0 && player.position.x > 100) {
      this.position.x -= player.speedX / 3;
    }
  }
}
