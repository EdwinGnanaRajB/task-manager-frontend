import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [dark, setDark] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const token = localStorage.getItem("token");

  // 🌙 Load dark mode
  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved === "true") {
      setDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", dark);
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  // 📥 Fetch
  const fetchTasks = async () => {
    const res = await axios.get("http://localhost:5000/api/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // ➕ Add
  const addTask = async () => {
    if (!title) return toast.error("Enter task");

    await axios.post(
      "http://localhost:5000/api/tasks",
      { title },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    toast.success("Task added");
    setTitle("");
    fetchTasks();
  };

  // ❌ Delete
  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    toast.success("Deleted");
    fetchTasks();
  };

  // 🔄 Toggle
  const toggleStatus = async (task) => {
    await axios.put(
      `http://localhost:5000/api/tasks/${task._id}`,
      {
        status: task.status === "completed" ? "pending" : "completed",
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    toast.success("Updated");
    fetchTasks();
  };

  // ✏️ Update
  const updateTask = async () => {
    await axios.put(
      `http://localhost:5000/api/tasks/${editTask._id}`,
      { title: editTask.title },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    toast.success("Edited");
    setEditTask(null);
    fetchTasks();
  };

  // 🔍 Filter
  const filtered = tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "all" || t.status === filter)
  );

  return (
    <div className="relative min-h-screen overflow-hidden transition-all duration-500">

      {/* 🎥 VIDEO BACKGROUND */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute w-full h-full object-cover"
      >
        <source src="/bg.mp4" type="video/mp4" />
      </video>

      {/* 🌫 OVERLAY (dark mode visible here) */}
      <div className="absolute w-full h-full bg-black/50 dark:bg-black/80 backdrop-blur-sm"></div>

      {/* CONTENT */}
      <div className="relative z-10 p-4 md:p-8 text-white dark:text-gray-200">

        <Toaster />

        {/* HEADER */}
        <div className="flex justify-between mb-6 flex-wrap gap-3">
          <h1 className="text-2xl font-bold">Dashboard 🚀</h1>

          <div className="flex gap-2">
            <button
              onClick={() => setDark(!dark)}
              className="bg-white/20 dark:bg-gray-700 px-3 py-1 rounded transition"
            >
              {dark ? "☀️ Light" : "🌙 Dark"}
            </button>

            <button
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/";
              }}
              className="bg-red-500 px-4 py-1 rounded"
            >
              Logout
            </button>
          </div>
        </div>

        {/* ADD + SEARCH */}
        <div className="bg-white/10 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 p-5 rounded-xl mb-6">

          <div className="flex gap-3 mb-4">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Add task..."
              className="flex-1 p-3 rounded bg-white/20 text-white placeholder-gray-300 
                         dark:bg-gray-800 dark:text-white"
            />
            <button onClick={addTask} className="bg-indigo-500 px-5 rounded">
              Add
            </button>
          </div>

          <div className="flex gap-3">
            <input
              placeholder="Search..."
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 p-2 rounded bg-white/20 text-white placeholder-gray-300 
                         dark:bg-gray-800 dark:text-white"
            />

            <select
              onChange={(e) => setFilter(e.target.value)}
              className="p-2 rounded bg-white/20 text-white dark:bg-gray-800"
            >
              <option value="all">All</option>
              <option value="completed">Done</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        {/* TASKS */}
        <div className="space-y-3">
          {filtered.map((task) => (
            <motion.div
              key={task._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 p-4 rounded-xl flex justify-between"
            >
              <div>
                <h3>{task.title}</h3>
                <p className="text-sm text-gray-300">{task.status}</p>
              </div>

              <div className="flex gap-2">
                <button onClick={() => toggleStatus(task)}>🔄</button>
                <button onClick={() => setEditTask(task)}>✏️</button>
                <button onClick={() => deleteTask(task._id)}>❌</button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* MODAL */}
        {editTask && (
          <div className="fixed inset-0 bg-black/60 flex justify-center items-center">
            <div className="bg-white dark:bg-gray-800 p-5 rounded w-80 text-black dark:text-white">
              <input
                value={editTask.title}
                onChange={(e) =>
                  setEditTask({ ...editTask, title: e.target.value })
                }
                className="w-full p-2 mb-4 rounded bg-gray-100 dark:bg-gray-700"
              />

              <div className="flex justify-end gap-2">
                <button onClick={() => setEditTask(null)}>Cancel</button>
                <button
                  onClick={updateTask}
                  className="bg-indigo-500 text-white px-3 py-1 rounded"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Dashboard;