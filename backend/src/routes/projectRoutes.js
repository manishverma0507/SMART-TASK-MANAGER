const express = require("express");
const { body } = require("express-validator");
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMemberToProject,
  removeMemberFromProject,
} = require("../controllers/projectController");

const router = express.Router();

router
  .route("/")
  .post(
    [
      body("name").trim().isLength({ min: 3 }).withMessage("Project name must be at least 3 characters"),
      body("description")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Description cannot exceed 500 characters"),
    ],
    createProject
  )
  .get(getProjects);

router
  .route("/:id")
  .get(getProjectById)
  .put(
    [
      body("name")
        .optional()
        .trim()
        .isLength({ min: 3 })
        .withMessage("Project name must be at least 3 characters"),
      body("description")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Description cannot exceed 500 characters"),
    ],
    updateProject
  )
  .delete(deleteProject);

router.post(
  "/:id/add-member",
  [body("email").trim().isEmail().withMessage("Enter a valid member email").normalizeEmail()],
  addMemberToProject
);
router.delete("/:id/members/:memberId", removeMemberFromProject);

module.exports = router;
