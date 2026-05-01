import { useState } from "react";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      // Save token
      localStorage.setItem("token", res.data.token);

      alert("Login Successful ✅");

      // Redirect
      window.location.href = "/dashboard";
    } catch (err) {
      alert("Login Failed ❌");
      console.log(err.response?.data);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Task Manager</h1>
      <h2>Login</h2>

      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />

      <button onClick={loginUser}>Login</button>
    </div>
  );
}

export default Login;