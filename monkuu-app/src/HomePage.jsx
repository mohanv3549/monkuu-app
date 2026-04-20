import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

function HomePage() {
  const [message, setMessage] = useState("");
  const [counts, setCounts] = useState({ you: 0, her: 0 });
  const navigate = useNavigate();

  const getDays = () => {
    const lastDate = new Date("2026-02-24");
    const today = new Date();
    const diff = today - lastDate;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  // 🔥 Firebase realtime
  useEffect(() => {
    const ref = doc(db, "miss", "monkuu");

    const unsub = onSnapshot(ref, async (snap) => {
      if (snap.exists()) {
        setCounts(snap.data());
      } else {
        await setDoc(ref, { you: 0, her: 0 });
      }
    });

    return () => unsub();
  }, []);

  const updateCount = async (type) => {
    const ref = doc(db, "miss", "monkuu");

    await updateDoc(ref, {
      [type]: counts[type] + 1
    });
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
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#F9F9F9" }}>

      {/* NAVBAR */}
      <div style={{
        margin: "12px",
        padding: "12px 16px",
        borderRadius: "20px",
        background: "#fff",
        border: "1px solid #E5E5E5",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <span style={{ fontWeight: "500" }}>Monkuu 💖</span>

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
            cursor: "pointer"
          }}
        >
          Chat
        </button>
      </div>

      {/* COUNTER CARD */}
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
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
        }}>
          <p style={{ fontSize: "14px", marginBottom: "10px" }}>
            Days away from you
          </p>

          <h1 style={{
            fontSize: "56px",
            color: "#E63946",
            margin: "0",
            fontWeight: "600"
          }}>
            {getDays()}
          </h1>
        </div>
      </div>

      {/* 🔥 MISS BUTTONS */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "10px",
        marginBottom: "15px"
      }}>
        <button
          onClick={() => updateCount("you")}
          style={{
            padding: "10px 16px",
            borderRadius: "20px",
            border: "none",
            background: "#000",
            color: "#fff",
            fontSize: "14px"
          }}
        >
          I miss you 💔 ({counts.you})
        </button>

        <button
          onClick={() => updateCount("her")}
          style={{
            padding: "10px 16px",
            borderRadius: "20px",
            border: "1px solid #000",
            background: "#fff",
            color: "#000",
            fontSize: "14px"
          }}
        >
          She misses you ❤️ ({counts.her})
        </button>
      </div>

      {/* MOOD */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "10px",
        marginBottom: "10px"
      }}>
        <button onClick={() => handleMood("happy")}>😄</button>
        <button onClick={() => handleMood("sad")}>😔</button>
        <button onClick={() => handleMood("angry")}>😒</button>
      </div>

      {message && (
        <p style={{
          textAlign: "center",
          marginBottom: "20px"
        }}>
          {message}
        </p>
      )}
    </div>
  );
}

export default HomePage;