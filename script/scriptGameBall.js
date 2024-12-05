const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const restartButton = document.getElementById("restartButton");

const scaleFactor = 1.7;

let ballRadius = 7 * scaleFactor;
let x = canvas.width / 2;
let y = canvas.height - 30 * scaleFactor;
let dx = 2 * scaleFactor;
let dy = -2 * scaleFactor;

let paddleHeight = 12 * scaleFactor;
let paddleWidth = 85 * scaleFactor;
let paddleX = (canvas.width - paddleWidth * scaleFactor) / 2;

let rightPressed = false;
let leftPressed = false;

const brickRowCount = 6;
const brickColumnCount = 3;
const brickWidth = 70 * scaleFactor;
const brickHeight = 16 * scaleFactor;
const brickPadding = 10 * scaleFactor;
const brickOffsetTop = 30 * scaleFactor;
const brickOffsetLeft = 30 * scaleFactor;

let score = 0;
let lives = 3;
let isGameOver = false;

let bricks = [];
function initBricks() {
  bricks = [];
  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
  }
}
initBricks();

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
  if (e.key === "ArrowRight") rightPressed = true;
  else if (e.key === "ArrowLeft") leftPressed = true;
}

function keyUpHandler(e) {
  if (e.key === "ArrowRight") rightPressed = false;
  else if (e.key === "ArrowLeft") leftPressed = false;
}

function mouseMoveHandler(e) {
  const relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - (paddleWidth * scaleFactor) / 2;
  }
}

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];
      if (b.status === 1) {
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy;
          b.status = 0;
          score++;
          if (score === brickRowCount * brickColumnCount) {
            isGameOver = true;
            showMessage("Ты победил, поздравляем!");
          }
        }
      }
    }
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#B22222";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        const brickX = r * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = c * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#9140de";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#9140de";
  ctx.fillText("Score: " + score, 30, 20);
}

function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#9140de";
  ctx.fillText("Lives: " + lives, canvas.width - 85, 20);
}

function showMessage(message) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "32px Arial";
  ctx.fillStyle = "#9140de";
  ctx.textAlign = "center";
  ctx.fillText(message, canvas.width / 2, canvas.height / 2);
  restartButton.style.display = "block";
}

function restartGame() {
  isGameOver = false;
  score = 0;
  lives = 3;
  x = canvas.width / 2;
  y = canvas.height - 30 * scaleFactor;
  dx = 2 * scaleFactor;
  dy = -2 * scaleFactor;
  paddleX = (canvas.width - paddleWidth) / 2;
  initBricks();
  restartButton.style.display = "none";
  draw();
}

restartButton.addEventListener("click", restartGame);

function draw() {
  if (isGameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();

  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) dx = -dx;
  if (y + dy < ballRadius) dy = -dy;
  else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) dy = -dy;
    else {
      lives--;
      if (!lives) {
        isGameOver = true;
        showMessage("GAME OVER");
      } else {
        x = canvas.width / 2;
        y = canvas.height - 30 * scaleFactor;
        dx = 2 * scaleFactor;
        dy = -2 * scaleFactor;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }

  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7 * scaleFactor;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7 * scaleFactor;
  }

  x += dx;
  y += dy;
  requestAnimationFrame(draw);
}

draw();
