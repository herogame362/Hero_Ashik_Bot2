const axios = require("axios");

module.exports.config = {
  name: "bot",
  version: "3.1.0",
  hasPermssion: 0,
  credits: "Aman (Secured by GPT)",
  description: "Bot AI (Pollinations API) with moods + emoji detection",
  commandCategory: "no prefix",
  usages: "no prefix",
  cooldowns: 2,
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, body, senderID, messageReply } = event;
  if (!body || senderID == api.getCurrentUserID()) return;

  const lowerBody = body.toLowerCase();
  const isEmojiOnly = /^[\p{Emoji}\s]+$/u.test(body.trim());

  try {
    api.setMessageReaction("🤖", messageID, () => {}, true);

    const userInfo = await api.getUserInfo(senderID);
    const userName = userInfo[senderID]?.name || "User";

    // Random mood select
    const moods = ["romantic", "funny", "attitude", "naughty", "angery", "Flirting", "Funny", "Haha"];
    const mood = moods[Math.floor(Math.random() * moods.length)];

    let prompt;

    if (isEmojiOnly) {
      prompt = `User sudhu emoji pathaise: "${body}". 
Oi emojis er upor base kore ekta meyer moto "${mood}" mood e natural reply dao. 
AI er moto na, ekdom Real Girl er moto hobe. Lamba lamba text na, short ar valo reply hobe. Human girl er moto lagbe, emojis must use koro.`;
    } else if (lowerBody.includes("bot")) {
      prompt = `Tumi ekta meye jahar naam "Bot" ar tumi ekhon "${mood}" mood e acho. 
User er msg: "${body}". 
Ekta Real Girl er moto jawab dao. Jokhon keu sudhu "Bot" bole tokhon Flirting line, shayri, joke ba roasting line diye reply dao, kisu bole na direct. Emojis must use koro.`;
    } else {
      return; // ignore if no trigger
    }

    const encoded = encodeURIComponent(prompt);

    // ✅ Pollinations API call
    const res = await axios.get(`https://text.pollinations.ai/${encoded}`, {
      headers: {
        "User-Agent": "BotAI/3.1",
        "Accept": "application/json, text/plain, */*",
      },
      timeout: 10000,
      validateStatus: (status) => status >= 200 && status < 300,
    });

    let reply = typeof res.data === "string" ? res.data.trim() : "Bot bujhte parlo na 😅";

    if (!reply) {
      reply = "Bot vabche... tumi khub interesting 💖";
    }

    // 🔥 Unique Code System - Jokhon keu bot er msg ke reply kore
    let uniqueCode = "";
    if (messageReply && messageReply.senderID == api.getCurrentUserID()) {
      // Generate unique code based on user ID and timestamp
      const timestamp = Date.now();
      const codeBase = senderID.toString() + timestamp.toString();
      uniqueCode = `🆔 #${codeBase.substr(0, 6).toUpperCase()}`;
    }

    // 🔥 Final message with unique code if applicable
    const finalMsg = `👤 ${userName}${uniqueCode ? ` ${uniqueCode}` : ''}\n\n${reply}\n\n*★᭄𝐎𝐰𝐧𝐞𝐫 𝐀 𝐊 ⚔️⏤͟͟͞͞★*`;

    return api.sendMessage(finalMsg, threadID, messageID);
  } catch (error) {
    console.error("Pollinations error:", error);

    const backupReplies = [
      "Server oktu tired, kintu ami ekhono tomake miss kortesi 😘",
      "Reply elo na, kintu amar mon tomake mone kortese 💕",
      "Kokhono kokhono silence o onek romantic hoy 😏",
      "Cholo ami tomake ekta smile dei 🙂✨",
    ];
    const random = backupReplies[Math.floor(Math.random() * backupReplies.length)];
    
    // Unique code for error messages too if it was a reply to bot
    let uniqueCode = "";
    if (event.messageReply && event.messageReply.senderID == api.getCurrentUserID()) {
      const timestamp = Date.now();
      const codeBase = senderID.toString() + timestamp.toString();
      uniqueCode = `🆔 #${codeBase.substr(0, 6).toUpperCase()}`;
    }
    
    return api.sendMessage(`${random}${uniqueCode ? ` ${uniqueCode}` : ''}\n\n*★᭄𝐎𝐰𝐧𝐞𝐫 𝐀 𝐊 ⚔️⏤͟͟͞͞★*`, threadID, messageID);
  }
};

module.exports.run = async function ({ api, event, args }) {
  // Jodi keu direct command use kore tokhon help msg show hobe
  if (args.length === 0) {
    return api.sendMessage(`🤖 Bot Commands:\n\n• Sudhu "bot" likho msg e\n• Sudhu emojis pathao\n• Amar msg ke reply koro\n\n*★᭄𝐎𝐰𝐧𝐞𝐫 𝐀 𝐊 ⚔️⏤͟͟͞͞★*`, event.threadID, event.messageID);
  }
  return;
};
