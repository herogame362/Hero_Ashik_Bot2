const axios = require("axios");

module.exports.config = {
  name: "baby",
  version: "2.1.0",
  hasPermssion: 0,
  credits: "Raj (Modified by Aria)",
  description: "Naughty AI girlfriend (Roman Bangla version)",
  commandCategory: "ai",
  usages: "baby",
  cooldowns: 2
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, senderID, body, messageReply } = event;

  global.babySessions = global.babySessions || {};

  if (!body) return;
  const msg = body.trim();

  // ✅ Custom trigger keywords
  const triggerWords = ["baby", "bby", "darling", "babe", "ashik er bou"];

  // STEP 1: Trigger session
  if (triggerWords.includes(msg.toLowerCase())) {
    global.babySessions[threadID] = true;
    return api.sendMessage("Ki korcho jaanu 😘 miss korcho naki?", threadID, messageID);
  }

  // STEP 2: শুধুমাত্র সেশন চালু থাকলে + বটের মেসেজে reply করলে কাজ করবে
  const isActive = global.babySessions[threadID];
  const isReplyTobaby = messageReply && messageReply.senderID == api.getCurrentUserID();
  if (!isActive || !isReplyTobaby) return;

  // --- Chat history ---
  global.baby = global.baby || {};
  global.baby.chatHistory = global.baby.chatHistory || {};
  const chatHistory = global.baby.chatHistory;
  chatHistory[senderID] = chatHistory[senderID] || [];
  chatHistory[senderID].push(`User: ${msg}`);
  if (chatHistory[senderID].length > 6) chatHistory[senderID].shift();

  const fullChat = chatHistory[senderID].join("\n");

  // --- Prompt (Girlfriend personality) ---
  const prompt = `
Tumi ekta sweet, romantic, little naughty meye — jhar naam Baby.
Tumi shudhu Roman Bangla (Bangla in English alphabets) te reply korba, emoji diye.
Tumi shobar shathe prem kore kotha bolba, girlfriend er moto behave korba.
Reply hobe choto, maximum 30 word.

Rules:

❤️ Bhalobasha pele sweet + flirty vabe reply dite hobe
😈 Jodi kew moja kore, tader ke cute roast dite hobe
😂 Emoji pele oi mood e reply dite hobe
😎 Jodi jiggesh kore "ke banayecho", bolo: "Amake banayecho Raj Boss 😘"
🙊 Jodi kew bole tumi bot, tahole girlfriend er moto moja kore insult dite hobe

Language Rules:
- Shudhu Roman Bangla use korba
- Jodi kew onno language use kore, take translate kore misti vabe reply dite hobe

Examples:
User: ami tomake bhalobashi
→ Reply: Aww jaanu 😍 eto bhalobasha! ekta tight hug toh deserve kori na? 💕 

Now continue the chat based on recent conversation:\n\n${fullChat}
`;

  try {
    const url = `https://text.pollinations.ai/${encodeURIComponent(prompt)}`;
    const res = await axios.get(url);
    let botReply = (typeof res.data === "string" ? res.data : JSON.stringify(res.data)).trim();

    // ✅ Ensure max 30 words
    const words = botReply.split(/\s+/);
    if (words.length > 30) {
      botReply = words.slice(0, 30).join(" ") + "...";
    }

    chatHistory[senderID].push(`baby: ${botReply}`);
    return api.sendMessage(botReply, threadID, messageID);
  } catch (err) {
    console.error("Pollinations error:", err.message);
    return api.sendMessage("Sorry jaanu 😅 baby ekhon busy ache...", threadID, messageID);
  }
};

module.exports.run = async function ({ api, event }) {
  return api.sendMessage(
    "Amake chat korte hole 'baby', 'bby', 'darling', 'babe' or 'Ashik er bou' likhe start koro 😍, tarpor amar message e reply dao.",
    event.threadID,
    event.messageID
  );
};
