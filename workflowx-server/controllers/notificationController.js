import Notification from "../models/Notification.js";

// @route   GET /api/notifications
export const getMyNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({
      recipient: req.user._id,
    })
      .populate("task", "title status")
      .sort({ createdAt: -1 })
      .limit(30);

    res.json(notifications);
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/notifications/read
export const markAllRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, read: false },
      { $set: { read: true } }
    );
    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    next(error);
  }
};
