export function circleCollidesWithRect({ circle, rect, Wall }) {
  const padding = Wall.width / 2 - circle.radius - 1;
  return (
    circle.position.x + circle.radius + circle.velocity.x >=
      rect.position.x - padding &&
    circle.position.y + circle.radius + circle.velocity.y >=
      rect.position.y - padding &&
    circle.position.x - circle.radius + circle.velocity.x <=
      rect.position.x + rect.width + padding &&
    circle.position.y - circle.radius + circle.velocity.y <=
      rect.position.y + rect.height + padding
  );
}

export function rectCollidesWithRect({ rect1, rect2, Wall }) {
  const padding = Wall.width / 2 - rect1.width / 2 - 1;
  return (
    rect1.position.x + rect1.width + rect1.velocity.x >=
      rect2.position.x - padding &&
    rect1.position.y + rect1.height + rect1.velocity.y >=
      rect2.position.y - padding &&
    rect1.position.x + rect1.velocity.x <=
      rect2.position.x + rect2.width + padding &&
    rect1.position.y + rect1.velocity.y <=
      rect2.position.y + rect2.height + padding
  );
}

export function scaredGhosts(ghost, player) {
  if (ghost.velocity.x >= player.velocity.x && ghost.position.x < player.position.x && ghost.velocity.y === player.position.y) {
    ghost.velocity.x = -player.velocity.x + 3
    ghost.velocity.y = 0
  } else if (ghost.velocity.x <= player.velocity.x && ghost.position.x > player.position.x && ghost.velocity.y === player.velocity.y) {
    ghost.velocity.x = player.velocity.x - 3
    ghost.velocity.y = 0;
  } else if (ghost.velocity.y >= player.velocity.y && ghost.position.y < player.position.y && ghost.velocity.x === player.velocity.x) {
    ghost.velocity.y = -2
    ghost.velocity.x = 0;
  } else if (ghost.velocity.y <= player.velocity.y && ghost.position.y > player.position.y && ghost.velocity.x === player.velocity.x) {
    ghost.velocity.y = 2
    ghost.velocity.x = 0;
  }
}

export function changeGhostImage(ghosts, i, sx0, sy0, sx1, sy1, sx2, sy2, sx3, sy3) {
  if (ghosts[i].velocity.x >= 0 && ghosts[i].velocity.y === 0) {
    if (!ghosts[i].scared) {
      ghosts[i].currentSx = sx0;
      ghosts[i].currentSy = sy0;
    } else {
      ghosts[i].currentSx = 0;
      ghosts[i].currentSy = 760;
    }
  } else if (ghosts[i].velocity.x < 0 && ghosts[i].velocity.y === 0) {
    ghosts[i].currentSx = sx1;
    ghosts[i].currentSy = sy1;
    if (!ghosts[i].scared) {
      ghosts[i].currentSx = sx1;
      ghosts[i].currentSy = sy1;
    } else {
      ghosts[i].currentSx = 0;
      ghosts[i].currentSy = 760;
    }
  } else if (ghosts[i].velocity.y >= 0 && ghosts[i].velocity.x === 0) {
    if (!ghosts[i].scared) {
      ghosts[i].currentSx = sx2;
      ghosts[i].currentSy = sy2;
    } else {
      ghosts[i].currentSx = 0;
      ghosts[i].currentSy = 760;
    }
  } else if (ghosts[i].velocity.y < 0 && ghosts[i].velocity.x === 0) {
    if (!ghosts[i].scared) {
      ghosts[i].currentSx = sx3;
      ghosts[i].currentSy = sy3;
    } else {
      ghosts[i].currentSx = 0;
      ghosts[i].currentSy = 760
    }
  }
}

export function createImage(src) {
  const img = new Image();
  img.src = src;
  return img;
}

export function playerWallCollision(player, walls, Wall) {
  if (player.controls.right && player.controls.lastKey === "d") {
    for (let i = 0; i < walls.length; i++) {
      const wall = walls[i];
      if (
        circleCollidesWithRect({
          circle: {
            ...player,
            velocity: {
              x: player.speed,
              y: 0,
            },
          },
          rect: wall,
          Wall,
        })
      ) {
        player.velocity.x = 0;
        break;
      } else {
        player.velocity.x = player.speed;
      }
    }
  } else if (player.controls.left && player.controls.lastKey === "a") {
    for (let i = 0; i < walls.length; i++) {
      const wall = walls[i];
      if (
        circleCollidesWithRect({
          circle: { ...player, velocity: { x: -player.speed, y: 0 } },
          rect: wall,
          Wall,
        })
      ) {
        player.velocity.x = 0;
        break;
      } else {
        player.velocity.x = -player.speed;
      }
    }
  } else if (player.controls.up && player.controls.lastKey === "w") {
    for (let i = 0; i < walls.length; i++) {
      const wall = walls[i];
      if (
        circleCollidesWithRect({
          circle: { ...player, velocity: { x: 0, y: -player.speed } },
          rect: wall,
          Wall,
        })
      ) {
        player.velocity.y = 0;
        break;
      } else {
        player.velocity.y = -player.speed;
      }
    }
  } else if (player.controls.down && player.controls.lastKey === "s") {
    for (let i = 0; i < walls.length; i++) {
      const wall = walls[i];
      if (
        circleCollidesWithRect({
          circle: { ...player, velocity: { x: 0, y: player.speed } },
          rect: wall,
          Wall,
        })
      ) {
        player.velocity.y = 0;
        break;
      } else {
        player.velocity.y = player.speed;
      }
    }
  }
}
