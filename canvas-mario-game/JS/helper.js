export function rightLeftTopCollision(elements, player) {
  elements.forEach((element) => {
    let nextX = player.position.x + player.speedX;
    let nextY = player.position.y + player.speedY;

    //Stand on element
    if (
      player.position.y + player.height <= element.position.y &&
      player.position.y + player.height + player.speedY >=
        element.position.y &&
      player.position.x + player.width > element.position.x + 10 &&
      player.position.x < element.position.x + element.width - 10
    ) {
      player.speedY = 0;
    }

    //Left side collision
    if (
      nextX + player.width >= element.position.x &&
      nextX < element.position.x &&
      nextY + player.height > element.position.y &&
      nextY < element.position.y + element.height
    ) {
      player.speedX = 0;
      player.position.x = element.position.x - player.width
    }

    //Right side collision
    if (
      nextX < element.position.x + element.width &&
      nextX + player.width > element.position.x + element.width &&
      nextY + player.height > element.position.y &&
      nextY < element.position.y + element.height
    ) {
      player.speedX = 0;
      player.position.x = element.position.x + element.width
    }
  });
}

export function bottomCollision(elements, player) {
  elements.forEach((element) => {
    let nextX = player.position.x + player.speedX;
    let nextY = player.position.y + player.speedY;
    
    if (
      nextY < element.position.y + element.height - 10 &&
      nextY + player.height > element.position.y + element.height &&
      nextX < element.position.x + element.width &&
      nextX + player.width >= element.position.x
    ) {
      player.speedY = 5;
    }
  });
}

export function createImg(src) {
  const img = new Image();
  img.src = src;
  return img;
}
