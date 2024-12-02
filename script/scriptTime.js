const createTaskBtn = document.getElementById("createTask");
const taskContainer = document.getElementById("taskContainer");

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

  const taskElement = document.createElement("div");
  taskElement.className = "task";

  // Task Title
  const taskTitle = document.createElement("div");
  taskTitle.className = "task-title";
  taskTitle.textContent = taskName;
  taskElement.appendChild(taskTitle);

  // Timer Display
  const timerDisplay = document.createElement("div");
  timerDisplay.className = "timer";
  let remainingTime = taskTime * 60; // Convert minutes to seconds
  timerDisplay.textContent = formatTime(remainingTime);
  taskElement.appendChild(timerDisplay);

  // Pause Button
  const pauseBtn = document.createElement("button");
  pauseBtn.textContent = "⏸ Пауза";
  taskElement.appendChild(pauseBtn);

  // Complete/Delete Button
  const actionBtn = document.createElement("button");
  actionBtn.textContent = "✔ Выполнено";
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
  });
});

// Helper Function: Format Time
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes < 10 ? "0" : ""}${minutes}:${
    remainingSeconds < 10 ? "0" : ""
  }${remainingSeconds}`;
}
