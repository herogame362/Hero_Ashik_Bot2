const fs = global.nodemodule["fs-extra"];
module.exports.config = {
  name: "goibot",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "Ashikur Rahman",
  description: "goibot",
  commandCategory: "Noprefix",
  usages: "noprefix",
  cooldowns: 5,
};

const activeChats = new Map(); // threadID -> last bot messageID

module.exports.handleEvent = async function({ api, event, args, Threads, Users }) {
  const { threadID, messageID, senderID, body, messageReply } = event;
  const name = await Users.getNameUser(senderID);

  // যে শব্দগুলো trigger করবে
  const triggers = ["bby", "bot", "baby", "babe", "Ariya", "ariya"];
  
  const tl = [
    "হায়, আমি তোমার মাসুম চেহারায় মুগ্ধ 😘",
    "বট বলো না, ওয়ে জানু বলো আমাকে",
    "বারবার বিরক্ত করো না জানু, ব্যস্ত আছি 🤭🐒",
    "এত কাছে এসো না, ভালোবাসা হবে",
    "বলো বেবি তুমি কি আমাকে ভালোবাসো 🙈💋💋",
    "এক চুম্বন দাও, অনেক দিন ধরে পাইনি 😝",
    "বল আমার জান, কি খবর😚"
  ];

  // Check if body has trigger word
  const bodyLower = body.toLowerCase();
  let isTrigger = triggers.some(word => bodyLower.includes(word.toLowerCase()));

  // যদি trigger শব্দ থাকে, র্যান্ডম মেসেজ পাঠাও
  if (isTrigger) {
    const rand = tl[Math.floor(Math.random() * tl.length)];
    const msg = await api.sendMessage(`${name}, ${rand}`, threadID);
    activeChats.set(threadID, msg.messageID); // বটের মেসেজ ID স্মরণ কর
    return;
  }

  // যদি user reply দেয় বটের আগের মেসেজে, তখন বট রিপ্লাই দিবে
  if (messageReply && activeChats.get(threadID) == messageReply.messageID) {
    const rand = tl[Math.floor(Math.random() * tl.length)];
    return api.sendMessage(`${name}, ${rand}`, threadID);
  }
}

module.exports.run = function({ api, event, client, __GLOBAL }) { }
