import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      window.location.href = "/dashboard";
    } catch {
      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center animated-bg px-4">

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-lg bg-white/20 dark:bg-gray-800/40 p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-sm border border-white/30"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-white">
          Welcome Back 👋
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded bg-white/30 text-black placeholder-gray-600 
                     dark:bg-gray-700 dark:text-white dark:placeholder-gray-300"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-6 rounded bg-white/30 text-black placeholder-gray-600 
                     dark:bg-gray-700 dark:text-white dark:placeholder-gray-300"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-white text-indigo-600 py-3 rounded-lg font-semibold"
        >
          Login
        </button>
      </motion.div>
    </div>
  );
}

export default Login;