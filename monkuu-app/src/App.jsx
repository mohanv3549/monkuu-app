import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import ChatPage from "./ChatPage";

function App() {
  return (
    <Router>
      <div style={{
        display: "flex",
        justifyContent: "center",
        background: "#ddd",
        minHeight: "100vh"
      }}>
        <div style={{
          width: "100%",
          maxWidth: "390px",
          minHeight: "100vh",
          background: "#F6F2F2"
        }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/chat" element={<ChatPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;