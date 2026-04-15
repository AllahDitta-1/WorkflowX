import { useState, useEffect } from "react";
import { HiOutlinePlus, HiOutlineViewGrid, HiOutlineViewList } from "react-icons/hi";
import toast from "react-hot-toast";
import KanbanBoard from "../components/tasks/KanbanBoard";
import TaskCard from "../components/tasks/TaskCard";
import TaskForm from "../components/tasks/TaskForm";
import Modal from "../components/ui/Modal";
import Badge from "../components/ui/Badge";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../services/api";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [view, setView] = useState("kanban"); // kanban | list
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({ priority: "", search: "" });

  // Load tasks
  useEffect(() => {
    loadTasks();
    const intervalId = setInterval(loadTasks, 20000);
    return () => clearInterval(intervalId);
  }, [filters]);

  const loadTasks = async () => {
    try {
      const { data } = await fetchTasks(filters);
      setTasks(data);
    } catch (error) {
      toast.error("Failed to load tasks");
    }
  };

  // Create or Update task
  const handleSubmit = async (formData) => {
    try {
      if (editingTask) {
        await updateTask(editingTask._id, formData);
        toast.success("Task updated!");
      } else {
        await createTask(formData);
        toast.success("Task created!");
      }
      setShowForm(false);
      setEditingTask(null);
      loadTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  // Delete task
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await deleteTask(id);
      toast.success("Task deleted!");
      loadTasks();
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  // Click task to edit
  const handleTaskClick = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Tasks</h2>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Search */}
          <input
            type="text"
            placeholder="Search tasks..."
            value={filters.search}
            onChange={(e) =>
              setFilters({ ...filters, search: e.target.value })
            }
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm 
            focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-48"
          />

          {/* Priority Filter */}
          <select
            value={filters.priority}
            onChange={(e) =>
              setFilters({ ...filters, priority: e.target.value })
            }
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none w-full sm:w-auto"
          >
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>

          {/* View Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1 self-start sm:self-auto">
            <button
              onClick={() => setView("kanban")}
              className={`p-2 rounded-md transition ${
                view === "kanban" ? "bg-white shadow-sm" : ""
              }`}
            >
              <HiOutlineViewGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-2 rounded-md transition ${
                view === "list" ? "bg-white shadow-sm" : ""
              }`}
            >
              <HiOutlineViewList className="w-4 h-4" />
            </button>
          </div>

          {/* Create Button */}
          <button
            onClick={() => {
              setEditingTask(null);
              setShowForm(true);
            }}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 
            rounded-lg hover:bg-blue-700 transition text-sm font-medium w-full sm:w-auto"
          >
            <HiOutlinePlus className="w-4 h-4" />
            New Task
          </button>
        </div>
      </div>

      {/* View */}
      {view === "kanban" ? (
        <KanbanBoard tasks={tasks} onTaskClick={handleTaskClick} />
      ) : (
        /* List View */
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
            <thead className="bg-gray-50 text-left text-sm text-gray-500">
              <tr>
                <th className="px-6 py-3 font-medium">Task</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Priority</th>
                <th className="px-6 py-3 font-medium">Assigned To</th>
                <th className="px-6 py-3 font-medium">Due Date</th>
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {tasks.map((task) => (
                <tr key={task._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-800">{task.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {task.project?.name}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <Badge text={task.status} type={task.status} />
                  </td>
                  <td className="px-6 py-4">
                    <Badge text={task.priority} type={task.priority} />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {task.assignedTo?.name || "Unassigned"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleTaskClick(task)}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(task._id)}
                        className="text-red-500 hover:underline text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>
          {tasks.length === 0 && (
            <p className="text-center text-gray-400 py-10">No tasks found</p>
          )}
        </div>
      )}

      {/* Task Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingTask(null);
        }}
        title={editingTask ? "Edit Task" : "Create New Task"}
      >
        <TaskForm
          task={editingTask}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingTask(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default Tasks;
