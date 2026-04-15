import User from "../models/User.js";

// @route   GET /api/users
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/users/:id
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/users/profile
export const updateProfile = async (req, res, next) => {
  try {
    const { name, email, department, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email, department, avatar },
      { new: true, runValidators: true }
    );

    res.json(user);
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/users/:id/role  (admin only)
export const updateUserRole = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: req.body.role },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/users/:id  (admin only)
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};