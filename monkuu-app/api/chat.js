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
    // ✅ ENV check
    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(200).json({
        reply: "Monkuu… API key missing 😐"
      });
    }

    // ✅ Method check
    if (req.method !== "POST") {
      return res.status(200).json({
        reply: "Monkuu… wrong request 😐"
      });
    }

    // ✅ Safe body parsing
    const body = req.body || {};
    const message = body.message || "";

    if (!message.trim()) {
      return res.status(200).json({
        reply: "Monkuu… say something 😏"
      });
    }

    // ✅ Maintain memory safely
    chatHistory.push({ role: "user", content: message });
    if (chatHistory.length > 10) {
      chatHistory.splice(1, 2);
    }

    // ✅ Timeout protection
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openchat/openchat-3.5-0106",
        messages: chatHistory
      }),
      signal: controller.signal
    });

    clearTimeout(timeout);

    // ❗ Handle non-200 responses
    if (!response.ok) {
      const text = await response.text();
      console.error("OPENROUTER HTTP ERROR:", text);

      return res.status(200).json({
        reply: "Monkuu… AI not responding properly 😐"
      });
    }

    let data;

    try {
      data = await response.json();
    } catch (e) {
      console.error("JSON PARSE ERROR");
      return res.status(200).json({
        reply: "Monkuu… something went wrong with AI response 😐"
      });
    }

    console.log("OPENROUTER RESPONSE:", JSON.stringify(data, null, 2));

    if (data.error) {
      return res.status(200).json({
        reply: "Monkuu… AI acting weird today 😏"
      });
    }

    let reply = data?.choices?.[0]?.message?.content;

    if (!reply) {
      reply = "Monkuu… I’m here ❤️";
    }

    // ✅ Ensure personality
    if (!reply.toLowerCase().includes("monkuu")) {
      reply = `Monkuu… ${reply}`;
    }

    chatHistory.push({ role: "assistant", content: reply });

    return res.status(200).json({ reply });

  } catch (error) {
    console.error("SERVER ERROR:", error.message);

    return res.status(200).json({
      reply: "Monkuu… server got tired 😐 try again"
    });
  }
}