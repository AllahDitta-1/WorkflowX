import express from "express";
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  addComment,
  getTaskStats,
} from "../controllers/taskController.js";

import { protect } from "../middleware/auth.js";
import { canModifyTask } from "../middleware/taskAccess.js";

const router = express.Router();

router.use(protect);

/*
  📊 Public for logged-in users
*/
router.get("/stats/overview", getTaskStats);
router.route("/").get(getTasks).post(createTask);

/*
  🧠 IMPORTANT: task-specific routes
*/
router
  .route("/:id")
  .get(getTask)
  .put(canModifyTask, updateTask)
  .delete(canModifyTask, deleteTask);


router.post("/:id/comments", addComment);

export default router;