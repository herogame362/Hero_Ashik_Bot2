const fs = global.nodemodule["fs-extra"];
module.exports.config = {
  name: "goibot",
  version: "1.5.0",
  hasPermssion: 0,
  credits: "Ashikur Rahman",
  description: "Ultimate Self-Learning Goibot with memory",
  commandCategory: "Noprefix",
  usages: "noprefix",
  cooldowns: 5,
};

const activeChats = new Map();
let conversationMemory = {};

// Load conversation memory
try { conversationMemory = fs.readJSONSync("./memory.json"); } 
catch(e) { conversationMemory = {}; }

// Trigger words
const triggers = ["bby", "bot", "baby", "babe", "ariya", "Ariya"];

// TL / Romantic / Flirty / Fun replies (sample, expand 500+)
const tl = [
  "Hai, ami tomar masum cheharay mugdhho 😘",
  "Bolo amar jan, ki khobor 😚",
  "Hey! Tomar hashi aj o amar mon chhue geche 😊"
];

// Common replies (sample, expand 200+)
const commonReplies = [
  { user: "kemon acho", bot: "Ami bhalo achi, tumi kemon acho?" },
  { user: "tumar nam ki", bot: "Ariya, amar nam Ariya 😘" },
  { user: "tomar admin ke", bot: "Ami to Ashikur Rahman er banano 😎" }
];

// Contextual replies (sample, expand 100+)
const contextualReplies = [
  { keywords: ["mad","stupid","fuck","bastard"], replies: [
    "Hey! Eto galo keno 😅", 
    "Ami galo pochondo kori na 😇"
  ]},
  { keywords: ["ami tomake bhalobashi","propose","marry me","biye korte chai"], replies: [
    "Awww 🥰 ami o tomake bhalobashi 💖"
  ]}
];

// Fuzzy similarity
function getSimilarity(a, b) {
  const wordsA = a.toLowerCase().split(" ");
  const wordsB = b.toLowerCase().split(" ");
  const common = wordsA.filter(word => wordsB.includes(word));
  return common.length / Math.max(wordsA.length, 1);
}

module.exports.handleEvent = async function({ api, event }) {
  const { threadID, messageID, body, messageReply } = event;
  if (!body) return;
  const bodyLower = body.toLowerCase();
  let replied = false;
  let botReply = "";

  // 1️⃣ Check conversation memory (fuzzy learning)
  for (let thread in conversationMemory) {
    for (let conv of conversationMemory[thread]) {
      let similarity = getSimilarity(conv.user, bodyLower);
      if(similarity >= 0.3) {
        botReply = conv.bot;
        const msg = await api.sendMessage(botReply, threadID);
        activeChats.set(threadID, msg.messageID);
        replied = true;
        break;
      }
    }
    if(replied) break;
  }

  // 2️⃣ Trigger reply (strict)
  if (!replied && triggers.some(word => bodyLower.includes(word))) {
    botReply = tl[Math.floor(Math.random() * tl.length)];
    const msg = await api.sendMessage(botReply, threadID);
    activeChats.set(threadID, msg.messageID);
    replied = true;
  }

  // 3️⃣ Common replies
  if (!replied) {
    for (let cr of commonReplies) {
      if (bodyLower.includes(cr.user)) {
        botReply = cr.bot;
        const msg = await api.sendMessage(botReply, threadID);
        activeChats.set(threadID, msg.messageID);
        replied = true;
        break;
      }
    }
  }

  // 4️⃣ Contextual replies
  if (!replied) {
    for (let ctx of contextualReplies) {
      for (let word of ctx.keywords) {
        if (bodyLower.includes(word.toLowerCase())) {
          botReply = ctx.replies[Math.floor(Math.random() * ctx.replies.length)];
          const msg = await api.sendMessage(botReply, threadID);
          activeChats.set(threadID, msg.messageID);
          replied = true;
          break;
        }
      }
      if(replied) break;
    }
  }

  // 5️⃣ Reply to bot's previous message (fuzzy)
  if (!replied && messageReply && activeChats.get(threadID) === messageReply.messageID) {
    const previousMsg = messageReply.body.toLowerCase();
    const similarity = getSimilarity(previousMsg, bodyLower);
    if (similarity >= 0.3) {
      botReply = tl[Math.floor(Math.random() * tl.length)];
      const msg = await api.sendMessage(botReply, threadID);
      activeChats.set(threadID, msg.messageID);
      replied = true;
    }
  }

  // 6️⃣ Store conversation in memory
  if(botReply) {
    if(!conversationMemory[threadID]) conversationMemory[threadID] = [];
    conversationMemory[threadID].push({ user: bodyLower, bot: botReply });
    fs.writeJSONSync("./memory.json", conversationMemory);
  }
};

module.exports.run = function({ api, event, client, __GLOBAL }) { };
