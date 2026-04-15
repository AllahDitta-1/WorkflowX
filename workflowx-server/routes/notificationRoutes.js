import express from "express";
import {
  getMyNotifications,
  markAllRead,
} from "../controllers/notificationController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.get("/", getMyNotifications);
router.put("/read", markAllRead);

export default router;
