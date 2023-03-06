export function createImg(src) {
    const img = new Image()
    img.src = src
    return img
}

export function rectCollision(rect1, rect2) {
    return (
      rect1.position.x + rect1.width >= rect2.position.x - 4 &&
      rect1.position.x <= rect2.position.x + rect2.width + 4 &&
      rect1.position.y + rect1.height >= rect2.position.y - 4 &&
      rect1.position.y <= rect2.position.y + 4
    )
}
