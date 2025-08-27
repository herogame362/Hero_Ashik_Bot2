const fs = global.nodemodule["fs-extra"];
module.exports.config = {
  name: "goibot",
  version: "1.0.5",
  hasPermssion: 0,
  credits: "Ashikur Rahman",
  description: "goibot",
  commandCategory: "Noprefix",
  usages: "noprefix",
  cooldowns: 5,
};

const activeChats = new Map(); // threadID -> last bot messageID

// Romantic / flirty replies
const tl = [
  "Hai, ami tomar masum cheharay mugdhho 😘",
  "Bolo amar jan, ki khobor 😚",
  "Hey! Tomar hashi aj o amar mon chhue geche 😊",
  "Ami to shudhu tomar jonno opekkha korchi 😍",
  "Tumi ki aj o amar kotha vabcho? 🥺",
  "Ek chumbon dao, onek din dhore paini 😝",
  "Cholo ektu moja kori, ki bolo? 😏",
  "Ami tomake dekhte chai, ekhoni 😍",
  "Bolo to, ajke tomar din ta kemon katlo? 🥺",
  "Tumi amar hridoyer rajkumari/rajkumar 😍"
  // আরও অনেক TL reply এড করা যাবে
];

// Common user-bot replies
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
  // আরও common replies যোগ করা যাবে
];

module.exports.handleEvent = async function({ api, event, args, Threads, Users }) {
  const { threadID, messageID, senderID, body, messageReply } = event;
  const name = await Users.getNameUser(senderID);

  if (!body) return; // খালি মেসেজ হলে কিছু করবে না
  const bodyLower = body.toLowerCase();

  // Trigger words
  const triggers = ["bby", "bot", "baby", "babe", "Ariya", "ariya"];
  let isTrigger = triggers.some(word => bodyLower.includes(word.toLowerCase()));

  // 1️⃣ Trigger reply
  if (isTrigger) {
    const rand = tl[Math.floor(Math.random() * tl.length)];
    const msg = await api.sendMessage(`${name}, ${rand}`, threadID);
    activeChats.set(threadID, msg.messageID);
    return;
  }

  // 2️⃣ Common replies
  const common = commonReplies.find(cr => bodyLower.includes(cr.user.toLowerCase()));
  if (common) {
    const msg = await api.sendMessage(`${name}, ${common.bot}`, threadID);
    activeChats.set(threadID, msg.messageID);
    return;
  }

  // 3️⃣ Reply to bot's previous message
  if (messageReply && activeChats.get(threadID) === messageReply.messageID) {
    const rand = tl[Math.floor(Math.random() * tl.length)];
    const msg = await api.sendMessage(`${name}, ${rand}`, threadID);
    activeChats.set(threadID, msg.messageID);
    return;
  }
}

module.exports.run = function({ api, event, client, __GLOBAL }) { }
