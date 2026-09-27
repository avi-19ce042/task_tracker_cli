#!/usr/bin/env node

// The #!/usr/bin/env node shebang enables direct script execution in Unix-like systems without explicitly calling Node.js.

import { program } from "commander";
import {
  addTask,
  deleteTask,
  updateTask,
  updateTaskStatus,
  getAllTasks,
  getTaskById,
  getTaskByStatus,
  STATUS,
} from "./src/task.js";

program.name("task-cli").description("Your Task Tracker Cli").version("1.0.0");

program
  .command("add")
  .description("Create a task")
  .argument("<des>", "Task Description")
  .action((des) => {
    try {
      const task = addTask(des);
      console.log("Created new Task");
      console.log("-".repeat(50));
      console.log(formatTask(task));
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exitCode = 1;
      return;
    }
  });

program
  .command("delete")
  .description('Delete a task')
  .requiredOption("--by-id <id>", "Task id")
  .action((opts) => {
    const id = parseId(opts.byId);
    if (id === null) return;
    try {
      const task = deleteTask(opts.byId);

      if (!task) {
        console.error(`Task with id ${id} not found.`);
        process.exitCode = 1;
        return;
      }

      console.log(`Task ${id} deleted successfully`);
    } catch (err) {
      console.log(`Error: ${err.message}`);
      process.exitCode = 1;
      return;
    }
  });

program
  .command("update")
  .description("Update Task by id")
  .option("--by-id <id>", "Task Id")
  .argument("<des>", "New Task description")
  .action((des, opts) => {
    const id = parseId(opts.byId);
    if (id === null) return;
    try {
      const task = updateTask(opts.byId, des);

      if (!task) {
        console.error(`Task with id ${id} not found.`);
        process.exitCode = 1;
        return;
      }

      console.log("Task Updated Successfully");
      console.log("-".repeat(50));
      console.log(formatTask(task));
    } catch (err) {
      console.error(`Error: ${err.message}`);
    }
  });

program
  .command("list")
  .description("List Task")
  .argument("[status]", "Filter by Status")
  .option("-a", "--all", "List All")
  .option("--by-id", "List Task by id")
  .action((status, opts) => {
    try {
      if (opts.a) {
        const tasks = getAllTasks();
        printTask(tasks);
        return;
      }

      if (opts.byId !== undefined) {
        const id = parseId(opts.byId);
        if (id === null) return;

        const task = getTaskById(id);

        if (!task) {
          console.error(`No Task found by id: ${id}`);
          process.exitCode = 1;
          return;
        }
        console.log(formatTask(task));
        return;
      }

      if (status) {
        if (!STATUS.includes(status)) {
          console.error(`Invalid status. Use: ${STATUSES.join(", ")}`);
          process.exitCode = 1;
          return;
        }
        const tasks = getTaskByStatus(status);
        if (!tasks) {
          console.error(`No Task found by status: ${status}`);
          process.exitCode = 1;
          return;
        }
        console.log(`Task with status ${status}`);
        console.log("-".repeat(50));
        console.log(printTask(tasks));
      }
    } catch (err) {
      console.error(`Error: ${err.message}`);
    }
  });

program
  .command("mark-in-progress")
  .description("Mark a task as in-progress")
  .requiredOption("--by-id <id>", "Task ID")
  .action((options) => {
    updateStatus(options.byId, "in-progress");
  });

program
  .command("mark-done")
  .description("Mark a task as done")
  .requiredOption("--by-id <id>", "Task ID")
  .action((options) => {
    updateStatus(options.byId, "done");
  });

function formatTask(task) {
  return [
    `Id: ${task.id}`,
    `Description: ${task.description}`,
    `Status: ${task.status}`,
    `updatedAt: ${task.updatedAt}`,
    `createdAt: ${task.createdAt}`,
  ];
}

function printTask(tasks) {
  if (tasks.length === 0) {
    console.log("No tasks found.");
    return;
  }
   for (const task of tasks ) {
    console.log(formatTask(task));
    console.log("-".repeat(50));
  };
}

function updateStatus(idValue, status) {
  const id = parseId(idValue);

  if (id === null) {
    return;
  }

  try {
    const task = updateTaskStatus(status, id);

    if (!task) {
      console.error(`Task with id ${id} not found.`);
      process.exitCode = 1;
      return;
    }

    console.log(`Task ${id} marked as ${status}.`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exitCode = 1;
  }
}

function parseId(value) {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    console.error("Task ID must be a positive integer.");
    process.exitCode = 1;
    return null;
  }

  return id;
}

program.parse();
