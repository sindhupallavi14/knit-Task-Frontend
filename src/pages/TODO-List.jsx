import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { FaTrash } from "react-icons/fa";

export default function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch tasks from backend
  useEffect(() => {
    if (!token) return;
    fetch(`${API_URL}/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error(err));
  }, [token]);

  // Add Task
  const addTask = async () => {
    if (newTask.trim() === "") return;

    try {
      const res = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: newTask }),
      });

      const task = await res.json();
      if (!res.ok) throw new Error(task.message || "Failed to add task");

      setTasks([task, ...tasks]);
      setNewTask("");
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle Task Completion
  const toggleTask = async (id, completed) => {
    try {
      const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completed: !completed }),
      });

      const updated = await res.json();
      setTasks(tasks.map((task) => (task.id === updated._id ? updated : task)));
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Task
  const deleteTask = async (id) => {
    try {
      const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete task");
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Filtered & Searched Tasks
  const filteredTasks = tasks
    .filter((task) => {
      if (filter === "completed") return task.completed;
      if (filter === "incomplete") return !task.completed;
      return true;
    })
    .filter((task) => task.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Heading */}
        <h1 className="text-4xl font-bold mb-8 text-center">Your To-Do List</h1>

        {/* Add New Task */}
        <div className="flex gap-4 mb-6 flex-col sm:flex-row">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Enter task..."
            className="flex-1 px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => e.key === "Enter" && addTask()}
          />
          <button
            onClick={addTask}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition transform hover:scale-105"
          >
            Add
          </button>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-2 rounded ${
                filter === "all" ? "bg-blue-600" : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`px-3 py-2 rounded ${
                filter === "completed"
                  ? "bg-blue-600"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setFilter("incomplete")}
              className={`px-3 py-2 rounded ${
                filter === "incomplete"
                  ? "bg-blue-600"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              Incomplete
            </button>
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <p className="text-gray-400 text-center text-lg">No tasks found.</p>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task._id}
                className="flex justify-between items-center bg-gray-800 px-4 py-3 rounded-xl shadow-md hover:shadow-lg transition"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task._id, task.completed)}
                    className="w-5 h-5 rounded-full accent-blue-500"
                  />
                  <span
                    className={`${
                      task.completed ? "line-through text-gray-500" : "text-white"
                    } text-lg font-medium`}
                  >
                    {task.title}
                  </span>
                </div>
                <button
                  onClick={() => deleteTask(task._id)}
                  className="text-red-500 hover:text-red-600 transition text-lg"
                  title="Delete Task"
                >
                  <FaTrash />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
