//1
const squares = document.querySelectorAll('.square')
const mole = document.querySelector('.mole')
const timeLeft = document.querySelector('#time-left')
const score = document.querySelector('#score')

//2
let result = 0
let hitPosition
//8
let currentTime = 15
//10
let timerID = null

//3
function randomSquare() {
    squares.forEach(square => {
        square.classList.remove('mole')
    })
    let randomSquare = squares[Math.floor(Math.random() * 9)]
    randomSquare.classList.add('mole')

    hitPosition = randomSquare.id
}

//5
squares.forEach(square => {
    square.addEventListener('mousedown', () => {
        if (square.id == hitPosition) {
            result++
            score.textContent = result // to score result in "score" element
            hitPosition = null
        }
    })
})

//4
function moveMole() {
    timerID = setInterval(randomSquare, 500)
}
moveMole()

//6
function countDown() {
    currentTime--
    timeLeft.textContent = currentTime

    //9
    if (currentTime == 0) {
        clearInterval(countDownTimerID)
        //11
        clearInterval(timerID)
        alert('GAME OVER! Your final score is ' + result)
    }
}

//7
let countDownTimerID = setInterval(countDown, 1000)
