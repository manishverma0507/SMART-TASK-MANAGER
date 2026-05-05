const express = require("express");
const { body } = require("express-validator");
const {
  createTask,
  getTasksByProject,
  updateTask,
  deleteTask,
  getMyTasks,
} = require("../controllers/taskController");

const router = express.Router();

router.get("/my-tasks", getMyTasks);
router.get("/project/:projectId", getTasksByProject);

router.post(
  "/",
  [
    body("title").trim().isLength({ min: 3 }).withMessage("Task title must be at least 3 characters"),
    body("description")
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage("Description cannot exceed 1000 characters"),
    body("status")
      .optional()
      .isIn(["todo", "in-progress", "completed"])
      .withMessage("Invalid task status"),
    body("deadline")
      .optional({ checkFalsy: true, nullable: true })
      .isISO8601()
      .withMessage("Deadline must be a valid date"),
    body("assignedTo").isMongoId().withMessage("Assignee is required"),
    body("project").isMongoId().withMessage("Project is required"),
  ],
  createTask
);

router.put(
  "/:id",
  [
    body("title")
      .optional()
      .trim()
      .isLength({ min: 3 })
      .withMessage("Task title must be at least 3 characters"),
    body("description")
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage("Description cannot exceed 1000 characters"),
    body("status")
      .optional()
      .isIn(["todo", "in-progress", "completed"])
      .withMessage("Invalid task status"),
    body("deadline")
      .optional({ checkFalsy: true, nullable: true })
      .isISO8601()
      .withMessage("Deadline must be a valid date"),
    body("assignedTo").optional().isMongoId().withMessage("Assignee must be valid"),
  ],
  updateTask
);

router.delete("/:id", deleteTask);

module.exports = router;
