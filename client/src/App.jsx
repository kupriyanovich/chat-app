import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ChatPage from "./pages/ChatPage";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={() => setToken(localStorage.getItem("token"))} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/chat" element={token ? <ChatPage /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={token ? "/chat" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
