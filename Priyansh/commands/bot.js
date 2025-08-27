const fs = global.nodemodule["fs-extra"];
module.exports.config = {
  name: "goibot",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "Ashikur Rahman",
  description: "Full-featured goibot with single reply fix",
  commandCategory: "Noprefix",
  usages: "noprefix",
  cooldowns: 5,
};

const activeChats = new Map(); // threadID -> last bot messageID

// 1️⃣ Trigger words (strict)
const triggers = ["bby", "bot", "baby", "babe", "ariya", "Ariya"];

// 2️⃣ TL / romantic / flirty / fun replies
const tl = [
  "Hai, ami tomar masum cheharay mugdhho 😘",
  "Bolo amar jan, ki khobor 😚",
  "Hey! Tomar hashi aj o amar mon chhue geche 😊",
  "Ami to shudhu tomar jonno opekkha korchi 😍",
  "Tumi ki aj o amar kotha vabcho? 🥺",
  "Ek chumbon dao, onek din dhore paini 😝",
  "Cholo ektu moja kori, ki bolo? 😏",
  "Ami tomar sathe thakte chai, ekhoni 🥰",
  "Tumi amar hridoyer rajkumari/rajkumar 😍",
  "Ajke tomar message peye khub khushi 😄"
  // আরও add করা যাবে
];

// 3️⃣ Common user-bot replies
const commonReplies = [
  { user: "kemon acho", bot: "Ami bhalo achi, tumi kemon acho?" },
  { user: "ki korcho", bot: "Shudhu boshe tomar kotha vabchi 😄, tumi ki korcho?" },
  { user: "ki khobor", bot: "Bhalo khobor 😇, tumi kemon aso?" },
  { user: "miss korchi", bot: "Ami o tomake miss korchi 🥺💖" },
  { user: "tumi kothay", bot: "Ami ekhane achi, tumi kothay?" }
];

// 4️⃣ Contextual replies (gali, proposal, funny)
const contextualReplies = [
  // Gali / offensive
  { keywords: ["mad", "goru", "bodmash", "stupid", "harami"], replies: [
    "Hey! Eto galo keno 😅", 
    "Ami galo pochondo kori na 😇", 
    "Ami to shudhu bhalobasha dite chai 💖"
  ]},

  // Proposal / romantic
  { keywords: ["ami tomake bhalobashi", "propose", "marry me", "biye korte chai"], replies: [
    "Awww 🥰 ami o tomake bhalobashi 💖", 
    "Tomar kotha shune mon khushi holo 😍", 
    "Cholo ekta cup cha kheye decide kori ☕😊"
  ]},

  // Funny / casual
  { keywords: ["khela korbo", "moja", "funny", "tumi moja"], replies: [
    "Haha 😄 cholo moja kori!", 
    "Tumi maja korcho to? 🤭", 
    "Ami ready 😏 cholo suru kori!"
  ]}
];

module.exports.handleEvent = async function({ api, event, Users }) {
  const { threadID, messageID, senderID, body, messageReply } = event;
  if (!body) return;

  const name = await Users.getNameUser(senderID);
  const bodyLower = body.toLowerCase();

  let replied = false; // ✅ Flag to prevent multiple replies

  // 1️⃣ Trigger reply (strict)
  if (triggers.some(word => bodyLower.includes(word))) {
    const rand = tl[Math.floor(Math.random() * tl.length)];
    const msg = await api.sendMessage(`${name}, ${rand}`, threadID);
    activeChats.set(threadID, msg.messageID);
    replied = true;
  }

  // 2️⃣ Common replies (flexible match)
  if (!replied) {
    for (let cr of commonReplies) {
      if (bodyLower.includes(cr.user)) { 
        const msg = await api.sendMessage(`${name}, ${cr.bot}`, threadID);
        activeChats.set(threadID, msg.messageID);
        replied = true;
        break;
      }
    }
  }

  // 3️⃣ Contextual replies
  if (!replied) {
    for (let ctx of contextualReplies) {
      for (let word of ctx.keywords) {
        if (bodyLower.includes(word.toLowerCase())) {
          const rand = ctx.replies[Math.floor(Math.random() * ctx.replies.length)];
          const msg = await api.sendMessage(`${name}, ${rand}`, threadID);
          activeChats.set(threadID, msg.messageID);
          replied = true;
          break;
        }
      }
      if (replied) break;
    }
  }

  // 4️⃣ Reply to bot's previous message
  if (!replied && messageReply && activeChats.get(threadID) === messageReply.messageID) {
    const rand = tl[Math.floor(Math.random() * tl.length)];
    const msg = await api.sendMessage(`${name}, ${rand}`, threadID);
    activeChats.set(threadID, msg.messageID);
  }
}

module.exports.run = function({ api, event, client, __GLOBAL }) { }
