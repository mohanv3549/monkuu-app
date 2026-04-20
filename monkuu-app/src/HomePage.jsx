import { useState } from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const getDays = () => {
    const lastDate = new Date("2026-02-24");
    const today = new Date();
    const diff = today - lastDate;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  const handleMood = (mood) => {
    if (mood === "sad") {
      setMessage("Monkuu… come here ❤️");
    } else if (mood === "happy") {
      setMessage("Monkuu… look at you smiling 😏");
    } else {
      setMessage("Monkuu… madam angry ah 😌");
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>

      {/* NAVBAR */}
      <div style={{
        margin: "12px",
        padding: "12px 16px",
        borderRadius: "20px",
        background: "#fff",
        border: "1px solid #E5E5E5",
        display: "flex",
        justifyContent: "space-between"
      }}>
        <span>Monkuu 💖</span>

       <button
  onClick={() => navigate("/chat")}
  style={{
    padding: "6px 14px",
    borderRadius: "20px",
    border: "1px solid #E63946",
    background: "#E63946",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "0.2s"
  }}
  onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
  onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
>
  Chat
</button>
      </div>

     {/* COUNTER */}
<div style={{
  flex: 1,
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
}}>
  <div style={{
    width: "240px",
    height: "240px",
    background: "#fff",
    borderRadius: "24px",
    border: "1px solid #E5E5E5",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
    animation: "fadeIn 0.5s ease"
  }}>

    <p style={{
      fontSize: "14px",
      color: "#000000",
      marginBottom: "10px"
    }}>
      Days away from you
    </p>

    <h1 style={{
      fontSize: "56px",
      color: "#E63946",
      margin: "0",
      fontWeight: "600",
      animation: "pop 0.4s ease"
    }}>
      {getDays()}
    </h1>

  </div>
</div>

      {/* MOOD */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "10px",
        marginBottom: "20px"
      }}>
        <button onClick={() => handleMood("happy")}>😄</button>
        <button onClick={() => handleMood("sad")}>😔</button>
        <button onClick={() => handleMood("angry")}>😒</button>
      </div>

      {message && <p style={{ textAlign: "center" }}>{message}</p>}
    </div>
  );
}

export default HomePage;