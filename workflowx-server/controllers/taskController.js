import Task from "../models/Task.js";
import Notification from "../models/Notification.js";

// @route   GET /api/tasks
export const getTasks = async (req, res, next) => {
  try {
    // Build filter from query params
    const userId = req.user._id;
    const filter = {
      $or: [{ createdBy: userId }, { assignedTo: userId }],
    };

    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;
    if (req.query.project) filter.project = req.query.project;
    if (req.query.assignedTo) filter.assignedTo = req.query.assignedTo;

    // Search by title
    if (req.query.search) {
      filter.title = { $regex: req.query.search, $options: "i" };
    }

    const tasks = await Task.find(filter)
      .populate("assignedTo", "name email avatar")
      .populate("createdBy", "name email")
      .populate("project", "name color")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/tasks/:id
export const getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignedTo", "name email avatar")
      .populate("createdBy", "name email")
      .populate("project", "name color")
      .populate("comments.user", "name avatar");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const userId = req.user._id.toString();
    const isCreator = task.createdBy.toString() === userId;
    const isAssignee = task.assignedTo?.toString() === userId;

    if (!isCreator && !isAssignee) {
      return res.status(403).json({
        message: "You are not allowed to view this task",
      });
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/tasks
export const createTask = async (req, res, next) => {
  try {
    const task = await Task.create({
      ...req.body,
      createdBy: req.user._id,
    });

    // Send notification to assigned user
    if (task.assignedTo) {
      await Notification.create({
        recipient: task.assignedTo,
        message: `You have been assigned: "${task.title}"`,
        type: "task-assigned",
        task: task._id,
      });
    }

    const populatedTask = await Task.findById(task._id)
      .populate("assignedTo", "name email avatar")
      .populate("createdBy", "name email")
      .populate("project", "name color");

    res.status(201).json(populatedTask);
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/tasks/:id
export const updateTask = async (req, res, next) => {
  try {
    const existingTask = await Task.findById(req.params.id);

    if (!existingTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    const prevStatus = existingTask.status;
    const nextStatus = req.body.status ?? prevStatus;
    const prevAssignee = existingTask.assignedTo?.toString() || null;
    const nextAssignee = req.body.assignedTo ?? prevAssignee;

    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("assignedTo", "name email avatar")
      .populate("createdBy", "name email")
      .populate("project", "name color");

    // Notify creator when assignee updates status
    const isStatusChanged = prevStatus !== nextStatus;
    const updaterId = req.user._id.toString();
    const creatorId = existingTask.createdBy.toString();

    if (isStatusChanged && updaterId !== creatorId) {
      const statusLabel = nextStatus.replace("-", " ");
      await Notification.create({
        recipient: existingTask.createdBy,
        message: `${req.user.name} updated "${existingTask.title}" to ${statusLabel}`,
        type: nextStatus === "completed" ? "task-completed" : "task-updated",
        task: existingTask._id,
      });
    }

    // Notify new assignee when assignment changes
    const isAssigneeChanged =
      nextAssignee && nextAssignee.toString() !== prevAssignee;

    if (isAssigneeChanged) {
      await Notification.create({
        recipient: nextAssignee,
        message: `You have been assigned: "${existingTask.title}"`,
        type: "task-assigned",
        task: existingTask._id,
      });
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/tasks/:id
export const deleteTask = async (req, res) => {
  try {
    const task = req.task || (await Task.findById(req.params.id));

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const userId = req.user._id.toString();
    const isCreator = task.createdBy.toString() === userId;
    const isAssignee = task.assignedTo?.toString() === userId;

    if (!isCreator && !isAssignee) {
      return res.status(403).json({
        message: "Only assigned user or creator can delete this task",
      });
    }

    await task.deleteOne();

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   POST /api/tasks/:id/comments
export const addComment = async (req, res, next) => {
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
        message: "You are not allowed to comment on this task",
      });
    }

    task.comments.push({
      user: req.user._id,
      text: req.body.text,
    });

    await task.save();

    const updatedTask = await Task.findById(task._id).populate(
      "comments.user",
      "name avatar",
    );

    res.json(updatedTask.comments);
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/tasks/stats/overview
export const getTaskStats = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const matchScope = {
      $or: [{ createdBy: userId }, { assignedTo: userId }],
    };

    const stats = await Task.aggregate([
      { $match: matchScope },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const priorityStats = await Task.aggregate([
      { $match: matchScope },
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
    ]);

    const totalTasks = await Task.countDocuments(matchScope);
    const overdueTasks = await Task.countDocuments({
      ...matchScope,
      dueDate: { $lt: new Date() },
      status: { $ne: "completed" },
    });

    res.json({
      totalTasks,
      overdueTasks,
      byStatus: stats,
      byPriority: priorityStats,
    });
  } catch (error) {
    next(error);
  }
};
