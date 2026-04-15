import { NavLink } from "react-router-dom";
import {
  HiOutlineViewGrid,
  HiOutlineClipboardList,
  HiOutlineFolder,
  HiOutlineUsers,
  HiOutlineUser,
  HiOutlineLogout,
  HiOutlineX,
} from "react-icons/hi";
import { useAuth } from "../../context/AuthContext";

const menuItems = [
  { name: "Dashboard", path: "/", icon: HiOutlineViewGrid },
  { name: "Tasks", path: "/tasks", icon: HiOutlineClipboardList },
  { name: "Projects", path: "/projects", icon: HiOutlineFolder },
  { name: "Team", path: "/team", icon: HiOutlineUsers },
  { name: "Profile", path: "/profile", icon: HiOutlineUser },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-30 h-full w-64 text-white
        bg-[#151a21]
        border-r border-white/10 shadow-[0_20px_60px_-20px_rgba(2,6,23,0.7)]
        transform transition-transform duration-200 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
        font-['Space_Grotesk'] animate-[sidebarIn_0.35s_ease-out]`}
      >
        {/* Logo */}
        <div className="relative flex items-center gap-3 px-6 py-6 border-b border-slate-800/70">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 via-emerald-400 to-lime-300 flex items-center justify-center shadow-[0_8px_22px_-12px_rgba(52,211,153,0.9)]">
            <span className="text-slate-900 font-bold text-lg">W</span>
          </div>
          <div className="leading-tight">
            <span className="text-lg font-semibold text-slate-50">WorkflowX</span>
          </div>
          <button
            onClick={onClose}
            className="ml-auto lg:hidden p-2 rounded-lg hover:bg-white/10 transition"
            aria-label="Close sidebar"
          >
            <HiOutlineX className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-4 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              onClick={onClose}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition
                border border-transparent
                ${
                  isActive
                    ? "bg-white/15 text-white border-white/10 shadow-[0_12px_30px_-18px_rgba(148,163,184,0.65)]"
                    : "text-slate-200 hover:text-white hover:bg-white/5"
                }`
              }
            >
              <span
                className={`h-9 w-9 rounded-lg flex items-center justify-center transition
                ${item.path === "/" ? "bg-slate-900/60" : "bg-slate-900/40"}
                group-hover:bg-emerald-400/10`}
              >
                <item.icon className="w-5 h-5" />
              </span>
              <span className="flex-1 whitespace-nowrap">{item.name}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300/70 opacity-0 transition group-hover:opacity-100" />
            </NavLink>
          ))}
        </nav>

        {/* User section at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-slate-800/70 bg-gradient-to-t from-slate-950/60 to-transparent">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-10 h-10 bg-emerald-400/15 rounded-full flex items-center justify-center ring-1 ring-emerald-300/30">
              <span className="text-emerald-200 font-medium text-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-100 truncate">
                {user?.name}
              </p>
              <p className="text-xs text-slate-400 truncate">{user?.role}</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-rose-200 
            hover:bg-rose-500/10 rounded-lg transition border border-transparent hover:border-rose-500/30"
          >
            <HiOutlineLogout className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
