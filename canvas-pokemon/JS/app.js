import { Player, Background, Sprite, Boundary, Foreground, BattleZone } from "./objects.js";
import { Controls } from "./controls.js";
import { rectCollision, createImg } from "./helper.js";
import { collisionsData } from "./collisions.js";
import { battleZonesData } from "./battleZones.js";
import { attacks } from "./attacks.js";
import { audio } from "./audio.js";

export const canvas = document.querySelector("canvas");
canvas.width = 1024;
canvas.height = 576;
export const c = canvas.getContext("2d");
export const offset = {
  x: -275,
  y: -830,
};

let speed = 4;
const battle = {
  initiated: false,
};

let musicOff = true;
const musicButton = document.querySelector("#music-button");
musicButton.addEventListener("click", () => {
  if (musicOff) {
    musicOff = false;
    audio.map.play()
    musicButton.classList.remove("fa-volume-xmark");
    musicButton.classList.add("fa-volume-high");
  } else if (!musicOff) {
    musicOff = true;
    audio.map.stop()
    musicButton.classList.remove("fa-volume-high");
    musicButton.classList.add("fa-volume-xmark");
  }
});

const controls = new Controls();
const player = new Player();
const map = new Background({image: createImg("../img/map.png"), position: {x: offset.x, y: offset.y}});
const foreground = new Foreground();

const collisionMap = [];
for (let i = 0; i < collisionsData.length; i += 70) {
  collisionMap.push(collisionsData.slice(i, 70 + i));
}
const boundaries = [];
collisionMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025) {
      boundaries.push(
        new Boundary(
          {
            position: {
              x: j * Boundary.width + offset.x,
              y: i * Boundary.height + offset.y,
            }
          }
        )
      );
    }
  });
});

const battleZoneMap = [];
for (let i = 0; i < battleZonesData.length; i += 70) {
  battleZoneMap.push(battleZonesData.slice(i, 70 + i));
}
const battleZones = [];
battleZoneMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025) {
      battleZones.push(
        new BattleZone(
          {
            position: {
              x: j * BattleZone.width + offset.x,
              y: i * BattleZone.height + offset.y,
            },
          }
        )
      );
    }
  });
});

const movables = [map, foreground, ...battleZones, ...boundaries]

function animate() {
  const animationID = requestAnimationFrame(animate);
  
  map.draw();
  boundaries.forEach((boundary) => boundary.draw());
  battleZones.forEach((battleZone) => {
    battleZone.draw()

    //activate battle
    const overlappingArea = (Math.min(player.position.x + player.width, battleZone.position.x + battleZone.width) - Math.max(player.position.x, battleZone.position.x)) * (Math.min(player.position.y + player.height, battleZone.position.y + battleZone.height) - Math.max(player.position.y, battleZone.position.y))

    if (
      rectCollision(player, battleZone) && 
      overlappingArea > (player.width * player.height) / 2 &&
      Math.random() < 0.001 &&
      battle.initiated === false
    ) {
      battle.initiated = true;
      cancelAnimationFrame(animationID);
      //change music
      audio.map.stop()
      if (!musicOff) {
        audio.initBattle.play()
        audio.battle.play()
      }
      //switch to battle
      gsap.to("#overlappingDiv", {
        opacity: 1,
        yoyo: true,
        duration: 0.6,
        onComplete() {
          gsap.to("#overlappingDiv", {
            opacity: 1,
            duration: 0.6,
            onComplete() {
              if (battle.initiated) {
                //activate battle animation
                initBattle();
                animateBattle();
              } else animate();
              //show battleBackground
              gsap.to("#overlappingDiv", {
                opacity: 0,
                duration: 0.6,
              });
            }
          });
        },
      });
    }
  });
  player.update();
  foreground.draw();

  player.moving = false;
  if (battle.initiated) return
  if (controls.right && controls.lastKey === "d") {
    movables.forEach(movable => movable.position.x -= speed)
    player.image = player.sprites.right;
    player.moving = true;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectCollision(player, {
          ...boundary,
          position: { x: boundary.position.x - 3, y: boundary.position.y },
        })
      ) {
        controls.right = false;
      }
    }
  } else if (controls.left && controls.lastKey === "a") {
    movables.forEach((movable) => (movable.position.x += speed));
    player.image = player.sprites.left;
    player.moving = true;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectCollision(player, {
          ...boundary,
          position: { x: boundary.position.x + 3, y: boundary.position.y },
        })
      ) {
        controls.left = false;
      }
    }
  } else if (controls.down && controls.lastKey === "s") {
    movables.forEach((movable) => (movable.position.y -= speed));
    player.image = player.sprites.down;
    player.moving = true;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectCollision(player, {
          ...boundary,
          position: { x: boundary.position.x, y: boundary.position.y - 3 },
        })
      ) {
        controls.down = false;
      }
    }
  } else if (controls.up && controls.lastKey === "w") {
    movables.forEach((movable) => (movable.position.y += speed));
    player.image = player.sprites.up;
    player.moving = true;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectCollision(player, {
          ...boundary,
          position: { x: boundary.position.x, y: boundary.position.y + 3 },
        })
      ) {
        controls.up = false;
      }
    }
  }
}
animate();

