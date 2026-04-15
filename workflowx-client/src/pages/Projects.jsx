import { useState, useEffect } from "react";
import { HiOutlinePlus } from "react-icons/hi";
import toast from "react-hot-toast";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Modal from "../components/ui/Modal";
import {
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
  fetchUsers,
} from "../services/api";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [users, setUsers] = useState([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    status: "planning",
    deadline: "",
    members: [],
    color: "#3B82F6",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [projRes, userRes] = await Promise.all([
        fetchProjects(),
        fetchUsers(),
      ]);
      setProjects(projRes.data);
      setUsers(userRes.data);
    } catch (error) {
      toast.error("Failed to load projects");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateProject(editing._id, form);
        toast.success("Project updated!");
      } else {
        await createProject(form);
        toast.success("Project created!");
      }
      setShowForm(false);
      setEditing(null);
      setForm({
        name: "",
        description: "",
        status: "planning",
        deadline: "",
        members: [],
        color: "#3B82F6",
      });
      loadData();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleEdit = (project) => {
    setEditing(project);
    setForm({
      name: project.name,
      description: project.description,
      status: project.status,
      deadline: project.deadline?.split("T")[0] || "",
      members: project.members?.map((m) => m._id) || [],
      color: project.color,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project and all its tasks?")) return;
    try {
      await deleteProject(id);
      toast.success("Project deleted!");
      loadData();
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Projects</h2>
        <button
          onClick={() => {
            setEditing(null);
            setForm({
              name: "",
              description: "",
              status: "planning",
              deadline: "",
              members: [],
              color: "#3B82F6",
            });
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 
          rounded-lg hover:bg-blue-700 transition text-sm font-medium"
        >
          <HiOutlinePlus className="w-4 h-4" />
          New Project
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project._id}>
            {/* Color bar */}
            <div
              className="h-2 rounded-full mb-4"
              style={{ backgroundColor: project.color }}
            ></div>

            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-gray-800">{project.name}</h3>
              <Badge text={project.status} type={project.status === "active" ? "in-progress" : project.status} />
            </div>

            <p className="text-sm text-gray-500 mb-4 line-clamp-2">
              {project.description || "No description"}
            </p>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>Progress</span>
                <span>{project.progress || 0}%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full">
                <div
                  className="h-2 rounded-full transition-all"
                  style={{
                    width: `${project.progress || 0}%`,
                    backgroundColor: project.color,
                  }}
                ></div>
              </div>
            </div>

            {/* Info */}
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>{project.taskCount || 0} tasks</span>
              <span>{project.members?.length || 0} members</span>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-4 pt-4 border-t">
              <button
                onClick={() => handleEdit(project)}
                className="flex-1 text-center py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(project._id)}
                className="flex-1 text-center py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition"
              >
                Delete
              </button>
            </div>
          </Card>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">No projects yet</p>
          <p className="text-sm">Create your first project to get started</p>
        </div>
      )}

      {/* Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditing(null);
        }}
        title={editing ? "Edit Project" : "Create Project"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Name *
            </label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClass}
              placeholder="My Awesome Project"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={3}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className={inputClass}
              >
                <option value="planning">Planning</option>
                <option value="active">Active</option>
                <option value="on-hold">On Hold</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deadline
              </label>
              <input
                type="date"
                value={form.deadline}
                onChange={(e) =>
                  setForm({ ...form, deadline: e.target.value })
                }
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color
              </label>
              <input
                type="color"
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
                className="w-full h-10 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition font-medium text-sm"
            >
              {editing ? "Update" : "Create"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditing(null);
              }}
              className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Projects;