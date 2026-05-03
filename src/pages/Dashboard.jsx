import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import API from "../services/api";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [dark, setDark] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const token = localStorage.getItem("token");

  // 🌙 Dark mode
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

  // ✅ FIX 1 — CORRECT FETCH
  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API}/api/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // ✅ FIX 2 — USE SAME API (NO LOCALHOST)
  const addTask = async () => {
    if (!title) return toast.error("Enter task");

    await axios.post(
      `${API}/api/tasks`,
      { title },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    toast.success("Task added");
    setTitle("");
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`${API}/api/tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    toast.success("Deleted");
    fetchTasks();
  };

  const toggleStatus = async (task) => {
    await axios.put(
      `${API}/api/tasks/${task._id}`,
      {
        status: task.status === "completed" ? "pending" : "completed",
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    toast.success("Updated");
    fetchTasks();
  };

  const updateTask = async () => {
    await axios.put(
      `${API}/api/tasks/${editTask._id}`,
      { title: editTask.title },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    toast.success("Edited");
    setEditTask(null);
    fetchTasks();
  };

  const filtered = tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "all" || t.status === filter)
  );

  return (
    <div className="relative min-h-screen overflow-hidden text-white">

      {/* 🎥 VIDEO */}
      <video autoPlay loop muted className="absolute w-full h-full object-cover">
        <source src="/bg.mp4" type="video/mp4" />
      </video>

      <div className="absolute w-full h-full bg-black/50 dark:bg-black/80"></div>

      <div className="relative z-10 p-6">
        <Toaster />

        {/* HEADER */}
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">TASK BOARD</h1>

          <div className="flex gap-2">
            <button
              onClick={() => setDark(!dark)}
              className="bg-white/20 px-3 py-1 rounded"
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
        <div className="bg-white/10 p-5 rounded-xl mb-6">
          <div className="flex gap-3 mb-4">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Add task..."
              className="flex-1 p-3 rounded bg-white/20"
            />
            <button onClick={addTask} className="bg-indigo-500 px-5 rounded">
              Add
            </button>
          </div>

          <div className="flex gap-3">
            <input
              placeholder="Search..."
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 p-2 rounded bg-white/20"
            />

            <select
              onChange={(e) => setFilter(e.target.value)}
              className="p-2 rounded bg-white/20"
            >
              <option value="all">All</option>
              <option value="completed">Done</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        {/* TASK LIST */}
        <div className="space-y-3">
          {filtered.map((task) => (
            <motion.div
              key={task._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 p-4 rounded-xl flex justify-between"
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
      </div>
    </div>
  );
}

export default Dashboard;