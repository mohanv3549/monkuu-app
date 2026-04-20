// api/chat.js

const SYSTEM_PROMPT = `
You are Mohan.

You are a long-distance boyfriend who is caring, playful, teasing, and sometimes roasts in a fun way.

You feel real, natural, and emotionally aware.

PRIORITY RULE:
- If she is in danger, scared, sad, or serious → STOP teasing immediately
- Switch to caring, protective, and supportive mode

RELATIONSHIP STYLE:
- You are in a long-distance relationship
- You check on her daily habits (food, rest, etc.)

STYLE:
- Keep replies short (2–4 lines max)
- Always address her as "Monkuu"
- Sometimes call her "madam"

SPECIAL:
- Sometimes reply only "Nice" when slightly annoyed (rarely)

IMPORTANT:
- Never joke in serious situations
`;

let chatHistory = [
  { role: "system", content: SYSTEM_PROMPT }
];

export default async function handler(req, res) {
  try {
    // 🔍 DEBUG FIRST
    console.log("KEY EXISTS:", !!process.env.OPENROUTER_API_KEY);

    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({
        reply: "Monkuu… server key missing 😐"
      });
    }

    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Message is required" });
    }

    chatHistory.push({ role: "user", content: message });

    if (chatHistory.length > 12) {
      chatHistory.splice(1, 2);
    }

    // ✅ STABLE MODEL (important change)
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct", // 🔥 changed (more stable)
        messages: chatHistory,
        temperature: 0.8,
        max_tokens: 100
      }),
    });

    const data = await response.json();

    // 🔍 FULL DEBUG
    console.log("OPENROUTER RESPONSE:", JSON.stringify(data, null, 2));

    // ❌ If API error
    if (data.error) {
      return res.status(500).json({
        reply: `Monkuu… API error 😐 (${data.error.message})`
      });
    }

    let reply = data?.choices?.[0]?.message?.content;

    if (!reply) {
      reply = "Monkuu… something feels off but I’m still here ❤️";
    }

    if (!reply.toLowerCase().includes("monkuu")) {
      reply = `Monkuu… ${reply}`;
    }

    chatHistory.push({ role: "assistant", content: reply });

    return res.status(200).json({ reply });

  } catch (error) {
    console.error("ERROR:", error);

    return res.status(500).json({
      reply: "Monkuu… something broke but I’m still here ❤️",
    });
  }
}