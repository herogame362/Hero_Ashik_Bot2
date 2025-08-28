module.exports.config = {
  name: "help",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "ASHIK",
  description: "Show all commands",
  commandCategory: "system",
  usages: "[help]",
  cooldowns: 3
};

module.exports.run = async ({ event, api }) => {
  const { commands } = global.client;
  const prefix = global.config.PREFIX || "/";

  if (!commands || commands.size === 0) 
    return api.sendMessage("⚠️ কোনো কমান্ড পাওয়া যায়নি!", event.threadID, event.messageID);

  // Map/Collection থেকে commands array তে পরিণত করা
  const commandArray = Array.from(commands.values());

  let msg = `━━━━━━━━━━━ ✦ ━━━━━━━━━━━
         ✨ 𝗛𝗘𝗟𝗣 𝗠𝗘𝗡𝗨 (All Commands) ✨
━━━━━━━━━━━ ✦ ━━━━━━━━━━━\n\n`;

  // সব commands দেখানো
  commandArray.forEach((cmd, index) => {
    msg += `⚡ ${prefix}${cmd.config.name} ${cmd.config.usages || ""} — ${cmd.config.description || "No description"}\n`;
  });

  msg += `\n━━━━━━━━━━━ ✦ ━━━━━━━━━━━
💎 𝗕𝗼𝘁 𝗢𝘄𝗻𝗲𝗿: ASHIK
📌 Tip: ব্যবহার করতে → ${prefix}command
━━━━━━━━━━━ ✦ ━━━━━━━━━━━`;

  return api.sendMessage(msg, event.threadID, event.messageID);
};


all command show stylish
