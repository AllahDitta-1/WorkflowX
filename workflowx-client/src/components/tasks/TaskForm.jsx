import { useState, useEffect } from "react";
import { fetchProjects, fetchUsers } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const TaskForm = ({ task, onSubmit, onCancel }) => {
  const { user: currentUser } = useAuth();
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    project: "",
    assignedTo: "",
    dueDate: "",
    tags: "",
  });

  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const selectableUsers = users.filter(
    (u) => u._id !== currentUser?._id
  );

  // Load projects and users for dropdowns
  useEffect(() => {
    const loadData = async () => {
      const [projRes, userRes] = await Promise.all([
        fetchProjects(),
        fetchUsers(),
      ]);
      setProjects(projRes.data);
      setUsers(userRes.data);
    };
    loadData();
  }, []);

  // If editing, pre-fill the form
  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || "",
        description: task.description || "",
        status: task.status || "todo",
        priority: task.priority || "medium",
        project: task.project?._id || "",
        assignedTo: task.assignedTo?._id || "",
        dueDate: task.dueDate?.split("T")[0] || "",
        tags: task.tags?.join(", ") || "",
      });
    }
  }, [task]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      tags: form.tags
        ? form.tags.split(",").map((t) => t.trim())
        : [],
    });
  };

  const inputClass =
    "w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title *
        </label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className={inputClass}
          placeholder="Enter task title"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          className={inputClass}
          placeholder="Task details..."
        />
      </div>

      {/* Status & Priority — side by side */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="review">Review</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>

      {/* Project & Assignee */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Project *
          </label>
          <select
            name="project"
            value={form.project}
            onChange={handleChange}
            className={inputClass}
            required
          >
            <option value="">Select Project</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Assign To
          </label>
          <select
            name="assignedTo"
            value={form.assignedTo}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Unassigned</option>
            {selectableUsers.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Due Date & Tags */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Due Date
          </label>
          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tags
          </label>
          <input
            name="tags"
            value={form.tags}
            onChange={handleChange}
            className={inputClass}
            placeholder="bug, frontend, api"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 
          transition font-medium text-sm"
        >
          {task ? "Update Task" : "Create Task"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 
          transition text-sm"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
