const axios = require("axios");

module.exports.config = {
  name: "Ariya",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "Aman Khan + Aria",
  description: "Flirty Bengali AI Chatbot",
  commandCategory: "ai",
  usages: "flash [question]",
  cooldowns: 5
};

const triggerWords = ["bby", "bot", "baby", "babe", "ariya"];

module.exports.handleEvent = async function ({ api, event }) {
  try {
    const body = event.body ? event.body.trim().toLowerCase() : "";
    if (!body) return;

    // Check if message contains trigger words
    const isTriggered = triggerWords.some(word => body.includes(word));
    if (!isTriggered) return; // যদি trigger word না থাকে, কিছু করবে না

    // শুধু ইউজারের রিপ্লাই হলে উত্তর দিবে
    if (!event.messageReply) return;

    // প্রশ্ন হিসেবে reply message নিবে
    const question = event.messageReply.body || "কি করছো jaan? 😏";

    // Gemini API বা AI লজিক ব্যবহার করে বানানো flirty Bengali reply
    // এখানে আমরা fun, playful, flirty reply generate করছি
    let reply = "";

    const funReplies = [
      "Haa bolo jaan, ki korbo tomake hasi dite? 😘",
      "Arrey tomake dekhe amar din shuru holo, kemon aso? 😉",
      "Tumi to abar kharap mone hochho, chinta korona, ami achi na? 😏",
      "Bored? Amar sathe thakle toh raat pore jabe, din uthbe na 😜",
      "Sokal bhalo, kintu tomar hasi chara ki kore shuru hobe amar din? 😘"
    ];

    // Randomly select a reply
    reply = funReplies[Math.floor(Math.random() * funReplies.length)];

    // Send message
    return api.sendMessage(reply, event.threadID, event.messageID);

  } catch (error) {
    console.error("Flash error:", error.message);
    api.sendMessage("❌ কিছু সমস্যা হয়েছে!", event.threadID, event.messageID);
  }
};

// normal run empty
module.exports.run = () => {};
