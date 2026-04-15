import { useState, useEffect } from "react";
import {
  HiOutlineClipboardList,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineExclamation,
} from "react-icons/hi";
import StatsCard from "../components/dashboard/StatsCard";
import TaskCard from "../components/tasks/TaskCard";
import Card from "../components/ui/Card";
import { fetchTaskStats, fetchTasks, fetchProjects } from "../services/api";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [statsRes, tasksRes, projectsRes] = await Promise.all([
          fetchTaskStats(),
          fetchTasks(),
          fetchProjects(),
        ]);
        setStats(statsRes.data);
        setRecentTasks(tasksRes.data.slice(0, 5)); // Latest 5 tasks
        setProjects(projectsRes.data.slice(0, 4)); // Top 4 projects
      } catch (error) {
        console.error("Dashboard load error:", error);
      }
    };
    loadDashboard();
    const intervalId = setInterval(loadDashboard, 20000);
    return () => clearInterval(intervalId);
  }, []);

  // Extract status count from stats
  const getStatusCount = (status) => {
    if (!stats) return 0;
    const found = stats.byStatus?.find((s) => s._id === status);
    return found ? found.count : 0;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Tasks"
          value={stats?.totalTasks || 0}
          icon={HiOutlineClipboardList}
          color="blue"
        />
        <StatsCard
          title="Completed"
          value={getStatusCount("completed")}
          icon={HiOutlineCheckCircle}
          color="green"
        />
        <StatsCard
          title="In Progress"
          value={getStatusCount("in-progress")}
          icon={HiOutlineClock}
          color="orange"
        />
        <StatsCard
          title="Overdue"
          value={stats?.overdueTasks || 0}
          icon={HiOutlineExclamation}
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tasks */}
        <div className="lg:col-span-2">
          <Card>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Recent Tasks
            </h3>
            <div className="space-y-3">
              {recentTasks.map((task) => (
                <TaskCard key={task._id} task={task} showStatus onClick={() => {}} />
              ))}
              {recentTasks.length === 0 && (
                <p className="text-gray-400 text-center py-8">
                  No tasks yet. Create your first task!
                </p>
              )}
            </div>
          </Card>
        </div>

        {/* Project Progress */}
        <div>
          <Card>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Project Progress
            </h3>
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project._id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      {project.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {project.progress || 0}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full">
                    <div
                      className="h-2 bg-blue-500 rounded-full transition-all"
                      style={{ width: `${project.progress || 0}%` }}
                    ></div>
                  </div>
                </div>
              ))}
              {projects.length === 0 && (
                <p className="text-gray-400 text-center py-4">No projects</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
