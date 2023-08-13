const scoreBoard = document.getElementById('score');
const board = document.getElementById('board');
const context = board.getContext('2d');

// constants
const speed = 4;
const unit = 25;
let headX = 10, headY = 10;
let velocityX = 1, velocityY = 0;
let snakePosition = [[8,10], [9,10]]
let bodyLength = 2;
let foodX = 0 , foodY = 0;
let score = 0;
let pause = true;
initialize();
function initialize(){
    headX = 10; headY = 10;
    velocityX = 1; velocityY = 0;
    snakePosition = [[8,10], [9,10]];
    bodyLength = 2;
    foodX = 0; foodY = 0;
    score = 0;
    updateScore();
    startGame();
    document.body.addEventListener('keydown', (e)=> {
        switch(e.key) {
            case "ArrowLeft":
                if(velocityX === 1) return;
                velocityX = -1;
                velocityY = 0;
                break;
            case "ArrowUp":
                if(velocityY === 1) return;
                velocityX = 0;
                velocityY = -1;
                break;
            case "ArrowRight":
                if(velocityX === -1) return;
                velocityX = 1;
                velocityY = 0;
                break;
            case "ArrowDown":
                if(velocityY === -1) return;
                velocityX = 0;
                velocityY = 1;
                break;
        }
    })
    changeFoodPosition();
    draw();
}
function draw(){
    if(!pause) moveSnake();
    if(isGameOver()){
        gameOver();
        return;
    }
    clear();
    createFood();
    createSnake();
    checkCollision();
    setTimeout(draw, 1000/speed)
}
function clear(){
    context.clearRect(0, 0, 500, 500)
}
function moveSnake() {
    snakePosition.push([headX,headY]);
    headX += velocityX;
    headY += velocityY;
    snakePosition.shift();
}
function createSnake(){
    context.fillStyle = '#005C29'
    context.fillRect(headX*unit, headY*unit, unit,unit)
    for(let i = 0; i < bodyLength; ++i){
        context.fillStyle = '#138808'
        context.fillRect(snakePosition[i][0]*unit, snakePosition[i][1]*unit, unit,unit)
    }
}
function createFood() {
    context.fillStyle = "#ff0000";
    context.fillRect(foodX*unit, foodY*unit, unit, unit);
}
function changeFoodPosition(){
    foodX = Math.floor(Math.random()*(500/unit));
    foodY = Math.floor(Math.random()*(500/unit));
    if(snakePosition.includes([foodX,foodY])) changeFoodPosition();
}
function checkCollision() {
    if(foodX===headX && foodY===headY){
        changeFoodPosition();
        createFood();
        bodyLength++;
        score++;
        updateScore();
        snakePosition.unshift(snakePosition[0])
    }
}
function updateScore() {
    scoreBoard.innerHTML = `<h1>Score : ${score}</h1>`;
}
function isGameOver() {
    if(pause) return false;
    if(headX === (500/unit) || headY === (500/unit) || headY < 0 || headX < 0) return true;
    for(let j = 0; j < bodyLength; ++j)
    {
        if(headX === snakePosition[j][0] && headY === snakePosition[j][1]) return true;
    }
    return false;
}
function startGame() {
    const screen = document.createElement('div');
    screen.classList.add('screen');
    screen.innerHTML = `<h1 class="screenMessage big highlight">Snake Mania</h1><br><h1 class="screenMessage animate">Press Spacebar to START</h1>`;
    document.body.addEventListener('keydown', (e)=>{
        if(e.key === " "){
            pause = false;
            screen.remove();
        }
    })
    document.body.appendChild(screen);
}
function gameOver() {
    const screen = document.createElement('div');
    const screenButton = document.createElement('button');
    screen.classList.add('screen');
    screenButton.textContent = "Retry";
    screenButton.classList.add('Button');
    screen.innerHTML = `<h1 class="screenMessage animate big">GAME OVER</h1><span class="screenMessage">Your Score : ${score}</span>`;
    screen.appendChild(screenButton);
    screenButton.addEventListener('click', ()=>{
        pause = true;
        initialize();
        screen.remove();
    })
    document.body.appendChild(screen);
}