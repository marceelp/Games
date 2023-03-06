import { Controls } from "./JS/controls.js";
import { Player } from "./JS/player.js";
import { Platform, HighPlatform, Block, Background, Hills } from "./JS/elements.js";
import { rightLeftTopCollision, bottomCollision } from "./JS/helper.js";

const canvas = document.querySelector("canvas");
canvas.width = innerWidth;
canvas.height = innerHeight;
export const c = canvas.getContext("2d");

// 580, 125 platform
// 291, 277 highPlatform
const platformCoordinates = [
  { x: -1, y: innerHeight - 125 },
  { x: 577, y: innerHeight - 125 },
  { x: 1560, y: innerHeight - 125 },
  { x: 2137, y: innerHeight - 125 },
  { x: 3200, y: innerHeight - 125 },
  { x: 3777, y: innerHeight - 125 },
  { x: 5936, y: innerHeight - 125 },
  { x: 6513, y: innerHeight - 125 },
  { x: 7089, y: innerHeight - 125 },
  { x: 8169, y: innerHeight - 125 },
  { x: 8746, y: innerHeight - 125 },
  { x: 9316, y: innerHeight - 125 },
  { x: 10260, y: innerHeight - 125 },
  { x: 10837, y: innerHeight - 125 },
];

const highPlatformCoordinates = [
  { x: 4857, y: innerHeight - 220 },
  { x: 5145, y: innerHeight - 220 },
];

const blockCoordinates = [
  { x: 2000, y: innerHeight / 2},
  { x: 2100, y: innerHeight / 2},
  { x: 2200, y: innerHeight / 2},
  { x: 4300, y: 250},
  { x: 4400, y: 250},
  { x: 4500, y: 250},
  { x: 6400, y: 400},
  { x: 6500, y: 400},
  { x: 6800, y: 300},
  { x: 6900, y: 300},
  { x: 7200, y: 200},
  { x: 7300, y: 200},
]

let controls = new Controls();
let player = new Player(controls);
let background = new Background({ x: -1, y: -1 });
let hills = new Hills({ x: 0, y: 220 });
let blocks = blockCoordinates.map(coordinate => new Block(coordinate));
let platforms = platformCoordinates.map(coordinate => new Platform(coordinate));
let highPlatforms = highPlatformCoordinates.map(coordinate => new HighPlatform(coordinate));

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, innerWidth, innerHeight);
  
  background.move(player);
  hills.move(player);
  highPlatforms.forEach(highPlatform => highPlatform.move(player));
  platforms.forEach(platform => platform.move(player));
  blocks.forEach(block => block.move(player));
  player.update();

  rightLeftTopCollision(highPlatforms, player);
  rightLeftTopCollision(platforms, player);
  rightLeftTopCollision(blocks, player);
  bottomCollision(blocks, player);

  // console.log(player.position.x)
}
animate();
