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
export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(200).json({ reply: "Monkuu… wrong request 😐" });
    }

    const { message } = req.body || {};

    if (!message) {
      return res.status(200).json({ reply: "Monkuu… say something 😏" });
    }

    const prompt = `${SYSTEM_PROMPT}\nUser: ${message}\nMohan:`;

    const response = await fetch(
      "https://api-inference.huggingface.co/models/google/flan-t5-large",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: prompt
        })
      }
    );

    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return res.status(200).json({
        reply: "Monkuu… server waking up ⏳"
      });
    }

    let reply = data?.[0]?.generated_text;

    if (!reply) {
      reply = "Monkuu… I’m here ❤️";
    }

    if (!reply.toLowerCase().includes("monkuu")) {
      reply = `Monkuu… ${reply}`;
    }

    return res.status(200).json({ reply });

  } catch (err) {
    console.error(err);
    return res.status(200).json({
      reply: "Monkuu… something broke 😐"
    });
  }
}