import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../styles/LoginPage.css";

const LoginPage = () => {
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Ошибка входа");
        return;
      }

      // Сохраняем токен
      localStorage.setItem("token", data.token);

      // Декодируем токен и сохраняем nickname (если нужно)
      const decoded = jwtDecode(data.token);
      if (decoded?.nickname) {
        localStorage.setItem("nickname", decoded.nickname);
      }

      navigate("/chat");
    } catch (err) {
      setError("Сервер недоступен");
    }
  };

  return (
    <div className="login-container">
      <h1 className="title">Chat Name</h1>
      <div className="container">
        <form onSubmit={handleLogin}>
          <label htmlFor="login">Login</label>
          <input
            type="text"
            id="login"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
