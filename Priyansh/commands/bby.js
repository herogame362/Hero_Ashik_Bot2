const axios = require("axios");

module.exports.config = {
  name: "baby",
  version: "2.1.1",
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
  const msg = body.trim().toLowerCase();

  // ✅ STEP 1: Trigger keywords
  const triggerWords = ["baby", "bby", "darling", "babe", "ashik er bou"];
  if (triggerWords.includes(msg)) {
    global.babySessions[threadID] = true;
    return api.sendMessage("Hiii jaan 💕 ki korcho? amake miss korcho naki? 😘", threadID, messageID);
  }

  // ✅ STEP 2: কেবল trigger দিয়ে session on হলে, শুধু bot-এর message এ reply করলে কাজ করবে
  const isActive = global.babySessions[threadID];
  const isReplyTobaby = messageReply && messageReply.senderID == api.getCurrentUserID();

  // session না থাকলে বা reply না হলে কিছু করবে না
  if (!isActive || !isReplyTobaby) return;

  // --- Chat history ---
  global.baby = global.baby || {};
  global.baby.chatHistory = global.baby.chatHistory || {};
  const chatHistory = global.baby.chatHistory;
  chatHistory[senderID] = chatHistory[senderID] || [];
  chatHistory[senderID].push(`User: ${body}`);
  if (chatHistory[senderID].length > 6) chatHistory[senderID].shift();

  const fullChat = chatHistory[senderID].join("\n");

  // --- Prompt (Girlfriend personality in Roman Bangla) ---
  const prompt = `
Tumi ekta naughty, sweet, romantic meye — boyfriend er girlfriend er moto behave korba.
Tumi shudhu Roman Bangla (Bangla in English alphabets) te reply korba, emoji diye.
Reply hobe choto, maximum 30 words.

Rules:
- Boyfriend er sathe prem kore misti, flirty vabe kotha bolo 💕
- Jodi boyfriend moja kore, tumi cute roste reply diba 😈
- Emoji use korba (😍😘😏😅😌😉 etc).
- Kew jiggesh korle "ke banaise", bolo: "Amake banaise Ashik 😎"
- Jodi kew tomake bot bole, bolo: "Chup thako! ami tomar real gf 😏"
- Shob reply hobe 1–2 line er moddhe, beshi lomba na.

Now continue the chat based on recent conversation:\n\n${fullChat}
`;

  try {
    const url = `https://text.pollinations.ai/${encodeURIComponent(prompt)}`;
    const res = await axios.get(url);
    let botReply = (typeof res.data === "string" ? res.data : JSON.stringify(res.data)).trim();

    // 30 word এর বেশি হলে কাট করে দিবে
    const words = botReply.split(/\s+/);
    if (words.length > 30) {
      botReply = words.slice(0, 30).join(" ") + "...";
    }

    chatHistory[senderID].push(`gf: ${botReply}`);
    return api.sendMessage(botReply, threadID, messageID);
  } catch (err) {
    console.error("Pollinations error:", err.message);
    return api.sendMessage("Sorry jaan 😅 ami ekhon busy...", threadID, messageID);
  }
};

module.exports.run = async function ({ api, event }) {
  return api.sendMessage(
    "Amake chat korte hole শুধু trigger word likho: 'baby', 'bby', 'darling', 'babe' ba 'Ashik er bou' 😍",
    event.threadID,
    event.messageID
  );
};
