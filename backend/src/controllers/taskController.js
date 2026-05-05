const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const Project = require("../models/Project");
const Task = require("../models/Task");

// Demo user ID
const DEMO_USER_ID = "507f1f77bcf86cd799439011";
const DEMO_USER = {
  _id: DEMO_USER_ID,
  role: "admin",
};

const hasProjectAccess = (project, user) =>
  user.role === "admin" ||
  project.createdBy.toString() === user._id.toString() ||
  project.members.some((memberId) => memberId.toString() === user._id.toString());

const canManageTask = (project, user) =>
  user.role === "admin" || project.createdBy.toString() === user._id.toString();

const createTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Validation failed", errors: errors.array() });
    }

    const project = await Project.findById(req.body.project);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (!canManageTask(project, DEMO_USER)) {
      return res.status(403).json({ message: "Only admins or project creators can create tasks" });
    }

    const isProjectMember = project.members.some(
      (memberId) => memberId.toString() === req.body.assignedTo
    );

    if (!isProjectMember) {
      return res.status(400).json({ message: "Assignee must be a project member" });
    }

    const task = await Task.create({
      title: req.body.title,
      description: req.body.description,
      status: req.body.status || "todo",
      deadline: req.body.deadline || null,
      assignedTo: req.body.assignedTo,
      project: req.body.project,
      createdBy: DEMO_USER_ID,
    });

    const populatedTask = await Task.findById(task._id)
      .populate("assignedTo", "name email role")
      .populate("createdBy", "name email role")
      .populate("project", "name");

    return res.status(201).json(populatedTask);
  } catch (error) {
    return next(error);
  }
};

const getTasksByProject = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.projectId)) {
      return res.status(400).json({ message: "Invalid project id" });
    }

    const project = await Project.findById(req.params.projectId);

    if (!project || !hasProjectAccess(project, DEMO_USER)) {
      return res.status(404).json({ message: "Project not found" });
    }

    const query = { project: req.params.projectId };

    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.assignedTo === "me") {
      query.assignedTo = DEMO_USER_ID;
    }

    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: "i" } },
        { description: { $regex: req.query.search, $options: "i" } },
      ];
    }

    if (req.query.deadline === "overdue") {
      query.deadline = { $lt: new Date() };
      query.status = { $ne: "completed" };
    }

    if (req.query.deadline === "today") {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      query.deadline = { $gte: start, $lte: end };
    }

    if (req.query.deadline === "upcoming") {
      query.deadline = { $gte: new Date() };
    }

    const tasks = await Task.find(query)
      .populate("assignedTo", "name email role")
      .populate("createdBy", "name email role")
      .sort({ deadline: 1, createdAt: -1 });

    return res.status(200).json(tasks);
  } catch (error) {
    return next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Validation failed", errors: errors.array() });
    }

    const task = await Task.findById(req.params.id).populate("project");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const project = await Project.findById(task.project._id);

    if (!project || !hasProjectAccess(project, DEMO_USER)) {
      return res.status(404).json({ message: "Project not found" });
    }

    const manager = canManageTask(project, DEMO_USER);
    const assignee = task.assignedTo.toString() === DEMO_USER_ID;

    if (!manager && !assignee) {
      return res.status(403).json({ message: "You do not have permission to update this task" });
    }

    if (!manager) {
      task.status = req.body.status ?? task.status;
    } else {
      if (req.body.assignedTo) {
        const isProjectMember = project.members.some(
          (memberId) => memberId.toString() === req.body.assignedTo
        );

        if (!isProjectMember) {
          return res.status(400).json({ message: "Assignee must be a project member" });
        }
      }

      task.title = req.body.title ?? task.title;
      task.description = req.body.description ?? task.description;
      task.status = req.body.status ?? task.status;
      task.deadline = req.body.deadline ?? task.deadline;
      task.assignedTo = req.body.assignedTo ?? task.assignedTo;
    }

    await task.save();

    const populatedTask = await Task.findById(task._id)
      .populate("assignedTo", "name email role")
      .populate("createdBy", "name email role")
      .populate("project", "name");

    return res.status(200).json(populatedTask);
  } catch (error) {
    return next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate("project");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const project = await Project.findById(task.project._id);

    if (!project || !canManageTask(project, DEMO_USER)) {
      return res.status(403).json({ message: "Only admins or project creators can delete tasks" });
    }

    await task.deleteOne();

    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    return next(error);
  }
};

const getMyTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ assignedTo: DEMO_USER_ID })
      .populate("assignedTo", "name email role")
      .populate("createdBy", "name email role")
      .populate("project", "name")
      .sort({ deadline: 1, createdAt: -1 });

    return res.status(200).json(tasks);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createTask,
  getTasksByProject,
  updateTask,
  deleteTask,
  getMyTasks,
};
