import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { FaUserCircle, FaEdit, FaSave } from "react-icons/fa";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ hobbies: "" });
  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch user profile
  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUser(data);
      setFormData({ hobbies: data.hobbies || "" });
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch pending tasks
  const fetchTasks = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      // Only pending tasks
      const pending = data.filter((task) => !task.completed);
      setTasks(pending);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchTasks();
  }, []);

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setUser(data);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-16 space-y-10">
        {/* Profile Card */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-10 bg-gray-800 rounded-2xl p-8 shadow-lg">
          {/* Avatar */}
          <div className="flex flex-col items-center">
            <FaUserCircle className="text-9xl text-gray-400 mb-4" />
            {!isEditing && <p className="text-gray-400 text-sm mt-2">Profile Picture</p>}
          </div>

          {/* User Info */}
          <div className="flex-1 space-y-4 w-full">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold">User Profile</h2>
              <button
                onClick={isEditing ? handleSave : handleEditToggle}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold transition"
              >
                {isEditing ? <><FaSave /> Save</> : <><FaEdit /> Edit</>}
              </button>
            </div>

            {/* User Details */}
            <div className="space-y-3">
              <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                <span className="w-32 font-semibold text-gray-400">Name:</span>
                <span className="text-lg">{user.name}</span>
              </div>

              <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                <span className="w-32 font-semibold text-gray-400">Email:</span>
                <span className="text-lg">{user.email}</span>
              </div>

              <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                <span className="w-32 font-semibold text-gray-400">Hobbies:</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="hobbies"
                    value={formData.hobbies}
                    onChange={handleChange}
                    className="flex-1 px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <span className="text-lg">{user.hobbies || "-"}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-2xl font-semibold mb-4">Pending Tasks</h3>
          {tasks.length === 0 ? (
            <p className="text-gray-400">No pending tasks</p>
          ) : (
            <ul className="list-disc list-inside space-y-2">
              {tasks.map((task) => (
                <li key={task._id} className="text-lg">{task.title}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
