import { Controls } from "./controls.js";
import { Player, Grid, ExplosionParticle } from "./objects.js";

export const canvas = document.querySelector("canvas");
canvas.width = 1200;
canvas.height = innerHeight;
export const c = canvas.getContext("2d");

const scoreElement = document.querySelector("#score");
let score = 0;
let frames = 0;
let randomInterval = Math.floor(Math.random() * 500 + 500);
export let game = {
  over: false,
  active: true,
};

const invaderProjectiles = [];
const projectiles = [];
const grids = [];
const explosionParticles = [];
const controls = new Controls();
const player = new Player(controls, projectiles);

function explosion({ object, color, fades }) {
  for (let i = 0; i < 15; i++) {
    explosionParticles.push(
      new ExplosionParticle({
        position: {
          x: object.position.x + object.width / 2,
          y: object.position.y + object.height / 2,
        },
        velocity: {
          x: Math.random() * 4 - 2,
          y: Math.random() * 4 - 2,
        },
        radius: Math.random() * 5,
        color: color || "#BAA0DE",
        fades,
      })
    );
  }
}

//background stars
for (let i = 0; i < 80; i++) {
  explosionParticles.push(
    new ExplosionParticle({
      position: {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
      },
      velocity: {
        x: 0,
        y: 0.4,
      },
      radius: Math.random() * 2,
      color: "white",
    })
  );
}

function animate() {
  if (!game.active) return;
  requestAnimationFrame(animate);
  c.fillStyle = "rgba(0, 0, 5, 1)";
  c.fillRect(0, 0, canvas.width, canvas.height);

  player.update();

  explosionParticles.forEach((particle, i) => {
    if (particle.position.y - particle.radius >= canvas.height) {
      particle.position.x = Math.random() * canvas.width;
      particle.position.y = -particle.radius;
    }

    if (particle.opacity <= 0) {
      setTimeout(() => {
        explosionParticles.splice(i, 1);
      }, 0);
    } else {
      particle.update();
    }
  });

  invaderProjectiles.forEach((invaderProjectile, i) => {
    if (
      invaderProjectile.position.y + invaderProjectile.height >=
      canvas.height
    ) {
      setTimeout(() => {
        invaderProjectiles.splice(i, 1);
      }, 0);
    } else {
      invaderProjectile.update();
    }

    //Lose condition
    if (
      invaderProjectile.position.y + invaderProjectile.height >=
        player.position.y + player.height / 2 &&
      invaderProjectile.position.x + invaderProjectile.width >=
        player.position.x &&
      invaderProjectile.position.x <= player.position.x + player.width
    ) {
      setTimeout(() => {
        invaderProjectiles.splice(i, 1);
        player.opacity = 0;
        game.over = true;
      }, 0);

      setTimeout(() => {
        game.active = false;
      }, 1000);

      explosion({ object: player, color: "yellow", fades: true });
    }
  });

  projectiles.forEach((projectile, i) => {
    if (projectile.position.y + projectile.radius <= 0) {
      setTimeout(() => {
        projectiles.splice(i, 1);
      }, 0);
    } else {
      projectile.update();
    }
  });

  grids.forEach((grid) => {
    grid.update();

    // spawn invaderProjectiles
    if (frames % 100 === 0 && grid.invaders.length > 0) {
      grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(
        invaderProjectiles
      );
    }

    grid.invaders.forEach((invader, i) => {
      invader.update({ velocity: grid.velocity });

      projectiles.forEach((projectile, j) => {
        //projectiles hit enemie
        if (
          projectile.position.x - projectile.radius <=
            invader.position.x + invader.width &&
          projectile.position.y - projectile.radius <=
            invader.position.y + invader.height &&
          projectile.position.x + projectile.radius >= invader.position.x &&
          projectile.position.y + projectile.radius >= invader.position.y
        ) {
          //make sure only one invader and projectile gets removed
          setTimeout(() => {
            const invaderFound = grid.invaders.find(
              (invader2) => invader2 === invader
            );
            const projectileFound = projectiles.find(
              (projectile2) => projectile2 === projectile
            );

            if (invaderFound && projectileFound) {
              //increase score
              score += 1;
              scoreElement.innerHTML = score
              //spawn explosion particles
              explosion({ object: invader, color: "#BAA0DE", fades: true });
              //remove invaders and projectiles
              grid.invaders.splice(i, 1);
              projectiles.splice(j, 1);

              //set new width so invaders touch sides of canvas
              if (grid.invaders.length > 0) {
                const firstInvader = grid.invaders[0];
                const lastInvader = grid.invaders[grid.invaders.length - 1];

                grid.width =
                  lastInvader.position.x -
                  firstInvader.position.x +
                  lastInvader.width;
                grid.position.x = firstInvader.position.x;
              }
            }
          }, 0);
        }
      });
    });
  });

  //spawn enemies
  if (frames % randomInterval === 0) {
    randomInterval = Math.floor(Math.random() * 500 + 500);
    frames = 0;

    grids.push(new Grid());
  }
  frames++;
}
animate();
