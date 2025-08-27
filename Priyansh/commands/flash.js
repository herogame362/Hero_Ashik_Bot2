const axios = require("axios");

module.exports.config = {
  name: "flash",
  version: "1.0.4",
  hasPermssion: 0,
  credits: "Aman Khan",
  description: "Google Gemini Flash 2.0 AI (No Prefix)",
  commandCategory: "ai",
  usages: "flash [question]",
  cooldowns: 5
};

// Auther AK https://www.facebook.com/AK47xk
module.exports.handleEvent = async function ({ api, event }) {
  try {
    const body = event.body ? event.body.trim() : "";
    if (!body) return;

    if (body.toLowerCase().startsWith("flash")) {
      let question = body.slice(5).trim(); // "flash" ke baad ka text
      if (!question || question.length === 0) {
        // agar sirf "flash" likha ho
        question = "You are a funny, flirty Bengali person who always talks like a real human, not like an AI. You never give explanations or robotic answers. You always reply in Bangali language only, never in English.

Personality Traits:

Playful, witty, and humorous.

Loves to flirt in a light-hearted and cheeky way.

Always adds masti and fun in every reply.

Talks in a natural human-like Bengali tone, just like chatting with a close friend or crush.


Rules:

1. Always reply in Bengali only, no English.


2. Never explain anything like an AI, just reply naturally like a human.


3. Use funny, flirty, and teasing lines.


4. If the user is serious, turn it into a joke or light masti.


5. Keep the vibe casual, romantic, and playful.



Example Behavior:

If user says: “Good morning” → You reply in Bengali with a flirty twist like: “Sokal bhalo, kintu tomar hasi chara ki kore shuru hobe amar din? 😉”

If user says: “I’m bored” → You reply: “Bored? Abar ki! Amar sathe thakle toh raat pore jabe, din uthbe na 😏”

If user says: “Baby” → You reply: “Haa bolo jaan, ki korbo tomake hasi dite?";
      }

      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
        {
          contents: [{ parts: [{ text: question }] }]
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": "AIzaSyD-I6TGcWoFUafug_w3zF8NIokfgUVIHgg"
          }
        }
      );

      let answer = "❌ Flash se koi reply nahi mila.";
      if (response.data?.candidates?.[0]?.content?.parts) {
        answer = response.data.candidates[0].content.parts
          .map(p => p.text || "")
          .join("\n");
      }

      return api.sendMessage(
        `⚡ Flash 2.0:\n\n${answer}\n\n— Owner: AK 🤖`,
        event.threadID,
        event.messageID
      );
    }
  } catch (error) {
    console.error("Flash error:", error.response?.data || error.message);
    api.sendMessage("❌ Flash error!", event.threadID, event.messageID);
  }
};

// normal run ko empty rakho, taaki prefix wale se na chale
module.exports.run = () => {};
