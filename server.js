const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs/promises");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "tasks.json");

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

async function ensureDataFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, "[]", "utf8");
  }
}

async function readTasks() {
  await ensureDataFile();
  const rawData = await fs.readFile(DATA_FILE, "utf8");

  try {
    return JSON.parse(rawData);
  } catch {
    return [];
  }
}

async function writeTasks(tasks) {
  await fs.writeFile(DATA_FILE, JSON.stringify(tasks, null, 2), "utf8");
}

function normalizeTask(task) {
  return {
    id: task.id,
    title: task.title.trim(),
    description: (task.description || "").trim(),
    priority: task.priority || "Medium",
    status: task.status || "Pending",
    dueDate: task.dueDate || "",
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  };
}

function validateTaskPayload(body, isPartial = false) {
  const allowedPriorities = ["Low", "Medium", "High"];
  const allowedStatuses = ["Pending", "In Progress", "Completed"];
  const errors = [];

  if (!isPartial || Object.prototype.hasOwnProperty.call(body, "title")) {
    if (typeof body.title !== "string" || !body.title.trim()) {
      errors.push("Title is required.");
    }
  }

  if (
    Object.prototype.hasOwnProperty.call(body, "priority") &&
    !allowedPriorities.includes(body.priority)
  ) {
    errors.push("Priority must be Low, Medium, or High.");
  }

  if (
    Object.prototype.hasOwnProperty.call(body, "status") &&
    !allowedStatuses.includes(body.status)
  ) {
    errors.push("Status must be Pending, In Progress, or Completed.");
  }

  if (
    Object.prototype.hasOwnProperty.call(body, "description") &&
    typeof body.description !== "string"
  ) {
    errors.push("Description must be a string.");
  }

  if (
    Object.prototype.hasOwnProperty.call(body, "dueDate") &&
    typeof body.dueDate !== "string"
  ) {
    errors.push("Due date must be a string.");
  }

  return errors;
}

app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "Server is running." });
});

app.get("/api/tasks", async (req, res) => {
  const { status, priority, search } = req.query;
  let tasks = await readTasks();

  if (status) {
    tasks = tasks.filter((task) => task.status === status);
  }

  if (priority) {
    tasks = tasks.filter((task) => task.priority === priority);
  }

  if (search) {
    const term = search.toLowerCase();
    tasks = tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(term) ||
        task.description.toLowerCase().includes(term)
    );
  }

  res.json({ success: true, count: tasks.length, data: tasks });
});

app.get("/api/tasks/:id", async (req, res) => {
  const tasks = await readTasks();
  const task = tasks.find((item) => item.id === req.params.id);

  if (!task) {
    return res.status(404).json({ success: false, message: "Task not found." });
  }

  res.json({ success: true, data: task });
});

app.post("/api/tasks", async (req, res) => {
  const errors = validateTaskPayload(req.body);

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  const tasks = await readTasks();
  const now = new Date().toISOString();
  const task = normalizeTask({
    id: crypto.randomUUID(),
    title: req.body.title,
    description: req.body.description,
    priority: req.body.priority,
    status: req.body.status,
    dueDate: req.body.dueDate,
    createdAt: now,
    updatedAt: now,
  });

  tasks.push(task);
  await writeTasks(tasks);

  res.status(201).json({
    success: true,
    message: "Task created successfully.",
    data: task,
  });
});

app.put("/api/tasks/:id", async (req, res) => {
  const errors = validateTaskPayload(req.body, true);

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  const tasks = await readTasks();
  const index = tasks.findIndex((item) => item.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: "Task not found." });
  }

  const updatedTask = normalizeTask({
    ...tasks[index],
    ...req.body,
    updatedAt: new Date().toISOString(),
  });

  tasks[index] = updatedTask;
  await writeTasks(tasks);

  res.json({
    success: true,
    message: "Task updated successfully.",
    data: updatedTask,
  });
});

app.delete("/api/tasks/:id", async (req, res) => {
  const tasks = await readTasks();
  const index = tasks.findIndex((item) => item.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: "Task not found." });
  }

  const [deletedTask] = tasks.splice(index, 1);
  await writeTasks(tasks);

  res.json({
    success: true,
    message: "Task deleted successfully.",
    data: deletedTask,
  });
});

app.use((error, _req, res, next) => {
  if (error instanceof SyntaxError && "body" in error) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON payload.",
    });
  }

  return next(error);
});

app.use((req, res, next) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ success: false, message: "API route not found." });
  }

  return res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, async () => {
  await ensureDataFile();
  console.log(`Server running at http://localhost:${PORT}`);
});
