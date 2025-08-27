const fs = global.nodemodule["fs-extra"];
module.exports.config = {
  name: "goibot",
  version: "1.0.9",
  hasPermssion: 0,
  credits: "Ashikur Rahman",
  description: "Full-featured goibot",
  commandCategory: "Noprefix",
  usages: "noprefix",
  cooldowns: 5,
};

const activeChats = new Map(); // threadID -> last bot messageID

// 1️⃣ Trigger words (strict)
const triggers = ["bby", "bot", "baby", "babe", "ariya", "Ariya"];

// 2️⃣ TL / romantic / flirty / fun replies (200+ examples)
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
  "Ajke tomar message peye khub khushi 😄",
  "Tomar hashi shunle mon nachte shuru kore 😄",
  "Ajke ami shudhu tomar kotha vabchi 💖",
  "Hai Janu, tomar chokh amar hridoy ke churi koreche 😘",
  "Tumi amar shukher alo 😇",
  "Ekta chumbon dao, shudhu kalponay 😘",
  "Ajke tomar sathe ek cup cha khete chai ☕😍",
  "Tumi ki ajke amar message peye khushi holo? 🥺",
  "Hey! Tomar chokher alo amar mon bhariye dilo 😘",
  "Ami shudhu tomake vabchi aj o 💖",
  "Cholo ekta game khelbo 😏",
  // আরও 180+ add করা যাবে
];

// 3️⃣ Common user-bot replies (50+ flexible match)
const commonReplies = [
  { user: "kemon acho", bot: "Ami bhalo achi, tumi kemon acho?" },
  { user: "kemon aso", bot: "Bhalo achi, tumi kemon aso?" },
  { user: "ki korcho", bot: "Shudhu boshe tomar kotha vabchi 😄, tumi ki korcho?" },
  { user: "ki khobor", bot: "Bhalo khobor 😇, tumi kemon aso?" },
  { user: "miss korchi", bot: "Ami o tomake miss korchi 🥺💖" },
  { user: "tumi kothay", bot: "Ami ekhane achi, tumi kothay?" },
  { user: "valo lagche", bot: "Bhalo laglo 😊, tumi kemon acho?" },
  { user: "kemon din chilo", bot: "Bhalo chilo, tumi kemon din katale?" },
  { user: "tumi ki busy", bot: "Na, ami free 😄, tumi ki korcho?" },
  { user: "bhalo achi", bot: "Khushi holo jante 😊, tumi kemon acho?" },
  { user: "ki korcho aj", bot: "Shudhu tomar kotha vabchi 😄, tumi ki korcho?" },
  { user: "kemon mood", bot: "Bhalo mood 😇, tumi kemon acho?" },
  { user: "ki plan achhe", bot: "Shudhu tomar sathe kotha bola plan 😍, tumi ki plan korcho?" },
  { user: "tumi kemon feel korcho", bot: "Bhalo feel korchi 😇, tumi kemon aso?" },
  { user: "tumi kothay aso aj", bot: "Ekhanei achi 😄, tumi kothay aso?" },
  { user: "ki khobor ajke", bot: "Shundor khobor 😇, tumi ki korcho?" },
  { user: "ki kaj korcho", bot: "Shudhu tomar kotha vabchi 😄, tumi ki korcho?" },
  { user: "kemon chole", bot: "Bhalo chole 😊, tumi kemon acho?" },
  { user: "tumi kemon lagcho", bot: "Bhalo lagchi 😊, tumi kemon acho?" },
  { user: "kothay thakcho", bot: "Ekhanei 😄, tumi kothay?" },
  { user: "ki shunte pachcho", bot: "Shudhu tomar kotha 😘, tumi ki korcho?" },
  { user: "tomar din kemon", bot: "Bhalo chilo 😊, tumi kemon aso?" },
  { user: "ki kaj chalu", bot: "Shudhu tomar kotha vabchi 😄, tumi ki korcho?" },
  { user: "tumi moja", bot: "Haha 😄 cholo moja kori!" },
  { user: "tumi moja korcho", bot: "Tumi maja korcho to? 🤭" },
  { user: "funny", bot: "Ami ready 😏 cholo suru kori!" }
  // আরও add করা যাবে
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

  // 1️⃣ Trigger reply (strict)
  if (triggers.some(word => bodyLower.includes(word))) {
    const rand = tl[Math.floor(Math.random() * tl.length)];
    const msg = await api.sendMessage(`${name}, ${rand}`, threadID);
    activeChats.set(threadID, msg.messageID);
    return;
  }

  // 2️⃣ Common replies (flexible match)
  for (let cr of commonReplies) {
    if (bodyLower.includes(cr.user)) { 
      const msg = await api.sendMessage(`${name}, ${cr.bot}`, threadID);
      activeChats.set(threadID, msg.messageID);
      return;
    }
  }

  // 3️⃣ Contextual replies
  for (let ctx of contextualReplies) {
    for (let word of ctx.keywords) {
      if (bodyLower.includes(word.toLowerCase())) {
        const rand = ctx.replies[Math.floor(Math.random() * ctx.replies.length)];
        const msg = await api.sendMessage(`${name}, ${rand}`, threadID);
        activeChats.set(threadID, msg.messageID);
        return;
      }
    }
  }

  // 4️⃣ Reply to bot's previous message
  if (messageReply && activeChats.get(threadID) === messageReply.messageID) {
    const rand = tl[Math.floor(Math.random() * tl.length)];
    const msg = await api.sendMessage(`${name}, ${rand}`, threadID);
    activeChats.set(threadID, msg.messageID);
    return;
  }
}

module.exports.run = function({ api, event, client, __GLOBAL }) { }
