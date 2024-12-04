const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const tileSize = 16;
const tileCount = canvas.width / tileSize;

let snake = [{ x: 8, y: 8 }];
let direction = null;
let apple = { x: Math.floor(Math.random() * tileCount), y: Math.floor(Math.random() * tileCount) };
let score = 0;

const babySnakeImage = new Image();
babySnakeImage.src = 'files/babySnake.png';

const snakeHeadImage = new Image();
snakeHeadImage.src = 'files/snakeHead.png';

const snakeBodyImage = new Image();
snakeBodyImage.src = 'files/snakeBody.png';

const snakeTailImage = new Image();
snakeTailImage.src = 'files/snakeTail.png';

const appleImage = new Image();
appleImage.src = 'files/apple.png';

const frameInterval = 4; 
let frameCount = 0; 
let currentFrame = 0;    

function drawTile(x, y, image, rotation = 0) {
    if (image.complete) {
        const frameWidth = image.width / 2;
        const frameX = currentFrame * frameWidth;

        ctx.save(); 
        ctx.translate((x + 0.5) * tileSize, (y + 0.5) * tileSize);
        ctx.rotate(rotation);
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(
            image,
            frameX,
            0,
            frameWidth,
            image.height,
            -tileSize / 2,
            -tileSize / 2,
            tileSize,
            tileSize
        );
        ctx.restore();
    } else {
        ctx.fillStyle = 'gray';
        ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    frameCount++;
    if (frameCount >= frameInterval) {
        frameCount = 0;
        currentFrame = (currentFrame + 1) % 2;
    }

    for (let i = 0; i < snake.length; i++) {
        if (i === 0) {
            let rotation = 0;
            if (direction) {
                if (direction.y === -1) rotation = 0; //Up
                else if (direction.x === 1) rotation = Math.PI / 2; //Right
                else if (direction.y === 1) rotation = Math.PI; //Down
                else if (direction.x === -1) rotation = -Math.PI / 2; //Left
            }
            drawTile(snake[i].x, snake[i].y, snake.length === 1 ? babySnakeImage : snakeHeadImage, rotation);
        } else if (i === snake.length - 1) {
            const tailSegment = snake[i];
            const beforeTailSegment = snake[i - 1];

            let tailRotation = 0;
            if (beforeTailSegment.y < tailSegment.y) tailRotation = 0; //Moving up
            else if (beforeTailSegment.x > tailSegment.x) tailRotation = Math.PI / 2; //Moving right
            else if (beforeTailSegment.y > tailSegment.y) tailRotation = Math.PI; //Moving down
            else if (beforeTailSegment.x < tailSegment.x) tailRotation = -Math.PI / 2; //Moving left

            drawTile(snake[i].x, snake[i].y, snakeTailImage, tailRotation);
        } else {
            drawTile(snake[i].x, snake[i].y, snakeBodyImage);
        }
    }
    drawTile(apple.x, apple.y, appleImage);

    
    ctx.fillStyle = 'white';
    ctx.font = '15px Arial';
    ctx.fillText(`Score: ${score}`, 10, 20);
}



function moveSnake() {
    if (!direction) return;

    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    //uncomment this and remove the "head hits the walls" if statement below for the snake to wrap around, easy new game mode
        //head.x = (head.x + tileCount) % tileCount;
        //head.y = (head.y + tileCount) % tileCount;

    //Head hits the walls
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        alert(`Game Over! Final Score: ${score}`);
        resetGame();
        return;
    }

    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        alert(`Game Over! Final Score: ${score}`);
        resetGame();
        return;
    }
    snake.unshift(head);
    if (head.x === apple.x && head.y === apple.y) {
        score++;
        apple = { x: Math.floor(Math.random() * tileCount), y: Math.floor(Math.random() * tileCount) };
    } else {
        snake.pop();
    }
}

function changeDirection(event) {
    const keyMap = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 }
    };

    const newDirection = keyMap[event.key];
    if (newDirection && (!direction || (newDirection.x !== -direction.x && newDirection.y !== -direction.y))) {
        direction = newDirection;
    }
}

function resetGame() {
    snake = [{ x: 8, y: 8 }];
    direction = null;
    score = 0;
    apple = { x: Math.floor(Math.random() * tileCount), y: Math.floor(Math.random() * tileCount) };
}

function gameLoop() {
    moveSnake();
    draw();
}

document.addEventListener('keydown', changeDirection);
setInterval(gameLoop, 100);
