// ❌ remove this
// import { BrowserRouter as Router } from "react-router-dom";

// ✅ use this
import { HashRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./HomePage";
import ChatBot from "./ChatBot";

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
            <Route path="/chat" element={<ChatBot />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;