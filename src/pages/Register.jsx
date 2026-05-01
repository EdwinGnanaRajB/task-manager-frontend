import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
      });

      alert("Registered successfully 🎉");
      window.location.href = "/";
    } catch (err) {
      alert(err.response?.data?.message || "Register failed");
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
          Create Account ✨
        </h2>

        <input
          type="text"
          placeholder="Name"
          className="w-full p-3 mb-4 rounded bg-white/30 text-black placeholder-gray-600 
                     dark:bg-gray-700 dark:text-white dark:placeholder-gray-300"
          onChange={(e) => setName(e.target.value)}
        />

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
          onClick={handleRegister}
          className="w-full bg-white text-indigo-600 py-3 rounded-lg font-semibold hover:scale-105 transition"
        >
          Register
        </button>

        <p className="text-center text-white mt-4 text-sm">
          Already have an account?{" "}
          <Link to="/" className="underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Register;