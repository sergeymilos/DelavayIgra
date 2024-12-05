// Получаем элемент canvas и контекст для рисования
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// Загрузка изображений
const backgroundImage = new Image();
const birdImage = new Image();
backgroundImage.src = "/images/podzemele.png"; // Фон
birdImage.src = "/images/pngegg.png"; // Птица

// Параметры птицы
const bird = {
  x: 200, // Начальная позиция по X
  y: canvas.height / 2, // Начальная позиция по Y
  width: 80, // Ширина птицы
  height: 40, // Высота птицы
  gravity: 0.2, // Сила притяжения
  lift: -6, // Подъем при прыжке
  velocity: 0, // Текущая скорость падения
};

// Параметры столбов
const pipeWidth = 60; // Ширина столбов
const pipeGap = 250; // Промежуток между верхним и нижним столбом
const pipeSpeed = 2; // Скорость движения столбов
const pipeInterval = 300; // Расстояние между столбами

let pipes = []; // Массив столбов
let score = 0; // Счет
let gameStarted = false; // Флаг начала игры
let gameOver = false; // Флаг окончания игры

// Кнопка "Начать заново"
const restartButton = document.getElementById("restartButton");
restartButton.addEventListener("click", restartGame);

// События нажатия клавиш
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && !gameOver) {
    bird.velocity = bird.lift; // Поднимаем птицу
    gameStarted = true; // Игра начинается
  }
  if (e.code === "Enter" && gameOver) {
    restartGame(); // Рестарт игры по нажатию Enter
  }
});

// Инициализация столбов
function initializePipes() {
  pipes = [];
  let initialX = canvas.width; // Начальная позиция первого столба

  for (let i = 0; i < 3; i++) {
    const topHeight = Math.random() * (canvas.height / 2); // Высота верхнего столба
    const bottomHeight = canvas.height - topHeight - pipeGap; // Высота нижнего столба

    pipes.push({
      x: initialX + i * pipeInterval, // Расстояние между столбами
      top: topHeight,
      bottom: bottomHeight,
    });
  }
}

// Создание нового столба
function createNewPipe() {
  const lastPipe = pipes[pipes.length - 1]; // Берем последний столб в массиве
  const newX = lastPipe.x + pipeInterval; // Новый столб с фиксированным интервалом
  const topHeight = Math.random() * (canvas.height / 2); // Высота верхнего столба
  const bottomHeight = canvas.height - topHeight - pipeGap; // Высота нижнего столба

  pipes.push({
    x: newX,
    top: topHeight,
    bottom: bottomHeight,
  });
}

// Обновление столбов
function updatePipes() {
  if (!gameStarted) return;

  pipes.forEach((pipe) => {
    pipe.x -= pipeSpeed; // Движение столбов влево
  });

  // Удаляем столбы, которые вышли за пределы экрана
  if (pipes[0].x + pipeWidth < 0) {
    pipes.shift();
    score++; // Увеличиваем счет
  }

  // Добавляем новый столб, если последний достаточно далеко
  if (pipes[pipes.length - 1].x < canvas.width - pipeInterval) {
    createNewPipe();
  }
}

// Отрисовка фона
function drawBackground() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}

// Отрисовка птицы
function drawBird() {
  ctx.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
}

// Отрисовка столбов
function drawPipes() {
  pipes.forEach((pipe) => {
    ctx.fillStyle = "#800080";
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top); // Верхний столб
    ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipeWidth, pipe.bottom); // Нижний столб
  });
}

// Проверка столкновений
function checkCollision() {
  if (bird.y + bird.height >= canvas.height || bird.y <= 0) {
    gameOver = true;
  }

  pipes.forEach((pipe) => {
    if (
      bird.x < pipe.x + pipeWidth &&
      bird.x + bird.width > pipe.x &&
      (bird.y < pipe.top || bird.y + bird.height > canvas.height - pipe.bottom)
    ) {
      gameOver = true;
    }
  });

  if (gameOver) {
    restartButton.style.display = "block";
  }
}

// Игровой цикл
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Очищаем экран
  drawBackground(); // Отрисовываем фон

  if (gameStarted) {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;
    updatePipes();
  }

  drawBird();
  drawPipes();
  checkCollision();

  // Отображение счета
  ctx.fillStyle = "#fff";
  ctx.font = "20px Arial";
  ctx.fillText(`Счет: ${score}`, 40, 30);

  if (!gameOver) {
    requestAnimationFrame(gameLoop);
  } else {
    ctx.fillStyle = "#000000";
    ctx.font = "60px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Игра окончена", canvas.width / 2, canvas.height / 2);
    ctx.font = "18px Arial";
    ctx.textAlign = "center";
    ctx.fillText(
      "Для продолжения нажмите Enter или 'Начать заново' ",
      canvas.width / 2,
      canvas.height / 1.2
    );
  }
}

// Перезапуск игры
function restartGame() {
  gameOver = false;
  gameStarted = false;
  restartButton.style.display = "none"; // Скрываем кнопку рестарта
  score = 0;
  bird.y = canvas.height / 2;
  bird.velocity = 0;
  initializePipes(); // Инициализируем столбы
  requestAnimationFrame(gameLoop);
}

// Запуск игры
initializePipes();
gameLoop();
