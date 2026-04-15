import Project from "../models/Project.js";
import Task from "../models/Task.js";

// @route   GET /api/projects
export const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find()
      .populate("owner", "name email avatar")
      .populate("members", "name email avatar")
      .sort({ createdAt: -1 });

    // Add task count to each project
    const projectsWithCounts = await Promise.all(
      projects.map(async (project) => {
        const taskCount = await Task.countDocuments({ project: project._id });
        const completedCount = await Task.countDocuments({
          project: project._id,
          status: "completed",
        });
        return {
          ...project.toObject(),
          taskCount,
          completedCount,
          progress:
            taskCount > 0 ? Math.round((completedCount / taskCount) * 100) : 0,
        };
      }),
    );

    res.json(projectsWithCounts);
  } catch (error) {
    next(error);
  }
};


export const getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("owner", "name email avatar")
      .populate("members", "name email avatar");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/projects
export const createProject = async (req, res, next) => {
  try {
    const project = await Project.create({
      ...req.body,
      owner: req.user._id,
    });

    const populatedProject = await Project.findById(project._id)
      .populate("owner", "name email avatar")
      .populate("members", "name email avatar");

    res.status(201).json(populatedProject);
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/projects/:id
export const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("owner", "name email avatar")
      .populate("members", "name email avatar");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/projects/:id
export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    const userId = req.user._id.toString();

    if (project.owner.toString() !== userId) {
      return res.status(403).json({
        message: "Only owner can delete project",
      });
    }

    await Task.deleteMany({ project: project._id });
    await project.deleteOne();

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    next(error);
  }
};
