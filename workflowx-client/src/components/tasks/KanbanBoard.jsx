import TaskCard from "./TaskCard";

const columns = [
  { id: "todo", title: "📋 To Do", color: "border-gray-300" },
  { id: "in-progress", title: "🔄 In Progress", color: "border-blue-400" },
  { id: "review", title: "👀 Review", color: "border-yellow-400" },
  { id: "completed", title: "✅ Completed", color: "border-green-400" },
];

const KanbanBoard = ({ tasks, onTaskClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
      {columns.map((col) => {
        const columnTasks = tasks.filter((t) => t.status === col.id);

        return (
          <div key={col.id} className="space-y-2 md:space-y-3">
            {/* Column Header */}
            <div
              className={`flex items-center justify-between px-4 py-3 bg-white 
              rounded-lg border-t-4 ${col.color}`}
            >
              <h3 className="font-semibold text-gray-700 text-sm">
                {col.title}
              </h3>
              <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-500">
                {columnTasks.length}
              </span>
            </div>

            {/* Tasks */}
            <div className="space-y-3 min-h-[200px]">
              {columnTasks.map((task) => (
                <TaskCard key={task._id} task={task} onClick={onTaskClick} />
              ))}

              {columnTasks.length === 0 && (
                <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed rounded-lg">
                  No tasks
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KanbanBoard;
