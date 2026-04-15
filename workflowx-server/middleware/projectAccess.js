import Project from "../models/Project.js";

export const canModifyProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const userId = req.user._id.toString();

    const isOwner = project.owner.toString() === userId;
    const isMember = project.members?.some(
      (m) => m.toString() === userId
    );

    if (!isOwner && !isMember) {
      return res.status(403).json({
        message: "You are not allowed to modify this project",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const canDeleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const userId = req.user._id.toString();
    const isOwner = project.owner.toString() === userId;

    if (!isOwner) {
      return res.status(403).json({
        message: "Only owner can delete project",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};
