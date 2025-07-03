let tasks = {};
let selectedDate = "";

function populateDateSelectors() {
  const daySelect = document.getElementById("day");
  const monthSelect = document.getElementById("month");
  const yearSelect = document.getElementById("year");

  for (let i = 1; i <= 31; i++) {
    daySelect.innerHTML += `<option value="${i}">${i}</option>`;
  }

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  months.forEach((month, idx) => {
    monthSelect.innerHTML += `<option value="${idx + 1}">${month}</option>`;
  });

  const yearNow = new Date().getFullYear();
  for (let i = yearNow - 5; i <= yearNow + 5; i++) {
    yearSelect.innerHTML += `<option value="${i}">${i}</option>`;
  }

  const today = new Date();
  daySelect.value = today.getDate();
  monthSelect.value = today.getMonth() + 1;
  yearSelect.value = today.getFullYear();
}

function getDateKey() {
  const day = document.getElementById("day").value.padStart(2, '0');
  const month = document.getElementById("month").value.padStart(2, '0');
  const year = document.getElementById("year").value;
  return `${year}-${month}-${day}`;
}

function saveTasksToLocalStorage() {
  localStorage.setItem("dailyTasks", JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
  const saved = localStorage.getItem("dailyTasks");
  if (saved) {
    tasks = JSON.parse(saved);
  }
}

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const taskText = taskInput.value.trim();
  if (!taskText) return;

  const dateKey = getDateKey();
  if (!tasks[dateKey]) tasks[dateKey] = [];

  tasks[dateKey].push({ text: taskText, done: false });
  taskInput.value = "";
  saveTasksToLocalStorage();
  renderTasks();
}

function toggleTask(index) {
  const dateKey = getDateKey();
  tasks[dateKey][index].done = !tasks[dateKey][index].done;
  saveTasksToLocalStorage();
  renderTasks();
}

function deleteTask(index) {
  const dateKey = getDateKey();
  tasks[dateKey].splice(index, 1);
  saveTasksToLocalStorage();
  renderTasks();
}

function renderTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";
  const dateKey = getDateKey();

  if (!tasks[dateKey]) return;

  tasks[dateKey].forEach((task, index) => {
    const li = document.createElement("li");
    li.className = task.done ? "done" : "";
    li.innerHTML = `
      ${task.text}
      <span>
        <button onclick="toggleTask(${index})">✔</button>
        <button onclick="deleteTask(${index})">🗑</button>
      </span>
    `;
    list.appendChild(li);
  });
}

document.getElementById("day").addEventListener("change", renderTasks);
document.getElementById("month").addEventListener("change", renderTasks);
document.getElementById("year").addEventListener("change", renderTasks);

// Initialize on page load
window.onload = function () {
  populateDateSelectors();
  loadTasksFromLocalStorage();
  renderTasks();
};
