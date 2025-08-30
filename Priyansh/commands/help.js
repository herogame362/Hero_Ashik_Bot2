module.exports.config = {
  name: "help",
  version: "1.2.0",
  hasPermssion: 0,
  credits: "ASHIK",
  description: "Show all commands in big boxes",
  commandCategory: "system",
  usages: "[help]",
  cooldowns: 3
};

module.exports.run = async ({ event, api }) => {
  const { commands } = global.client;
  const prefix = global.config.PREFIX || "/";

  if (!commands || commands.size === 0) 
    return api.sendMessage("⚠️ কোনো কমান্ড পাওয়া যায়নি!", event.threadID, event.messageID);

  const commandArray = Array.from(commands.values());

  let msgParts = [];

  // প্রতিটি কমান্ড আলাদা বড় বক্সে
  commandArray.forEach(cmd => {
    const emoji = cmd.config.emoji || "⚡"; // যদি কমান্ডে ইমোজি define থাকে, তা নাও, নাহলে default
    const usage = cmd.config.usages ? cmd.config.usages : "";
    const description = cmd.config.description ? cmd.config.description : "No description";

    const box = `╔══════════════════════════════════════╗
║ ${emoji} ${prefix}${cmd.config.name} ${usage}
║ ${description}
╚══════════════════════════════════════╝`;

    msgParts.push(box);
  });

  // Bot Owner info
  const ownerBox = `╔══════════════════════════════════════╗
║ 💎 Bot Owner: ASHIK
║ 📌 Tip: ব্যবহার করতে → ${prefix}command
╚══════════════════════════════════════╝`;

  msgParts.push(ownerBox);

  // Mirai-compatible: Send message in chunks if too long
  const CHUNK_SIZE = 4000;
  let fullMsg = "";
  for (let i = 0; i < msgParts.length; i++) {
    if ((fullMsg + msgParts[i] + "\n").length > CHUNK_SIZE) {
      await api.sendMessage(fullMsg, event.threadID, event.messageID);
      fullMsg = "";
    }
    fullMsg += msgParts[i] + "\n\n";
  }

  if (fullMsg.length > 0) {
    await api.sendMessage(fullMsg, event.threadID, event.messageID);
  }
};
