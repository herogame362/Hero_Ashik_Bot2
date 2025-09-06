const axios = require("axios");

module.exports.config = {
  name: "baby",
  version: "2.1.5",
  hasPermssion: 0,
  credits: "Raj (Modified by Aria)",
  description: "Naughty AI girlfriend (Roman Bangla version)",
  commandCategory: "ai",
  usages: "baby",
  cooldowns: 2
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, senderID, body, messageReply } = event;
  if (!body) return;

  global.babySessions = global.babySessions || {};
  global.baby = global.baby || {};
  global.baby.chatHistory = global.baby.chatHistory || {};

  const msg = body.trim().toLowerCase();
  const triggerWords = ["baby", "bby", "darling", "babe", "ashik er bou"];

  // ✅ STEP 1: শুধু trigger message দিলে session শুরু হবে
  if (triggerWords.includes(msg)) {
    global.babySessions[threadID] = { active: true, lastBotMessageID: null };
    const replyMsg = "Hiii jaan 💕 ki korcho? amake miss korcho naki? 😘";
    const sent = await api.sendMessage(replyMsg, threadID, messageID);
    // Save bot message ID
    global.babySessions[threadID].lastBotMessageID = sent.messageID;
    return;
  }

  // ✅ STEP 2: শুধু session active থাকলে এবং bot-এর message reply হলে উত্তর দেবে
  const session = global.babySessions[threadID];
  if (!session || !session.active) return;

  // Check: message reply to bot
  if (!messageReply || messageReply.senderID !== api.getCurrentUserID()) return;

  // Check: reply must be to last bot message
  if (messageReply.messageID !== session.lastBotMessageID) return;

  // --- Chat history ---
  const chatHistory = global.baby.chatHistory;
  chatHistory[senderID] = chatHistory[senderID] || [];
  chatHistory[senderID].push(`User: ${body}`);
  if (chatHistory[senderID].length > 6) chatHistory[senderID].shift();
  const fullChat = chatHistory[senderID].join("\n");

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
- Shob reply hobe 1–2 line er moddhe, beshi lamba na.

Now continue the chat based on recent conversation:\n\n${fullChat}
`;

  try {
    const url = `https://text.pollinations.ai/${encodeURIComponent(prompt)}`;
    const res = await axios.get(url);
    let botReply = (typeof res.data === "string" ? res.data : JSON.stringify(res.data)).trim();

    const words = botReply.split(/\s+/);
    if (words.length > 30) {
      botReply = words.slice(0, 30).join(" ") + "...";
    }

    chatHistory[senderID].push(`gf: ${botReply}`);
    const sent = await api.sendMessage(botReply, threadID, messageID);
    // update last bot message ID
    global.babySessions[threadID].lastBotMessageID = sent.messageID;
  } catch (err) {
    console.error("Pollinations error:", err.message);
    await api.sendMessage("Sorry jaann 😅 ami ekhon busy...", threadID, messageID);
  }
};

module.exports.run = async function ({ api, event }) {
  return api.sendMessage(
    "Amake chat korte hole শুধু trigger word likho: 'baby', 'bby', 'darling', 'babe' ba 'Ashik er bou' 😍. Tarpor amar message e reply dile ami answer dibo 💕",
    event.threadID,
    event.messageID
  );
};
