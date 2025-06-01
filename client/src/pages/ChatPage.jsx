import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "../styles/ChatPage.css";

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [editId, setEditId] = useState(null);
  const [currentUser, setCurrentUser] = useState("");

  useEffect(() => {
    // Извлекаем nickname из токена при монтировании
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setCurrentUser(decoded.nickname); // ← используем nickname
      } catch (err) {
        console.error("Ошибка декодирования токена:", err);
      }
    }

    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/messages");
      setMessages(res.data);
    } catch (error) {
      console.error("Ошибка загрузки сообщений:", error);
    }
  };

  const handleSend = async () => {
    if (!text.trim() || !currentUser) return;

    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/messages/${editId}`, { text });
        setEditId(null);
      } else {
        await axios.post("http://localhost:5000/api/messages", {
          text,
          sender: currentUser, // ← отправляем nickname как sender
        });
      }
      setText("");
      fetchMessages();
    } catch (error) {
      console.error("Ошибка отправки сообщения:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/messages/${id}`);
      fetchMessages();
    } catch (error) {
      console.error("Ошибка удаления сообщения:", error);
    }
  };

  const handleEdit = (id, currentText) => {
    setText(currentText);
    setEditId(id);
  };

  return (
    <div className="chat-container">
      <h2 className="chat-title">Chat Name</h2>
      <div className="messages-list">
        {messages.map((msg, index) => {
  const msgDate = new Date(msg.timestamp).toLocaleDateString("ru-RU");
  const prevDate =
    index > 0
      ? new Date(messages[index - 1].timestamp).toLocaleDateString("ru-RU")
      : null;

  const showDateSeparator = msgDate !== prevDate;

  const isCurrentUser = msg.sender === currentUser;

  return (
    <React.Fragment key={msg._id}>
      {showDateSeparator && (
        <div className="date-separator">{msgDate}</div>
      )}

      <div className={`message-row ${isCurrentUser ? "right" : "left"}`}>
        <div className={`message-bubble ${isCurrentUser ? "you" : ""}`}>
          <div className="message-content">
            <span>
              <strong>{msg.sender}:</strong> {msg.text}
            </span>
            {isCurrentUser && (
              <div className="message-actions">
                <button onClick={() => handleEdit(msg._id, msg.text)}>✏️</button>
                <button onClick={() => handleDelete(msg._id)}>🗑️</button>
              </div>
            )}
          </div>
          <div className="timestamp">
            {new Date(msg.timestamp).toLocaleTimeString()}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
})}

      </div>
      <div className="input-area">
        <input
          type="text"
          value={text}
          placeholder="Введите сообщение..."
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={handleSend}>➤</button>
      </div>
    </div>
  );
};

export default ChatPage;
