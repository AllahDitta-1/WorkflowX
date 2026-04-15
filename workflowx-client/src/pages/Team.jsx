import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import { fetchUsers, updateUserRole, deleteUser } from "../services/api";
import { useAuth } from "../context/AuthContext";

const Team = () => {
  const [users, setUsers] = useState([]);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const { data } = await fetchUsers();
      setUsers(data);
    } catch (error) {
      toast.error("Failed to load team");
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(userId, { role: newRole });
      toast.success("Role updated!");
      loadUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update role");
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Remove this team member?")) return;
    try {
      await deleteUser(userId);
      toast.success("Member removed!");
      loadUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Team Members</h2>
        <span className="text-sm text-gray-500">{users.length} members</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((member) => (
          <Card key={member._id} className="text-center">
            {/* Avatar */}
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-600 font-bold text-xl">
                {member.name?.charAt(0).toUpperCase()}
              </span>
            </div>

            <h3 className="font-semibold text-gray-800">{member.name}</h3>
            <p className="text-sm text-gray-400 mb-2">{member.email}</p>
            <Badge text={member.role} type={member.role} />

            {member.department && (
              <p className="text-xs text-gray-400 mt-2">{member.department}</p>
            )}

            {/* Admin actions */}
            {currentUser?.role === "admin" &&
              member._id !== currentUser._id && (
                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <select
                    value={member.role}
                    onChange={(e) =>
                      handleRoleChange(member._id, e.target.value)
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none"
                  >
                    <option value="member">Member</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button
                    onClick={() => handleDelete(member._id)}
                    className="px-3 py-2 text-xs text-red-500 hover:bg-red-50 rounded-lg transition"
                  >
                    Remove
                  </button>
                </div>
              )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Team;