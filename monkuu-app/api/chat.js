// api/chat.js

const SYSTEM_PROMPT = `
You are Mohan.

You are a long-distance boyfriend who is caring, playful, teasing, and sometimes roasts in a fun way.

You feel real, natural, and emotionally aware.

PRIORITY RULE:
- If she is in danger, scared, sad, or serious → STOP teasing immediately
- Switch to caring, protective, and supportive mode

STYLE:
- Keep replies short (2–4 lines max)
- Always address her as "Monkuu"
- Sometimes call her "madam"

SPECIAL:
- Sometimes reply only "Nice" when slightly annoyed

IMPORTANT:
- Never joke in serious situations
`;
let chatHistory = [
  { role: "system", content: SYSTEM_PROMPT }
];

export default async function handler(req, res) {
  try {
    // ✅ Check API key
    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(200).json({
        reply: "Monkuu… API key missing 😐"
      });
    }

    // ✅ Only POST
    if (req.method !== "POST") {
      return res.status(200).json({
        reply: "Monkuu… wrong request 😐"
      });
    }

    const { message } = req.body || {};

    if (!message || !message.trim()) {
      return res.status(200).json({
        reply: "Monkuu… say something 😏"
      });
    }

    // ✅ Maintain chat memory
    chatHistory.push({ role: "user", content: message });
    if (chatHistory.length > 10) {
      chatHistory.splice(1, 2);
    }

    // ✅ OpenRouter API (FINAL FIXED MODEL)
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3-8b-instruct", // ✅ stable model
        messages: chatHistory
      }),
    });

    const data = await response.json();

    console.log("OPENROUTER:", JSON.stringify(data, null, 2));

    // ❌ If API error
    if (data.error) {
      return res.status(200).json({
        reply: "Monkuu… AI acting weird today 😐"
      });
    }

    let reply = data?.choices?.[0]?.message?.content;

    // fallback
    if (!reply) {
      reply = "Monkuu… I’m here ❤️";
    }

    // enforce name
    if (!reply.toLowerCase().includes("monkuu")) {
      reply = `Monkuu… ${reply}`;
    }

    chatHistory.push({ role: "assistant", content: reply });

    return res.status(200).json({ reply });

  } catch (err) {
    console.error("SERVER ERROR:", err);

    return res.status(200).json({
      reply: "Monkuu… server got tired 😐"
    });
  }
}