import React, { useState } from "react";
import axios from "axios";

const LoginForm = () => {
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const response = await axios.post("http://localhost:5000/api/auth/login", {
      nickname,
      password,
    });
    localStorage.setItem("token", response.data.token);
    window.location.href = "/chat";
  };

  return (
    <div className="form-container">
      <input placeholder="Login" value={nickname} onChange={(e) => setNickname(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default LoginForm;
