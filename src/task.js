import fs from "fs";
import path from "path";

const task_file = path.join(process.cwd(), "task.json");

function isTaskFile() {
  if (!fs.existsSync(task_file)) {
    fs.writeFileSync("task.json", "[]", "utf-8");
  }
}

function readTasks() {
  const rawTask = fs.readFileSync(task_file, "utf-8");
  const tasks = JSON.parse(rawTask);
  return tasks;
}

function findTaskById(tasks, id) {
  return tasks.find(task => Number(task.id) === Number(id));
}

function saveTask(tasks) {
  fs.writeFileSync("task.json", JSON.stringify(tasks, null, 2), "utf-8");
}

function addTask(description) {
  const tasks = readTasks();

  const updatedAt = new Date().toISOString();
  const createdAt = new Date().toISOString();
  const id =  tasks.length > 0
  ? Math.max(...tasks.map(task => task.id)) + 1
  : 1;
  const task = {
    id,
    description,
    status: "",
    updatedAt: updatedAt,
    createdAt: createdAt,
  };

  tasks.push(task);
  saveTask(tasks);

  return task;
}

function deleteTask(id) {
  const tasks = readTasks();
  const taskIndex = tasks.findIndex((task) => task.id === id);

  if (taskIndex === -1) return null;

  const [deletedTask] = tasks.splice(taskIndex, 1);

  saveTask(tasks);

  return deletedTask;
}

function updateTask(id, description) {
  const tasks = readTasks();
  // const taskIndex = tasks.findIndex(task => task.id === id);
  const task = findTaskById(tasks, id);

  if (!task) return null;
  // tasks[taskIndex].description = description;
  task.description = description;
  task.updatedAt = new Date().toISOString();

  saveTask(tasks);

  return task;
}

function updateTaskStatus(status, id) {
    const tasks = readTasks();
    const task = findTaskById(tasks, id);
    if(!task) return null;

    task.status = status;

    saveTask(tasks);

    return task;
}

function getAllTasks() {
    return readTasks();
}

function getTaskById(id) {
    const tasks = readTasks();
    const task = tasks.filter(task => task.id === id);
}

function getTaskByStatus(status) {
    const tasks = readTasks();
    const statusTasks = tasks.filter(task => task.status === status);

    return statusTasks;
}

const STATUS = ["todo", "in-progress", "done"];


export { addTask, deleteTask, updateTask, updateTaskStatus, getAllTasks, getTaskById, getTaskByStatus, STATUS };
