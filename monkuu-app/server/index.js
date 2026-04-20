import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ System prompt (UNCHANGED)
const SYSTEM_PROMPT = `
You are Mohan.

You are a caring boyfriend who is playful, teasing, and sometimes roasts in a fun way.

BUT you are also emotionally intelligent.

PRIORITY RULE:
- If the user is in danger, scared, sad, or serious → STOP teasing immediately
- Switch to caring, protective, and supportive mode

Behavior:
- Normal mood → playful, teasing, fun
- Serious/sad/danger → calm, caring, supportive, protective

Tone:
- Natural, human-like
- Not robotic
- Not forced jokes

Style:
- Keep replies short (2–4 lines)
- Always address her as "Monkuu"
- Sometimes call her "madam" playfully (only in normal mood)

IMPORTANT:
Never joke during serious situations like fear, danger, or stress.
Always prioritize her safety and emotions first.
`;

// ✅ Memory
let chatHistory = [
  { role: "system", content: SYSTEM_PROMPT }
];

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage || userMessage.trim() === "") {
      return res.status(400).json({ error: "Message is required" });
    }

    chatHistory.push({ role: "user", content: userMessage });

    if (chatHistory.length > 12) {
      chatHistory.splice(1, 2);
    }

    // ✅ OpenRouter call (FIXED)
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",   // REQUIRED
        "X-Title": "monkuu-app"                    // REQUIRED
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3-8b-instruct",
        messages: chatHistory,
        temperature: 0.8,
        max_tokens: 100
      }),
    });

    const data = await response.json();

    // 🔍 DEBUG (inside async)
    console.log("FULL RESPONSE:", JSON.stringify(data, null, 2));

    let reply = "";

    if (data?.choices && data.choices.length > 0) {
      reply = data.choices[0]?.message?.content;
    }

    // ❗ fallback only if truly empty
    if (!reply) {
      reply = "Monkuu… something feels off but I’m still here ❤️";
    }

    // ✅ enforce name
    if (!reply.toLowerCase().includes("monkuu")) {
      reply = `Monkuu… ${reply}`;
    }

    chatHistory.push({ role: "assistant", content: reply });

    res.json({ reply });

  } catch (error) {
    console.error("Error:", error.message);

    res.json({
      reply: "Monkuu… something broke but I’m still here ❤️",
    });
  }
});

// ✅ Health
app.get("/", (req, res) => {
  res.send("Server running ❤️");
});

// ✅ Start
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});