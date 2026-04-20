import { useState, useRef, useEffect } from "react";
import axios from "axios";

function ChatBot() {
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  const sendMessage = async () => {
    if (!msg.trim() || loading) return;

    const userMessage = msg;
    setMsg("");

    setChat((prev) => [...prev, { type: "user", text: userMessage }]);
    setLoading(true);

    try {
      const res = await axios.post("/api/chat", {
        message: userMessage,
      });

      setChat((prev) => [
        ...prev,
        { type: "bot", text: res.data.reply },
      ]);
    } catch {
      setChat((prev) => [
        ...prev,
        { type: "bot", text: "Monkuu… something broke 😒" },
      ]);
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: darkMode ? "#000" : "#fff",
        color: darkMode ? "#fff" : "#000",
        fontFamily: "sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "12px 16px",
          borderBottom: darkMode ? "1px solid #262626" : "1px solid #ddd",
          fontWeight: "600",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "35px",
            height: "35px",
            borderRadius: "50%",
            background: "#ff4d6d",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: "10px",
            color: "white",
          }}
        >
          M
        </div>

        Monkuu 💖

        {/* Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{
            marginLeft: "auto",
            background: "transparent",
            border: "none",
            color: darkMode ? "#fff" : "#000",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          {darkMode ? "🌙" : "☀️"}
        </button>
      </div>

      {/* Chat Area */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "10px",
        }}
      >
        {chat.map((c, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent:
                c.type === "user" ? "flex-end" : "flex-start",
              marginBottom: "8px",
            }}
          >
            <div
              style={{
                background:
                  c.type === "user"
                    ? "linear-gradient(135deg, #ff4d6d, #ff758f)"
                    : darkMode
                    ? "#262626"
                    : "#e5e5e5",
                padding: "10px 14px",
                borderRadius: "18px",
                maxWidth: "70%",
                fontSize: "14px",
                lineHeight: "1.4",
                color: c.type === "user" ? "#fff" : darkMode ? "#fff" : "#000",
              }}
            >
              {c.text}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ color: "#888", fontSize: "13px" }}>
            Monkuu is typing...
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div
        style={{
          borderTop: darkMode ? "1px solid #262626" : "1px solid #ddd",
          padding: "10px",
          display: "flex",
          alignItems: "center",
          background: darkMode ? "#000" : "#fff",
        }}
      >
        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Message..."
          style={{
            flex: 1,
            background: darkMode ? "#121212" : "#f2f2f2",
            border: "1px solid #ccc",
            borderRadius: "20px",
            padding: "10px 15px",
            color: darkMode ? "white" : "black",
            outline: "none",
          }}
        />

        <button
          onClick={sendMessage}
          style={{
            marginLeft: "10px",
            padding: "8px 16px",
            borderRadius: "20px",
            border: "none",
            background: "linear-gradient(135deg, #ff4d6d, #ff758f)",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatBot;