const timeLeftDisplay = document.querySelector('#time-left')
const resultDisplay = document.querySelector('#result')
const startPauseButton = document.querySelector('#start-pause-button')
const squares = document.querySelectorAll('.grid div')
const logsLeft = document.querySelectorAll('.log-left')
const logsRight = document.querySelectorAll('.log-right')
const carsLeft = document.querySelectorAll('.car-left')
const carsRight = document.querySelectorAll('.car-right')


let currentIndex = 76
const width = 9
let timerID //shortcut for setting a value as null
let outcomeTimerID
let currentTime = 15


//1.make the frog move
function moveFrog(e) {
    squares[currentIndex].classList.remove('frog')

    switch(e.key) {
        case 'ArrowLeft':
            console.log('move left')
            if (currentIndex % width !== 0) {
                currentIndex -= 1
            }
            break
        case 'ArrowRight':
            console.log('move right')
            if (currentIndex % width < width - 1) {
                currentIndex += 1
            }
            break
            case 'ArrowUp':
                console.log('move up')
                if (currentIndex - width >= 0) {
                    currentIndex -= width
                }
                break
            case 'ArrowDown':
                console.log('move down')
                if (currentIndex + width < width * width) {
                    currentIndex += width;
                }
                break
    }
    
    squares[currentIndex].classList.add('frog')
}


//2.
function autoMoveElements() {
    currentTime-- // each time the function is called(all blocks move one step, the time = - 1)
    timeLeftDisplay.textContent = currentTime 
    logsLeft.forEach(leftLog => moveLogLeft(leftLog))
    //6.set it for right side too
    logsRight.forEach(rightLog => moveLogRight(rightLog))
    //7. set it for every single car too
    carsLeft.forEach(leftCar => moveCarLeft(leftCar))
    carsRight.forEach(rightCar => moveCarRight(rightCar))
}


//14.
function checkOutcomes() {
  lose();
  win();
}


//3. move log
function moveLogLeft(leftLog) {
    switch (true) {
      case leftLog.classList.contains("l1"):
        leftLog.classList.remove("l1");
        leftLog.classList.add("l5");
        break;
      case leftLog.classList.contains("l2"):
        leftLog.classList.remove("l2");
        leftLog.classList.add("l1");
        break;
      case leftLog.classList.contains("l3"):
        leftLog.classList.remove("l3");
        leftLog.classList.add("l2");
        break;
      case leftLog.classList.contains("l4"):
        leftLog.classList.remove("l4");
        leftLog.classList.add("l3");
        break;
      case leftLog.classList.contains("l5"):
        leftLog.classList.remove("l5");
        leftLog.classList.add("l4");
        break;
    }
}


//5. move log
function moveLogRight(rightLog) {
    switch (true) {
      case rightLog.classList.contains("l1"):
        rightLog.classList.remove("l1");
        rightLog.classList.add("l2");
        break;
      case rightLog.classList.contains("l2"):
        rightLog.classList.remove("l2");
        rightLog.classList.add("l3");
        break;
      case rightLog.classList.contains("l3"):
        rightLog.classList.remove("l3");
        rightLog.classList.add("l4");
        break;
      case rightLog.classList.contains("l4"):
        rightLog.classList.remove("l4");
        rightLog.classList.add("l5");
        break;
      case rightLog.classList.contains("l5"):
        rightLog.classList.remove("l5");
        rightLog.classList.add("l1");
        break;
    }
}


//8. move left car
function moveCarLeft(leftCar) {
  switch (true) {
    case leftCar.classList.contains("c1"):
      leftCar.classList.remove("c1");
      leftCar.classList.add("c2");
      break;
    case leftCar.classList.contains("c2"):
      leftCar.classList.remove("c2");
      leftCar.classList.add("c3");
      break;
    case leftCar.classList.contains("c3"):
      leftCar.classList.remove("c3");
      leftCar.classList.add("c1");
      break;
  }
}

//9. move right car
function moveCarRight(rightCar) {
  switch (true) {
    case rightCar.classList.contains("c1"):
      rightCar.classList.remove("c1");
      rightCar.classList.add("c3");
      break;
    case rightCar.classList.contains("c2"):
      rightCar.classList.remove("c2");
      rightCar.classList.add("c1");
      break;
    case rightCar.classList.contains("c3"):
      rightCar.classList.remove("c3");
      rightCar.classList.add("c2");
      break;
  }
}


//10. what happens if i hit something
function lose() {
    if (
        squares[currentIndex].classList.contains('c1') || 
        squares[currentIndex].classList.contains('l4') || 
        squares[currentIndex].classList.contains('l5') || 
        currentTime <= 0
    ) { 
        resultDisplay.textContent = 'GAME OVER, you lose!'
        clearInterval(timerID)
        clearInterval(outcomeTimerID)
        squares[currentIndex].classList.remove('frog')
        document.removeEventListener('keyup', moveFrog)
    }
}


//11.
function win() {
    if (squares[currentIndex].classList.contains('ending-block')) {
        resultDisplay.textContent = "You win!";
        clearInterval(timerID);
        clearInterval(outcomeTimerID);
        document.removeEventListener("keyup", moveFrog);
    }
}


//12.
startPauseButton.addEventListener('click', () => {
    if (timerID) {
        clearInterval(timerID)
        timerID = null
        //14. clear "outcomeTimerID" interval too
        clearInterval(outcomeTimerID)
        outcomeTimerID = null
        document.removeEventListener("keyup", moveFrog);
    } else {
        //4. set the timer
        timerID = setInterval(autoMoveElements, 1000) //ms so 1000ms, 1s
        //13. set outComeTimerID
        outcomeTimerID = setInterval(checkOutcomes, 50)
        document.addEventListener('keyup', moveFrog)
    }
})
