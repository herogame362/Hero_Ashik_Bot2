const axios = require("axios");

module.exports.config = {
  name: "flash",
  version: "1.2.1",
  hasPermssion: 0,
  credits: "Aman Khan + Aria",
  description: "Flirty Bengali AI Chatbot (Gemini AI)",
  commandCategory: "ai",
  usages: "flash [question]",
  cooldowns: 5
};

const triggerWords = ["bby", "bot", "baby", "babe", "ariya"];

module.exports.handleEvent = async function ({ api, event }) {
  try {
    const body = event.body ? event.body.trim().toLowerCase() : "";
    if (!body) return;

    // Trigger word check
    const isTriggered = triggerWords.some(word => body.includes(word));
    if (!isTriggered) return;

    // Only reply if it's a user reply
    if (!event.messageReply) return;

    const question = event.messageReply.body || "কি করছো jaan? 😏";

    // Google Gemini AI call
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        contents: [
          {
            parts: [
              { text: `Funny, flirty, playful Bengali reply to: "${question}"` }
            ]
          }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": "AIzaSyAnitXo4VrfRxmG2SjRomS8bPQzsq4pvrg" // Hardcoded API Key
        }
      }
    );

    let aiReply = "😅 আমার মজা করে কিছু বলার মতো energy পাইনি!";
    if (response.data?.candidates?.[0]?.content?.parts) {
      aiReply = response.data.candidates[0].content.parts
        .map(p => p.text || "")
        .join("\n");
    }

    // Send the AI reply
    return api.sendMessage(aiReply, event.threadID, event.messageID);

  } catch (error) {
    console.error("Flash AI error:", error.response?.data || error.message);
    api.sendMessage("❌ কিছু সমস্যা হয়েছে AI চালানোর সময়!", event.threadID, event.messageID);
  }
};

// Normal run empty
module.exports.run = () => {};
