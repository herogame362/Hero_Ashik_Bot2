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
        question = "tume sif Bangla me baat karna he aur ladki tarah baat karo koi haal chaal puche to uska to batana aur koi puche tume kis ne banaya he to tum bolna ashik ne banaya sab kuch bangla me bolna flirty baat karna romantic baat karna gussa se bhi baat karna jis massage pe emotion chahiye us emotion se baat karna ";
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
