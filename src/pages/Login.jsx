import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import API from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
   try {
    const res = await axios.post(`${API}/api/auth/login`, {
      email,
      password,
    });

    localStorage.setItem("token", res.data.token);

    navigate("/dashboard");   // ✅ IMPORTANT
  } catch (err) {
    alert("Login failed");
  }
};

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

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

      {/* 🌫 DARK OVERLAY */}
      <div className="absolute w-full h-full bg-black/60 backdrop-blur-sm"></div>

      {/* 🧊 GLASS CARD */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 backdrop-blur-xl bg-white/10 p-8 rounded-2xl shadow-2xl w-80 border border-white/20"
      >
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Hello Buddy 👋
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded bg-white/20 text-white placeholder-gray-300"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-6 rounded bg-white/20 text-white placeholder-gray-300"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-white text-indigo-600 py-3 rounded-lg font-semibold"
        >
          Login
        </button>

        <p className="text-white text-center mt-4 text-sm">
          Don’t have an account?{" "}
          <Link to="/register" className="underline">
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Login;