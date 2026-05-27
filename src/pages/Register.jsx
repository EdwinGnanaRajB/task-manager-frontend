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
      await axios.post("https://task-manager-backend.onrender.com/api/auth/register", {
        name,
        email,
        password,
      });

      alert("Registered successfully 🎉");
      window.location.href = "/";
    } catch {
      alert("Register failed");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* 🎥 VIDEO BACKGROUND */}
      <video autoPlay loop muted className="absolute w-full h-full object-cover">
        <source src="/bg.mp4" type="video/mp4" />
      </video>

      {/* 🌫 OVERLAY */}
      <div className="absolute w-full h-full bg-black/60 backdrop-blur-sm"></div>

      {/* 🧊 CARD */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 backdrop-blur-xl bg-white/10 p-8 rounded-2xl shadow-2xl w-80 border border-white/20"
      >
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Create Account ✨
        </h2>

        <input
          placeholder="Name"
          className="w-full p-3 mb-4 rounded bg-white/20 text-white"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Email"
          className="w-full p-3 mb-4 rounded bg-white/20 text-white"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-6 rounded bg-white/20 text-white"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleRegister}
          className="w-full bg-white text-indigo-600 py-3 rounded-lg font-semibold"
        >
          Register
        </button>

        <p className="text-white text-center mt-4 text-sm">
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