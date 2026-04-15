import Task from "../models/Task.js";

export const canModifyTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const userId = req.user._id.toString();

    const isCreator = task.createdBy.toString() === userId;
    const isAssignee = task.assignedTo?.toString() === userId;

    if (!isCreator && !isAssignee) {
      return res.status(403).json({
        message: "You are not allowed to modify this task",
      });
    }

    req.task = task; // optional reuse
    next();
  } catch (error) {
    next(error);
  }
};