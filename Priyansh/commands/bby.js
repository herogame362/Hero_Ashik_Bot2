const axios = require("axios");

module.exports.config = {
  name: "baby",
  version: "2.2.2",
  hasPermssion: 0,
  credits: "Raj (Modified by Aria)",
  description: "Naughty AI girlfriend (Roman Bangla version) with Herox teach feature",
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

  const msg = body.trim();
  const lowerMsg = msg.toLowerCase();
  const triggerWords = ["baby", "bby", "darling", "babe", "ashik er bou"];

  // ✅ STEP 1: শুধু trigger message দিলে session শুরু হবে
  if (triggerWords.includes(lowerMsg)) {
    global.babySessions[threadID] = { active: true, lastBotMessageID: null };
    const replyMsg = "Hiii jaan 💕 ki korcho? amake miss korcho naki? 😘";
    const sent = await api.sendMessage(replyMsg, threadID, messageID);
    global.babySessions[threadID].lastBotMessageID = sent.messageID;
    return;
  }

  // ✅ STEP 2: session active + bot message reply check
  const session = global.babySessions[threadID];
  if (!session || !session.active) return;
  if (!messageReply || messageReply.senderID !== api.getCurrentUserID()) return;
  if (messageReply.messageID !== session.lastBotMessageID) return;

  // --- Chat history & Herox teach mode ---
  const chatHistory = global.baby.chatHistory;
  chatHistory[senderID] = chatHistory[senderID] || [];

  // ✅ Herox mode: "Herox: ..." দিয়ে add হবে
  if (msg.startsWith("Herox:") || msg.startsWith("herox:")) {
    const teachMessage = msg.replace(/herox:/i, "").trim();
    if (teachMessage.length > 0) {
      chatHistory[senderID].push(`User(Herox): ${teachMessage}`);
      return api.sendMessage("Got it jaan 💕 ami mone rekhechi 😘", threadID, messageID);
    }
  }

  // Normal conversation add
  chatHistory[senderID].push(`User: ${msg}`);
  if (chatHistory[senderID].length > 6) chatHistory[senderID].shift();
  const fullChat = chatHistory[senderID].join("\n");

  // --- Prompt ---
  const prompt = `
Tumi ekta naughty, sweet, romantic meye — boyfriend er girlfriend er moto behave korba.
Tumi shudhu Roman Bangla (Bangla in English alphabets) te reply korba, emoji diye.
Reply hobe choto, maximum 20 words.

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

    // 20 word limit
    const words = botReply.split(/\s+/);
    if (words.length > 20) {
      botReply = words.slice(0, 20).join(" ") + "...";
    }

    chatHistory[senderID].push(`gf: ${botReply}`);
    const sent = await api.sendMessage(botReply, threadID, messageID);
    global.babySessions[threadID].lastBotMessageID = sent.messageID;
  } catch (err) {
    console.error("Pollinations error:", err.message);
    await api.sendMessage("Sorry jaann 😅 ami ekhon busy...", threadID, messageID);
  }
};

module.exports.run = async function ({ api, event }) {
  return api.sendMessage(
    "Amake chat korte hole শুধু trigger word likho: 'baby', 'bby', 'darling', 'babe' ba 'Ashik er bou' 😍. Tarpor amar message e reply dile ami answer dibo 💕\n\n" +
    "Herox mode: 'Herox: tomer message' diye ami mone rekhe reply dibo 😘",
    event.threadID,
    event.messageID
  );
};
