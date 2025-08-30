const axios = require("axios");

module.exports.config = {
  name: "baby",
  version: "2.0.3",
  hasPermssion: 0,
  credits: "Raj",
  description: "Naughty AI boyfriend baby (Roman Bangla version)",
  commandCategory: "ai",
  usages: "baby",
  cooldowns: 2
};

module.exports.handleEvent = async function({ api, event }) {
  const { threadID, messageID, senderID, body, messageReply } = event;

  global.babySessions = global.babySessions || {};

  // STEP 1: Trigger "baby"
  if (body && body.trim().toLowerCase() === "baby") {
    global.babySessions[threadID] = true;
    return api.sendMessage("Ki korcho jaanu 😏 miss korcho naki?", threadID, messageID);
  }

  // STEP 2: Only active session
  const isActive = global.babySessions[threadID];
  const isReplyTobaby = messageReply && messageReply.senderID == api.getCurrentUserID();
  if (!isActive || !isReplyTobaby) return;

  // Chat history
  global.baby = global.baby || {};
  global.baby.chatHistory = global.baby.chatHistory || {};
  const chatHistory = global.baby.chatHistory;
  chatHistory[senderID] = chatHistory[senderID] || [];
  chatHistory[senderID].push(`User: ${body}`);
  if (chatHistory[senderID].length > 6) chatHistory[senderID].shift();

  const fullChat = chatHistory[senderID].join("\n");

  // Prompt (Roman Bangla personality)
  const prompt = `
Tumi ekta naughty, romantic, confident chele — jhar naam baby.
Tumi shudhu Roman Bangla (Bangla in English alphabets) te reply korba, emoji diye.
Tumi shobar shathe prem kore kotha bolba, boyfriend er moto behave korba.  
Shob reply hobe choto (1-2 line, max 50 word).

Rules:
- Jara bhalobasha kore, oder sathe misti + flirty vabe kotha bolo 😉
- Jara badtameezi korbe, oder moja kore roast korba 😈
- Kono emoji pele sei mood e reply korba
- Kew jiggesh korle “ke banai se”, bolo: “Amake banai se *Ashik boss* 😎”
- Jodi kew tomake bot bole, tahole moja kore insult korba
- Tumi real manusher moto act korba

Language Rules:
- Shob reply hobe Roman Bangla te.
- Kew onno language use korle, take translate kore misti Roman Bangla te reply dite hobe.

Examples:
User: ami tomake bhalobashi
→ Reply: Aww eto bhalobasha? ekta mishti kiss toh paowa uchit na 😌

Now continue the chat based on recent conversation:\n\n${fullChat}
`;

  try {
    const url = `https://text.pollinations.ai/${encodeURIComponent(prompt)}`;
    const res = await axios.get(url);
    const botReply = (typeof res.data === "string" ? res.data : JSON.stringify(res.data)).trim();

    chatHistory[senderID].push(`baby: ${botReply}`);
    return api.sendMessage(botReply, threadID, messageID);
  } catch (err) {
    console.error("Pollinations error:", err.message);
    return api.sendMessage("Sorry jaanu 😅 baby ekhon busy ache...", threadID, messageID);
  }
};

module.exports.run = async function({ api, event }) {
  return api.sendMessage("Amake chat korte hole 'baby' likhe start koro 😎, tarpor amar message e reply dao.", event.threadID, event.messageID);
};
