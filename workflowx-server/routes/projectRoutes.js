import express from "express";
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";
import { protect } from "../middleware/auth.js";
import { canModifyProject, canDeleteProject } from "../middleware/projectAccess.js";
const router = express.Router();

router.use(protect);

router.route("/").get(getProjects).post(createProject);
router
  .route("/:id")
  .get(getProject)
  .put(canModifyProject, updateProject)
  .delete(canDeleteProject, deleteProject);

export default router;
