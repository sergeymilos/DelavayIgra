const createTaskBtn = document.getElementById("createTask");
const taskContainer = document.getElementById("taskContainer");

// Загружаем задачи из localStorage
function loadTasks() {
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  savedTasks.forEach((task) =>
    createTaskElement(task.name, task.remainingTime, task.isOverdue)
  );
}
loadTasks();

// Сохраняем задачи в localStorage
function saveTasks() {
  const tasks = Array.from(taskContainer.children).map((taskElement) => {
    const name = taskElement.querySelector(".task-title").textContent;
    const timeText = taskElement.querySelector(".timer").textContent;
    const isOverdue = taskElement.classList.contains("overdue");
    const remainingTime = parseTime(timeText);

    return { name, remainingTime, isOverdue };
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Создание элемента задачи
function createTaskElement(taskName, remainingTime, isOverdue = false) {
  const taskElement = document.createElement("div");
  taskElement.className = "task";
  if (isOverdue) taskElement.classList.add("overdue");

  // Task Title
  const taskTitle = document.createElement("div");
  taskTitle.className = "task-title";
  taskTitle.textContent = taskName;
  taskElement.appendChild(taskTitle);

  // Timer Display
  const timerDisplay = document.createElement("div");
  timerDisplay.className = "timer";
  timerDisplay.textContent = formatTime(remainingTime);
  taskElement.appendChild(timerDisplay);

  // Pause Button
  const pauseBtn = document.createElement("button");
  pauseBtn.textContent = "⏸ Пауза";
  taskElement.appendChild(pauseBtn);

  // Complete/Delete Button
  const actionBtn = document.createElement("button");
  actionBtn.textContent = isOverdue ? "Удалить" : "✔ Выполнено";
  taskElement.appendChild(actionBtn);

  taskContainer.appendChild(taskElement);

  // Timer State
  let interval = null;
  let isPaused = false;

  // Start Timer
  function startTimer() {
    interval = setInterval(() => {
      if (!isPaused) {
        remainingTime--;

        if (remainingTime >= 0) {
          timerDisplay.textContent = formatTime(remainingTime);
        } else {
          timerDisplay.textContent = `-${formatTime(-remainingTime)}`;
          taskElement.classList.add("overdue");
          actionBtn.textContent = "Удалить";
        }
        saveTasks(); // Сохраняем обновленное состояние
      }
    }, 1000);
  }

  startTimer();

  // Pause Button Functionality
  pauseBtn.addEventListener("click", () => {
    if (isPaused) {
      isPaused = false;
      pauseBtn.textContent = "⏸ Пауза";
    } else {
      isPaused = true;
      pauseBtn.textContent = "▶ Запуск";
    }
  });

  // Complete/Delete Button Functionality
  actionBtn.addEventListener("click", () => {
    clearInterval(interval);
    taskContainer.removeChild(taskElement);
    saveTasks(); // Сохраняем после удаления
  });
}

// Создание задачи через кнопку
createTaskBtn.addEventListener("click", () => {
  const taskNameInput = document.getElementById("taskName");
  const taskTimeInput = document.getElementById("taskTime");

  const taskName = taskNameInput.value.trim();
  const taskTime = parseInt(taskTimeInput.value);

  if (!taskName || isNaN(taskTime) || taskTime <= 0) {
    alert("Пожалуйста, введите правильные задачу и время!");
    return;
  }

  // Clear input fields
  taskNameInput.value = "";
  taskTimeInput.value = "";

  createTaskElement(taskName, taskTime * 60);
  saveTasks(); // Сохраняем после добавления
});

// Helper Functions
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes < 10 ? "0" : ""}${minutes}:${
    remainingSeconds < 10 ? "0" : ""
  }${remainingSeconds}`;
}

function parseTime(timeText) {
  const [minutes, seconds] = timeText.replace("-", "").split(":").map(Number);
  return minutes * 60 + seconds;
}
