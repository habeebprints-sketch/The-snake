
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const scoreText = document.getElementById("score");
const gameOverBox = document.getElementById("gameOver");

const gridSize = 25;
const tileCount = canvas.width / gridSize;

let snake;
let velocityX;
let velocityY;
let food;
let bomb;

let score;
let gameRunning = false;
let gameStarted = false;
let gameSpeed = 120;

const eatSound = new Audio(
"https://assets.mixkit.co/sfx/preview/mixkit-game-ball-tap-2073.mp3"
);

const gameOverSound = new Audio(
"https://assets.mixkit.co/sfx/preview/mixkit-player-losing-or-failing-2042.mp3"
);

function initializeGame(){

    snake = [
        {x:10, y:10}
    ];

    velocityX = 0;
    velocityY = 0;

    food = randomPosition();
    bomb = randomPosition();

    score = 0;
    scoreText.innerText = score;

    gameRunning = true;
}

function randomPosition(){

    return {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
}

function startGame(){

    if(gameStarted) return;

    gameStarted = true;

    initializeGame();

    drawGame();
}

function drawGame(){

    if(!gameRunning) return;

    moveSnake();

    if(checkCollision()){

        gameOver();

        return;
    }

    ctx.fillStyle = "#111";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    drawGrid();
    drawFood();
    drawBomb();
    drawSnake();

    setTimeout(drawGame, gameSpeed);
}

function moveSnake(){

    const head = {
        x: snake[0].x + velocityX,
        y: snake[0].y + velocityY
    };

    snake.unshift(head);

    // FOOD
    if(head.x === food.x && head.y === food.y){

        eatSound.play();

        score++;
        scoreText.innerText = score;

        food = randomPosition();

        // SPEED UP
        if(gameSpeed > 50){
            gameSpeed -= 3;
        }

    } else {

        snake.pop();
    }
}

function drawSnake(){

    snake.forEach((part, index) => {

        if(index === 0){

            ctx.fillStyle = "#00ff88";

        } else {

            ctx.fillStyle = "#00cc66";
        }

        ctx.beginPath();

        ctx.roundRect(
            part.x * gridSize,
            part.y * gridSize,
            gridSize - 2,
            gridSize - 2,
            8
        );

        ctx.fill();
    });
}

function drawFood(){

    ctx.fillStyle = "red";

    ctx.beginPath();

    ctx.arc(
        food.x * gridSize + 12,
        food.y * gridSize + 12,
        10,
        0,
        Math.PI * 2
    );

    ctx.fill();
}

function drawBomb(){

    ctx.fillStyle = "black";

    ctx.beginPath();

    ctx.arc(
        bomb.x * gridSize + 12,
        bomb.y * gridSize + 12,
        11,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.fillStyle = "orange";

    ctx.font = "18px Arial";

    ctx.fillText(
        "💣",
        bomb.x * gridSize + 1,
        bomb.y * gridSize + 20
    );
}

function drawGrid(){

    ctx.strokeStyle = "#222";

    for(let i = 0; i < tileCount; i++){

        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvas.width, i * gridSize);
        ctx.stroke();
    }
}

function checkCollision(){

    const head = snake[0];

    // WALL
    if(
        head.x < 0 ||
        head.y < 0 ||
        head.x >= tileCount ||
        head.y >= tileCount
    ){
        return true;
    }

    // SELF
    for(let i = 1; i < snake.length; i++){

        if(
            head.x === snake[i].x &&
            head.y === snake[i].y
        ){
            return true;
        }
    }

    // BOMB
    if(
        head.x === bomb.x &&
        head.y === bomb.y
    ){
        return true;
    }

    return false;
}

function gameOver(){

    gameRunning = false;

    gameOverSound.play();

    gameOverBox.classList.remove("hidden");
}

function restartGame(){

    gameStarted = false;

    gameSpeed = 120;

    gameOverBox.classList.add("hidden");

    startGame();
}

document.addEventListener("keydown", e => {

    if(!gameRunning) return;

    switch(e.key){

        case "ArrowUp":

            if(velocityY !== 1){

                velocityX = 0;
                velocityY = -1;
            }

            break;

        case "ArrowDown":

            if(velocityY !== -1){

                velocityX = 0;
                velocityY = 1;
            }

            break;

        case "ArrowLeft":

            if(velocityX !== 1){

                velocityX = -1;
                velocityY = 0;
            }

            break;

        case "ArrowRight":

            if(velocityX !== -1){

                velocityX = 1;
                velocityY = 0;
            }

            break;
    }
});
