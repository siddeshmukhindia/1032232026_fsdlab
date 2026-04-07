const taskForm = document.getElementById("taskForm");
const taskIdInput = document.getElementById("taskId");
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const priorityInput = document.getElementById("priority");
const statusInput = document.getElementById("status");
const dueDateInput = document.getElementById("dueDate");
const submitButton = document.getElementById("submitButton");
const cancelEditButton = document.getElementById("cancelEditButton");
const searchInput = document.getElementById("searchInput");
const filterStatus = document.getElementById("filterStatus");
const filterPriority = document.getElementById("filterPriority");
const taskList = document.getElementById("taskList");
const messageBox = document.getElementById("messageBox");
const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

const API_BASE = "/api/tasks";

function showMessage(message, type = "success") {
  messageBox.textContent = message;
  messageBox.className = `message-box message-${type}`;

  setTimeout(() => {
    messageBox.className = "message-box hidden";
  }, 2500);
}

function resetForm() {
  taskForm.reset();
  taskIdInput.value = "";
  priorityInput.value = "Medium";
  statusInput.value = "Pending";
  submitButton.textContent = "Add Task";
  cancelEditButton.classList.add("hidden");
}

function updateStats(tasks) {
  totalTasks.textContent = tasks.length;
  completedTasks.textContent = tasks.filter(
    (task) => task.status === "Completed"
  ).length;
  pendingTasks.textContent = tasks.filter(
    (task) => task.status !== "Completed"
  ).length;
}

function formatDate(dateString) {
  if (!dateString) {
    return "No due date";
  }

  return new Date(dateString).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function createTaskCard(task) {
  const card = document.createElement("article");
  const safeStatusClass = task.status.replace(/\s+/g, ".");

  card.className = "task-card";
  card.innerHTML = `
    <div class="task-card-header">
      <h3>${task.title}</h3>
      <span class="pill priority-${task.priority}">${task.priority} Priority</span>
    </div>
    <p>${task.description || "No description added for this task."}</p>
    <div class="task-meta">
      <span class="pill status-${safeStatusClass}">${task.status}</span>
      <span>Due: ${formatDate(task.dueDate)}</span>
    </div>
    <div class="task-actions">
      <button class="btn edit-btn" data-action="edit" data-id="${task.id}">Edit</button>
      <button class="btn delete-btn" data-action="delete" data-id="${task.id}">Delete</button>
    </div>
  `;

  return card;
}

async function fetchTasks() {
  const params = new URLSearchParams();

  if (searchInput.value.trim()) {
    params.append("search", searchInput.value.trim());
  }

  if (filterStatus.value) {
    params.append("status", filterStatus.value);
  }

  if (filterPriority.value) {
    params.append("priority", filterPriority.value);
  }

  const response = await fetch(`${API_BASE}?${params.toString()}`);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Unable to load tasks.");
  }

  return result.data;
}

async function renderTasks() {
  try {
    const tasks = await fetchTasks();
    updateStats(tasks);
    taskList.innerHTML = "";

    if (tasks.length === 0) {
      taskList.innerHTML =
        '<div class="empty-state">No tasks found. Add a task to get started.</div>';
      return;
    }

    tasks.forEach((task) => {
      taskList.appendChild(createTaskCard(task));
    });
  } catch (error) {
    showMessage(error.message, "error");
  }
}

async function handleSubmit(event) {
  event.preventDefault();

  const payload = {
    title: titleInput.value,
    description: descriptionInput.value,
    priority: priorityInput.value,
    status: statusInput.value,
    dueDate: dueDateInput.value,
  };

  const isEditing = Boolean(taskIdInput.value);
  const url = isEditing ? `${API_BASE}/${taskIdInput.value}` : API_BASE;
  const method = isEditing ? "PUT" : "POST";

  try {
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.errors?.join(" ") || result.message);
    }

    showMessage(result.message);
    resetForm();
    await renderTasks();
  } catch (error) {
    showMessage(error.message || "Something went wrong.", "error");
  }
}

async function handleTaskAction(event) {
  const button = event.target.closest("button[data-action]");

  if (!button) {
    return;
  }

  const { action, id } = button.dataset;

  if (action === "edit") {
    try {
      const response = await fetch(`${API_BASE}/${id}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      const task = result.data;
      taskIdInput.value = task.id;
      titleInput.value = task.title;
      descriptionInput.value = task.description;
      priorityInput.value = task.priority;
      statusInput.value = task.status;
      dueDateInput.value = task.dueDate;
      submitButton.textContent = "Update Task";
      cancelEditButton.classList.remove("hidden");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      showMessage(error.message, "error");
    }
  }

  if (action === "delete") {
    const confirmed = window.confirm("Do you want to delete this task?");

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      showMessage(result.message);
      await renderTasks();
    } catch (error) {
      showMessage(error.message, "error");
    }
  }
}

taskForm.addEventListener("submit", handleSubmit);
taskList.addEventListener("click", handleTaskAction);
cancelEditButton.addEventListener("click", resetForm);
searchInput.addEventListener("input", renderTasks);
filterStatus.addEventListener("change", renderTasks);
filterPriority.addEventListener("change", renderTasks);

resetForm();
renderTasks();
