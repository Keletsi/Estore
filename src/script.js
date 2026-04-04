const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
let snake = [{x: 50, y: 50}, {x: 40, y: 40}, {x: 30, y: 30}]; // Starting snake
let food = {x: 150, y: 150}; // Starting food
let score = 0;
let direction = 'right';  // 'up', 'down', 'left', 'right'
const speed = 10; // Movement speed
let gameRunning = true;

// Game functions
function drawSnake() {
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = 'green';
    ctx.fillRect(snake[i].x, snake[i].y, 10, 10);
  }
}

function drawFood() {
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x, food.y, 10, 10);
}

function update() {
  if (!gameRunning) return;

  // Update food position
  food.x = Math.floor(Math.random() * 35 + 50);  //Ensure food starts outside snake
  food.y = Math.floor(Math.random() * 35 + 50);

  // Check if snake eats food
  if (snake[0] === food) {
    score++;
    snake.length++;
    food = {x: Math.floor(Math.random() * 35 + 50), y: Math.floor(Math.random() * 35 + 50)};
  } else {
    // Move snake
    for (let i = snake.length - 1; i > 0; i--) {
      snake[i] = snake[i - 1];
    }
    snake[0].x += direction === 'right' ? speed : direction === 'left' ? -speed : direction === 'up' ? -speed : speed;
    snake[0].y += direction === 'right' ? speed : direction === 'left' ? -speed : direction === 'up' ? -speed : speed;

    // Check for game over (hit wall or self)
    if (snake[0].x < 0 || snake[0].x > canvas.width || snake[0].y < 0 || snake[0].y > canvas.height) {
      gameRunning = false;
    }

    // Check if snake hit itself
    for (let i = 1; i < snake.length; i++) {
      if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
        gameRunning = false;
        break;
      }
    }
  }

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw everything
  drawSnake();
  drawFood();
  ctx.fillStyle = 'black';
  ctx.font = '16px Arial';
  ctx.fillText('Score: ' + score, 10, 20);  // Score Display
}

// Event listeners
document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowUp' && direction !== 'down') {
    direction = 'up';
  } else if (event.key === 'ArrowDown' && direction !== 'up') {
    direction = 'down';
  } else if (event.key === 'ArrowLeft' && direction !== 'right') {
    direction = 'left';
  } else if (event.key === 'ArrowRight' && direction !== 'left') {
    direction = 'right';
  }
});

// Game loop
setInterval(update, 150); //Adjust interval to change speed
