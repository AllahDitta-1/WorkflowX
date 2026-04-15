const colorMap = {
  // Status colors
  todo: "bg-gray-100 text-gray-700",
  "in-progress": "bg-blue-100 text-blue-700",
  review: "bg-yellow-100 text-yellow-700",
  completed: "bg-green-100 text-green-700",
  // Priority colors
  low: "bg-gray-100 text-gray-600",
  medium: "bg-blue-100 text-blue-600",
  high: "bg-orange-100 text-orange-600",
  urgent: "bg-red-100 text-red-600",
  // Role colors
  admin: "bg-purple-100 text-purple-700",
  manager: "bg-indigo-100 text-indigo-700",
  member: "bg-teal-100 text-teal-700",
};

const Badge = ({ text, type }) => (
  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${colorMap[type] || "bg-gray-100 text-gray-600"}`}>
    {text}
  </span>
);

export default Badge;