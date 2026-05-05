const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const Project = require("../models/Project");
const Task = require("../models/Task");
const User = require("../models/User");

// Demo user ID
const DEMO_USER_ID = "507f1f77bcf86cd799439011";
const DEMO_USER = {
  _id: DEMO_USER_ID,
  role: "admin",
};

const getProjectAccessQuery = (user) =>
  user.role === "admin"
    ? {}
    : {
        $or: [{ createdBy: user._id }, { members: user._id }],
      };

const canManageProject = (project, user) =>
  user.role === "admin" || project.createdBy.toString() === user._id.toString();

const createProject = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Validation failed", errors: errors.array() });
    }

    const project = await Project.create({
      name: req.body.name,
      description: req.body.description,
      createdBy: DEMO_USER_ID,
      members: [DEMO_USER_ID],
    });

    const populatedProject = await Project.findById(project._id);
    
    // Return project with demo user data
    return res.status(201).json({
      ...populatedProject.toObject(),
      createdBy: {
        _id: DEMO_USER_ID,
        name: "Demo User",
        email: "demo@example.com",
        role: "admin"
      },
      members: [
        {
          _id: DEMO_USER_ID,
          name: "Demo User",
          email: "demo@example.com",
          role: "admin"
        }
      ]
    });
  } catch (error) {
    return next(error);
  }
};

const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find(getProjectAccessQuery(DEMO_USER)).sort({ createdAt: -1 });

    // Enhance projects with demo user data
    const enhancedProjects = projects.map(project => ({
      ...project.toObject(),
      createdBy: {
        _id: DEMO_USER_ID,
        name: "Demo User",
        email: "demo@example.com",
        role: "admin"
      },
      members: [
        {
          _id: DEMO_USER_ID,
          name: "Demo User",
          email: "demo@example.com",
          role: "admin"
        }
      ]
    }));

    return res.status(200).json(enhancedProjects);
  } catch (error) {
    return next(error);
  }
};

const getProjectById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid project id" });
    }

    const project = await Project.findOne({
      _id: req.params.id,
      ...getProjectAccessQuery(DEMO_USER),
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Return project with demo user data
    return res.status(200).json({
      ...project.toObject(),
      createdBy: {
        _id: DEMO_USER_ID,
        name: "Demo User",
        email: "demo@example.com",
        role: "admin"
      },
      members: [
        {
          _id: DEMO_USER_ID,
          name: "Demo User",
          email: "demo@example.com",
          role: "admin"
        }
      ]
    });
  } catch (error) {
    return next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Validation failed", errors: errors.array() });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (!canManageProject(project, DEMO_USER)) {
      return res.status(403).json({ message: "Only admins or project creators can edit projects" });
    }

    project.name = req.body.name ?? project.name;
    project.description = req.body.description ?? project.description;
    await project.save();

    const updatedProject = await Project.findById(project._id);

    return res.status(200).json({
      ...updatedProject.toObject(),
      createdBy: {
        _id: DEMO_USER_ID,
        name: "Demo User",
        email: "demo@example.com",
        role: "admin"
      },
      members: [
        {
          _id: DEMO_USER_ID,
          name: "Demo User",
          email: "demo@example.com",
          role: "admin"
        }
      ]
    });
  } catch (error) {
    return next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (!canManageProject(project, DEMO_USER)) {
      return res.status(403).json({ message: "Only admins or project creators can delete projects" });
    }

    await Task.deleteMany({ project: project._id });
    await project.deleteOne();

    return res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    return next(error);
  }
};

const addMemberToProject = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Validation failed", errors: errors.array() });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (!canManageProject(project, DEMO_USER)) {
      return res.status(403).json({ message: "Only admins or project creators can manage members" });
    }

    const member = await User.findOne({ email: req.body.email.toLowerCase() });

    if (!member) {
      return res.status(404).json({ message: "No registered user found with that email" });
    }

    const alreadyMember = project.members.some(
      (memberId) => memberId.toString() === member._id.toString()
    );

    if (alreadyMember) {
      return res.status(409).json({ message: "User is already a project member" });
    }

    project.members.push(member._id);
    await project.save();

    const updatedProject = await Project.findById(project._id);

    return res.status(200).json({
      ...updatedProject.toObject(),
      createdBy: {
        _id: DEMO_USER_ID,
        name: "Demo User",
        email: "demo@example.com",
        role: "admin"
      },
      members: [
        {
          _id: DEMO_USER_ID,
          name: "Demo User",
          email: "demo@example.com",
          role: "admin"
        }
      ]
    });
  } catch (error) {
    return next(error);
  }
};

const removeMemberFromProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (!canManageProject(project, DEMO_USER)) {
      return res.status(403).json({ message: "Only admins or project creators can manage members" });
    }

    if (project.createdBy.toString() === req.params.memberId) {
      return res.status(400).json({ message: "Project owner cannot be removed" });
    }

    project.members = project.members.filter(
      (memberId) => memberId.toString() !== req.params.memberId
    );
    await project.save();
    await Task.updateMany(
      { project: project._id, assignedTo: req.params.memberId },
      { $set: { assignedTo: project.createdBy } }
    );

    const updatedProject = await Project.findById(project._id);

    return res.status(200).json({
      ...updatedProject.toObject(),
      createdBy: {
        _id: DEMO_USER_ID,
        name: "Demo User",
        email: "demo@example.com",
        role: "admin"
      },
      members: [
        {
          _id: DEMO_USER_ID,
          name: "Demo User",
          email: "demo@example.com",
          role: "admin"
        }
      ]
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMemberToProject,
  removeMemberFromProject,
};
