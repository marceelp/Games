const grid = document.querySelector('.grid')
const scoreDisplay = document.querySelector('#score')
reloadDisplay = document.querySelector('#reload')
const blockWidth = 100
const blockHeight = 20
const ballSize = 20
const boardWidth = 780 //only used for user-block to not go out of the board (so if the boardWith changes, i do not have to set a new max movement to the ride side for the user board, that automatically happens)
const boardHeight = 600
let timerID // i want to clear the timerID when the ball needs to stop (end)
let xDirection = 3
let yDirection = 3
let score = 0


//6.add user starting point
const userStart = [320,10] // game always starts here
let currentPosition = userStart


//10.add ball starting point
const ballStart = [380,40]
let ballCurrentPosition = ballStart


//2.create block
class Block {
    constructor(xAxis, yAxis) { // setting coordinates of the corners
        this.bottomLeft = [xAxis, yAxis]
        this.bottomRight = [xAxis + blockWidth, yAxis]
        this.topLeft = [xAxis, yAxis + blockHeight]
        this.topRight = [xAxis + blockWidth, yAxis + blockHeight]
    }
}


//3.all my blocks
const blocks = [
  new Block(10, 560),
  new Block(120, 560),
  new Block(230, 560),
  new Block(340, 560),
  new Block(450, 560),
  new Block(560, 560),
  new Block(670, 560),
  new Block(10, 510),
  new Block(120, 510),
  new Block(230, 510),
  new Block(340, 510),
  new Block(450, 510),
  new Block(560, 510),
  new Block(670, 510),
  new Block(10, 460),
  new Block(120, 460),
  new Block(230, 460),
  new Block(340, 460),
  new Block(450, 460),
  new Block(560, 460),
  new Block(670, 460),
  new Block(10, 410),
  new Block(120, 410),
  new Block(230, 410),
  new Block(340, 410),
  new Block(450, 410),
  new Block(560, 410),
  new Block(670, 410),
];


//1.create "draw my block-function"
function addBlocks() {
    //4.change in a for loop to draw all the blocks
    for (let i = 0; i < blocks.length; i++) {
        const block = document.createElement("div"); //create block
        block.classList.add("block"); //add class 'block'
        block.style.left = blocks[i].bottomLeft[0] + 'px'
        block.style.bottom = blocks[i].bottomLeft[1] + 'px'
        grid.appendChild(block);
    }
}
addBlocks()


//5.add user
const user = document.createElement('div')
user.classList.add('user')
drawUser() //replaced in step 8, before it looked like the points in the function of 8.
grid.appendChild(user)


//8.draw the user (just cause we use it that often to replace it with 'drawUser()'), cause its easier
function drawUser() {
    user.style.left = currentPosition[0] + "px";
    user.style.bottom = currentPosition[1] + "px";
}


//11.draw the ball
function drawBall() {
    ball.style.left = ballCurrentPosition[0] + "px";
    ball.style.bottom = ballCurrentPosition[1] + "px";
}


//7.move user
function moveUser(e) {
    switch(e.key) { //sth gets passed through e.key->if it equals the case, it executes,then need break
        case 'ArrowLeft':
            if (currentPosition[0] > 30) {
              currentPosition[0] -= 40; // first move xAxis position
              drawUser(); // then redraw user on new position
            }
            break
        case 'ArrowRight':
            if (currentPosition[0] < boardWidth - 170) {
                currentPosition[0] += 40;
                drawUser();
            }
            break
    }
}
document.addEventListener('keydown', moveUser)


//9.add ball
const ball = document.createElement('div')
ball.classList.add('ball')
drawBall()
grid.appendChild(ball) // 'grid' is the parent, i put it inside the parent with appendChild(item-name)


//12.move ball
function moveBall() {
    ballCurrentPosition[0] += xDirection
    ballCurrentPosition[1] += yDirection
    drawBall()
    checkForCollisions()
}
//13.set the moving speed
timerID = setInterval(moveBall, 10)


//14.check for collisions
function checkForCollisions() {

    //17.check for ball-block collision
    for (let i = 0; i < blocks.length; i++) {
        if ((ballCurrentPosition[0] > blocks[i].bottomLeft[0] && ballCurrentPosition[0] < blocks[i].bottomRight[0]) && ((ballCurrentPosition[1] + ballSize) > blocks[i].bottomLeft[1] && ballCurrentPosition[1] < blocks[i].topLeft[1])) {
            const allBlocks = Array.from(document.querySelectorAll('.block'))
            allBlocks[i].classList.remove('block')
            blocks.splice(i, 1) //remove the one item we're hitting from "blocks"-array
            changeDirection()
            score++
            scoreDisplay.innerHTML = score

            //20.check for win
            if (blocks.length === 0) {
                scoreDisplay.innerHTML = 'YOU WIN'
                reloadDisplay.innerHTML = "Reload page to play again";
                clearInterval(timerID)
                document.removeEventListener('keydown', moveUser)
            }
        }
    }

    //18.check for wall collisions
    if (ballCurrentPosition[0] >= (boardWidth - ballSize) ||
        ballCurrentPosition[1] >= (boardHeight - ballSize) ||
        ballCurrentPosition[0] <= 0) {
        changeDirection()
    }

    //19.check for user-ball collisions
    if ((ballCurrentPosition[0] > currentPosition[0] && ballCurrentPosition[0] < currentPosition[0] + (blockWidth + 40)) && (ballCurrentPosition[1] > currentPosition[1] && ballCurrentPosition[1] < currentPosition[1] + blockHeight)) {
        changeDirection()
    }

    //16.check for game over
    if (ballCurrentPosition[1] <= 0) {
        clearInterval(timerID)
        scoreDisplay.innerHTML = 'You lose!'
        reloadDisplay.innerHTML = 'Reload page to play again'
        document.removeEventListener('keydown', moveUser)
    }
}


//15.change direction when collision
function changeDirection() {
    if (xDirection === 3 && yDirection === 3) {
        xDirection = -3
        return
    } else if (xDirection === -3 && yDirection === 3) {
        yDirection = -3
        return
    } else if (xDirection === -3 && yDirection === -3) {
        xDirection = 3
        return
    } else if (xDirection === 3 && yDirection === -3) {
        yDirection = 3
        return
    }
}
