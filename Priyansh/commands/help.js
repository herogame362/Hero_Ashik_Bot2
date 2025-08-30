module.exports.config = {
  name: "help",
  version: "1.3.0",
  hasPermssion: 0,
  credits: "ASHIK",
  description: "Show all commands with fancy box and emojis",
  commandCategory: "system",
  usages: "[help]",
  cooldowns: 3
};

const commandEmojis = {
  info: "ℹ️",
  mm: "💾",
  red: "🔴",
  shayri: "✍️",
  sub: "🎶",
  tea: "🍵",
  "6mui": "📸",
  bio: "📝",
  googlebar: "🌐",
  obama: "🗣️",
  offbot: "⏹️",
  rank: "🏆",
  rushia: "🎀",
  search: "🔍",
  trump: "🦅",
  job: "💼",
  acp: "👥",
  ckbot: "🤖",
  adc: "🛠️",
  // আরও কমান্ড এখানে অ্যাড করতে পারো
};

module.exports.run = async ({ event, api }) => {
  const { commands } = global.client;
  const prefix = global.config.PREFIX || "/";

  if (!commands || commands.size === 0)
    return api.sendMessage("⚠️ কোনো কমান্ড পাওয়া যায়নি!", event.threadID, event.messageID);

  const commandArray = Array.from(commands.values());

  let msg = `════════════════════════════════════════════════════\n`;

  for (let i = 0; i < commandArray.length; i += 2) {
    const left = commandArray[i];
    const right = commandArray[i + 1];

    const leftEmoji = commandEmojis[left.config.name] || "⚡";
    const rightEmoji = right ? commandEmojis[right.config.name] || "⚡" : "";

    msg += `╔══════════════════╗    ${right ? '╔══════════════════╗' : ''}\n`;
    msg += `║ ${leftEmoji} ${prefix}${left.config.name} ${left.config.usages || ""} `.padEnd(20) + `║    `;
    if (right) msg += `║ ${rightEmoji} ${prefix}${right.config.name} ${right.config.usages || ""} `.padEnd(20) + `║`;
    msg += `\n`;
    msg += `║ ${left.config.description || "No description"} `.padEnd(20) + `║    `;
    if (right) msg += `║ ${right.config.description || "No description"} `.padEnd(20) + `║`;
    msg += `\n`;
    msg += `╚══════════════════╝    ${right ? '╚══════════════════╝' : ''}\n`;
    msg += `────────────────────────────────────────────\n`;
  }

  msg += `💎 Bot Owner: ASHIK\n📌 Tip: ব্যবহার করতে → ${prefix}command\n`;
  msg += `════════════════════════════════════════════════════`;

  return api.sendMessage(msg, event.threadID, event.messageID);
};
