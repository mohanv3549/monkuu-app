import ChatBot from "./ChatBot";

function ChatPage() {
  return (
    <div style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column"
    }}>

      {/* HEADER */}
      <div style={{
        margin: "12px",
        padding: "12px",
        borderRadius: "20px",
        background: "#fff",
        border: "1px solid #E5E5E5",
        textAlign: "center"
      }}>
        Monkuu 💖
      </div>

      {/* CHAT */}
      <div style={{ flex: 1 }}>
        <ChatBot />
      </div>

    </div>
  );
}

export default ChatPage;