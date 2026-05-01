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

  // 🌙 Dark mode persistence
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

  const fetchTasks = async () => {
    const res = await axios.get("http://localhost:5000/api/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

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

  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    toast.success("Deleted");
    fetchTasks();
  };

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

  const filtered = tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "all" || t.status === filter)
  );

  return (
    <div className="min-h-screen animated-bg p-4 md:p-8 text-white dark:bg-gray-900">

      <Toaster />

      {/* Header */}
      <div className="flex justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold">Dashboard 🚀</h1>

        <div className="flex gap-2">
          <button
            onClick={() => setDark(!dark)}
            className="bg-white/30 dark:bg-gray-700 px-3 py-1 rounded transition"
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

      {/* Add + Search */}
      <div className="backdrop-blur-lg bg-white/20 dark:bg-gray-800/40 p-5 rounded-xl mb-6">

        <div className="flex gap-3 mb-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add task..."
            className="flex-1 p-3 rounded bg-white/30 text-black placeholder-gray-600 
                       dark:bg-gray-700 dark:text-white dark:placeholder-gray-300"
          />
          <button onClick={addTask} className="bg-indigo-500 px-5 rounded">
            Add
          </button>
        </div>

        <div className="flex gap-3">
          <input
            placeholder="Search..."
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 p-2 rounded bg-white/30 text-black placeholder-gray-600 
                       dark:bg-gray-700 dark:text-white dark:placeholder-gray-300"
          />

          <select
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 rounded bg-white/30 text-black dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All</option>
            <option value="completed">Done</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Tasks */}
      <div className="space-y-3">
        {filtered.map((task) => (
          <motion.div
            key={task._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/20 dark:bg-gray-800/40 p-4 rounded-xl flex justify-between"
          >
            <div>
              <h3>{task.title}</h3>
              <p>{task.status}</p>
            </div>

            <div className="flex gap-2">
              <button onClick={() => toggleStatus(task)}>🔄</button>
              <button onClick={() => setEditTask(task)}>✏️</button>
              <button onClick={() => deleteTask(task._id)}>❌</button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      {editTask && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white p-5 rounded w-80 text-black">
            <input
              value={editTask.title}
              onChange={(e) =>
                setEditTask({ ...editTask, title: e.target.value })
              }
              className="w-full p-2 mb-4"
            />

            <div className="flex justify-end gap-2">
              <button onClick={() => setEditTask(null)}>Cancel</button>
              <button onClick={updateTask} className="bg-indigo-500 text-white px-3 py-1 rounded">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;