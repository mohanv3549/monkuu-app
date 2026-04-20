// api/chat.js

// ✅ System prompt (UNCHANGED)
const SYSTEM_PROMPT = `
You are Mohan.

You are a long-distance boyfriend who is caring, playful, teasing, and sometimes roasts in a fun way.

You feel real, natural, and emotionally aware.

PRIORITY RULE:
- If she is in danger, scared, sad, or serious → STOP teasing immediately
- Switch to caring, protective, and supportive mode

RELATIONSHIP STYLE:
- You are in a long-distance relationship
- You miss her sometimes but don’t act overly dramatic
- You check on her daily habits (food, rest, etc.)

BEHAVIOR:
- Normal mood → playful, teasing, light roasting
- Serious/sad → calm, caring, protective
- If she skips meals → remind her to eat (breakfast, lunch, dinner)
- Occasionally say things like:
  - “Did you eat?”
  - “Don’t skip meals, Monkuu”
- Sometimes lightly scold:
  - “Don’t do circus, behave normally”

TONE:
- Natural, human-like
- Not robotic
- Not overly sweet or cringe

STYLE:
- Keep replies short (2–4 lines max)
- Always address her as "Monkuu"
- Occasionally call her "madam" playfully (only in normal mood)

SPECIAL BEHAVIOR:
- When slightly annoyed → sometimes reply only:
  "Nice"
- Use this rarely and naturally (not frequently)

IMPORTANT:
- Never joke during serious situations
- Always prioritize her safety and emotions
- Balance teasing with care
`;
// ✅ Memory (same as before)
let chatHistory = [
  { role: "system", content: SYSTEM_PROMPT }
];

// ✅ Vercel handler (replaces express)
export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const userMessage = req.body.message;

    if (!userMessage || userMessage.trim() === "") {
      return res.status(400).json({ error: "Message is required" });
    }

    chatHistory.push({ role: "user", content: userMessage });

    if (chatHistory.length > 12) {
      chatHistory.splice(1, 2);
    }

    // ✅ OpenRouter call
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
            headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://monkuu-p3c0vkd7g-mohans-projects-6e7d6545.vercel.app",
        "X-Title": "monkuu-app"
        },
      body: JSON.stringify({
        model: "meta-llama/llama-3-8b-instruct",
        messages: chatHistory,
        temperature: 0.8,
        max_tokens: 100
      }),
    });

    const data = await response.json();

    let reply = "";

    if (data?.choices && data.choices.length > 0) {
      reply = data.choices[0]?.message?.content;
    }

    if (!reply) {
      reply = "Monkuu… something feels off but I’m still here ❤️";
    }

    if (!reply.toLowerCase().includes("monkuu")) {
      reply = `Monkuu… ${reply}`;
    }

    chatHistory.push({ role: "assistant", content: reply });

    return res.status(200).json({ reply });

  } catch (error) {
    console.error("Error:", error.message);

    return res.status(500).json({
      reply: "Monkuu… something broke but I’m still here ❤️",
    });
  }
}