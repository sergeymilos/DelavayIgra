const canvas = document.getElementById("dvdCanvas");
const ctx = canvas.getContext("2d");

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

const dvdLogos = []; // Массив логотипов DVD

// Создание нового логотипа
function createDvdLogo() {
  return {
    width: 120,
    height: 60,
    x: Math.random() * (canvasWidth - 120),
    y: Math.random() * (canvasHeight - 60),
    dx: Math.random() < 0.5 ? 3 : -3, // Случайное направление по x
    dy: Math.random() < 0.5 ? 2 : -2, // Случайное направление по y
    color: getRandomColor(),
  };
}

// Функция для генерации случайного цвета
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Отрисовка всех логотипов DVD
function drawLogos() {
  dvdLogos.forEach((logo) => {
    ctx.beginPath();
    ctx.ellipse(
      logo.x + logo.width / 2,
      logo.y + logo.height / 2,
      logo.width / 2,
      logo.height / 2,
      0,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = logo.color;
    ctx.fill();
    ctx.closePath();
  });
}

// Обновление позиций всех логотипов
function updatePositions() {
  dvdLogos.forEach((logo) => {
    logo.x += logo.dx;
    logo.y += logo.dy;

    // Удары о края
    if (logo.x + logo.width > canvasWidth || logo.x < 0) {
      logo.dx = -logo.dx;
      logo.color = getRandomColor(); // Меняем цвет при столкновении
    }
    if (logo.y + logo.height > canvasHeight || logo.y < 0) {
      logo.dy = -logo.dy;
      logo.color = getRandomColor(); // Меняем цвет при столкновении
    }
  });
}

// Анимация
function animate() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight); // Очистка холста
  drawLogos();
  updatePositions();
  requestAnimationFrame(animate);
}

// Добавление нового логотипа
document.getElementById("addButton").addEventListener("click", () => {
  dvdLogos.push(createDvdLogo());
});

// Удаление последнего логотипа
document.getElementById("removeButton").addEventListener("click", () => {
  if (dvdLogos.length > 0) {
    dvdLogos.pop();
  }
});

// Запуск анимации
animate();
