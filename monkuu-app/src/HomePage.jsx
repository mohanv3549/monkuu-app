import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

function HomePage() {
  const [message, setMessage] = useState("");
  const [counts, setCounts] = useState({
    you: 0,
    her: 0,
    lastClicked: "",
    lastTime: 0
  });

  const navigate = useNavigate();

  const getDays = () => {
    const lastDate = new Date("2026-02-24");
    const today = new Date();
    return Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
  };

  // 🔥 Firebase realtime
  useEffect(() => {
    const ref = doc(db, "miss", "monkuu");

    const unsub = onSnapshot(ref, async (snap) => {
      if (snap.exists()) {
        setCounts(snap.data());
      } else {
        await setDoc(ref, {
          you: 0,
          her: 0,
          lastClicked: "",
          lastTime: 0
        });
      }
    });

    return () => unsub();
  }, []);

  // 🔥 vibration
  const vibrate = () => {
    if (navigator.vibrate) navigator.vibrate(40);
  };

  // 🔥 update
  const updateCount = async (type) => {
    const ref = doc(db, "miss", "monkuu");

    await updateDoc(ref, {
      [type]: (counts[type] || 0) + 1,
      lastClicked: type,
      lastTime: Date.now()
    });
  };

  const handleMood = (mood) => {
    if (mood === "sad") setMessage("Monkuu… come here ❤️");
    else if (mood === "happy") setMessage("Monkuu… look at you smiling 😏");
    else setMessage("Monkuu… madam angry ah 😌");
  };

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      background: "#F9F9F9"
    }}>

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
            margin: 0
          }}>
            {getDays()}
          </h1>
        </div>
      </div>

      {/* 💥 BUTTONS */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "12px",
        marginBottom: "10px"
      }}>

        <button
          onClick={() => {
            updateCount("you");
            vibrate();
          }}
          style={{
            padding: "12px 18px",
            borderRadius: "20px",
            border: "none",
            background: "#E63946",
            color: "#fff",
            fontSize: "14px",
            transition: "0.15s"
          }}
          onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.9)"}
          onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          Monkuu ❤️ ({counts.you})
        </button>

        <button
          onClick={() => {
            updateCount("her");
            vibrate();
          }}
          style={{
            padding: "12px 18px",
            borderRadius: "20px",
            border: "none",
            background: "#1D3557",
            color: "#fff",
            fontSize: "14px",
            transition: "0.15s"
          }}
          onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.9)"}
          onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          Monkuu 💙 ({counts.her})
        </button>

      </div>

      {/* 📊 WHO MISSES MORE */}
      <p style={{ textAlign: "center", fontSize: "14px" }}>
        {counts.you > counts.her
          ? "Monkuu… you miss more 😏"
          : counts.her > counts.you
          ? "Monkuu… she misses more ❤️"
          : "Monkuu… equal ah 😌"}
      </p>

      {/* 🕒 LAST TIME */}
      <p style={{ textAlign: "center", fontSize: "12px", opacity: 0.6 }}>
        Last miss: {counts.lastTime
          ? new Date(counts.lastTime).toLocaleString()
          : "--"}
      </p>

      {/* MOOD */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "10px",
        marginTop: "10px"
      }}>
        <button onClick={() => handleMood("happy")}>😄</button>
        <button onClick={() => handleMood("sad")}>😔</button>
        <button onClick={() => handleMood("angry")}>😒</button>
      </div>

      {message && (
        <p style={{ textAlign: "center", marginTop: "10px" }}>
          {message}
        </p>
      )}
    </div>
  );
}

export default HomePage;