const battleBackground = new Background({
  image: createImg("../img/battleBackground.png"),
  position: { x: 0, y: 0 },
});

const monsters = {
  Draggle: {
    image: createImg("../img/draggleSprite.png"),
    position: { x: 800, y: 100 },
    animate: true,
    frames: {
      max: 4,
      hold: 20,
    },
    isEnemy: true,
    name: "Draggle",
    attacks: [attacks.Tackle, attacks.Fireball],
  },
  Emby: {
    image: createImg("../img/embySprite.png"),
    position: { x: 280, y: 325 },
    animate: true,
    frames: {
      max: 4,
      hold: 10,
    },
    name: "Emby",
    attacks: [attacks.Tackle, attacks.Fireball],
  },
};

let draggle;
let emby;
let queue;
let renderedSprites;

function initBattle() {
  document.querySelector("#userInterface").style.display = "block";
  document.querySelector("#battle-dialogue-div").style.display = "none";
  document.querySelector("#playerHealthBar").style.width = "100%";
  document.querySelector("#enemyHealthBar").style.width = "100%";
  document.querySelector("#left-div").replaceChildren()

  draggle = new Sprite(monsters.Draggle);
  emby = new Sprite(monsters.Emby);
  renderedSprites = [draggle, emby];
  queue = [];

  emby.attacks.forEach((attack) => {
    const button = document.createElement("button");
    button.innerHTML = attack.name;
    document.querySelector("#left-div").append(button);
  });

  document.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", (e) => {
      const selectedAttack = attacks[e.currentTarget.innerHTML];
      emby.attack({
        attack: selectedAttack,
        recipient: draggle,
        renderedSprites,
      });

      if (draggle.health <= 0) {
        queue.push(() => {
          draggle.faint();
        });
        queue.push(() => {
          //fade back to black
          gsap.to("#overlappingDiv", {
            opacity: 1,
            onComplete: () => {
              cancelAnimationFrame(animateBattleID);
              animate();
              document.querySelector("#userInterface").style.display = "none";
              gsap.to("#overlappingDiv", {
                opacity: 0,
              });
              battle.initiated = false;
              audio.battle.stop();
              if (!musicOff) audio.map.play();
            },
          });
        });
      }

      const randomAttack =
        draggle.attacks[Math.floor(Math.random() * draggle.attacks.length)];
      queue.push(() => {
        draggle.attack({
          attack: randomAttack,
          recipient: emby,
          renderedSprites,
        });

        if (emby.health <= 0) {
          queue.push(() => {
            emby.faint();
          });
          queue.push(() => {
            //fade back to black
            gsap.to("#overlappingDiv", {
              opacity: 1,
              onComplete: () => {
                cancelAnimationFrame(animateBattleID);
                animate();
                document.querySelector("#userInterface").style.display = "none";
                gsap.to("#overlappingDiv", {
                  opacity: 0,
                });
                battle.initiated = false;
                audio.battle.stop();
                if (!musicOff) audio.map.play();
              },
            });
          });
        }
      });
    });

    button.addEventListener("mouseenter", (e) => {
      const selectedAttack = attacks[e.currentTarget.innerHTML];
      document.querySelector("#attack-type").innerHTML = selectedAttack.type;
      document.querySelector("#attack-type").style.color = selectedAttack.color;
    });
  });

}

let animateBattleID;
function animateBattle() {
  animateBattleID = requestAnimationFrame(animateBattle)
  battleBackground.draw()
  renderedSprites.forEach(sprite => {
    sprite.update()
  })
}

document.querySelector('#battle-dialogue-div').addEventListener('click', (e) => {
  if (queue.length > 0) {
    queue[0]()
    queue.shift()
  } else e.currentTarget.style.display = 'none';
})
