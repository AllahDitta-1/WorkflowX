import { useEffect, useRef, useState } from "react";
import { HiOutlineMenuAlt2, HiOutlineBell } from "react-icons/hi";
import { useAuth } from "../../context/AuthContext";
import { fetchNotifications, markNotificationsRead } from "../../services/api";
import toast from "react-hot-toast";

const Navbar = ({ onMenuClick }) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const lastUnreadRef = useRef(0);

  useEffect(() => {
    let isMounted = true;
    const loadNotifications = async () => {
      try {
        const { data } = await fetchNotifications();
        if (isMounted) {
          setNotifications(data);
          const unreadNow = data.filter((n) => !n.read).length;
          if (unreadNow > lastUnreadRef.current) {
            toast("New notification", { icon: "🔔" });
          }
          lastUnreadRef.current = unreadNow;
        }
      } catch {
        // ignore notification errors
      }
    };
    loadNotifications();
    const intervalId = setInterval(loadNotifications, 20000);
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleBellClick = async () => {
    const nextOpen = !open;
    setOpen(nextOpen);

    if (nextOpen) {
      try {
        const { data } = await fetchNotifications();
        setNotifications(data);
      } catch {
        // ignore
      }
    }

    if (nextOpen && unreadCount > 0) {
      try {
        await markNotificationsRead();
        setNotifications((prev) =>
          prev.map((n) => ({ ...n, read: true }))
        );
      } catch {
        // ignore
      }
    }
  };

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left: Hamburger + Page Title */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <HiOutlineMenuAlt2 className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold text-gray-800">
            Welcome back, {user?.name?.split(" ")[0]} 👋
          </h1>
        </div>

        {/* Right: Notifications + Avatar */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={handleBellClick}
              className="relative p-2 hover:bg-gray-100 rounded-lg"
            >
            <HiOutlineBell className="w-5 h-5 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                <div className="px-4 py-3 border-b text-sm font-semibold text-gray-700">
                  Notifications
                </div>
                <div className="max-h-80 overflow-auto">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-6 text-sm text-gray-400 text-center">
                      No notifications
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n._id}
                        className="px-4 py-3 text-sm border-b last:border-b-0 hover:bg-gray-50"
                      >
                        <p className="text-gray-700">{n.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(n.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-medium text-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
