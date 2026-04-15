import { HiOutlineCalendar, HiOutlineUser } from "react-icons/hi";
import Badge from "../ui/Badge";

const TaskCard = ({ task, onClick, showStatus = false }) => {
  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "completed";

  return (
    <div
      onClick={() => onClick(task)}
      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md 
      transition cursor-pointer group"
    >
      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {showStatus && <Badge text={task.status} type={task.status} />}
        <Badge text={task.priority} type={task.priority} />
        {isOverdue && <Badge text="Overdue" type="urgent" />}
      </div>

      {/* Title */}
      <h3 className="font-medium text-gray-800 mb-2 group-hover:text-blue-600 transition">
        {task.title}
      </h3>

      {/* Description preview */}
      {task.description && (
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-400">
        {task.createdBy?.name && (
          <div className="flex items-center gap-1">
            <span>Assigned by</span>
            <span className="text-gray-600 font-medium">
              {task.createdBy.name}
            </span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <HiOutlineCalendar className="w-3.5 h-3.5" />
          {task.dueDate
            ? new Date(task.dueDate).toLocaleDateString()
            : "No date"}
        </div>

        {task.assignedTo && (
          <div className="flex items-center gap-1">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-[10px] font-medium">
                {task.assignedTo.name?.charAt(0)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
