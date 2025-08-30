module.exports.config = {
  name: "help",
  version: "1.2.0",
  hasPermssion: 0,
  credits: "ASHIK",
  description: "Show all commands",
  commandCategory: "system",
  usages: "[help/help2/help3]",
  cooldowns: 3
};

module.exports.run = async ({ event, api, args }) => {
  const { commands } = global.client;
  const prefix = global.config.PREFIX || "/";
  if (!commands || commands.size === 0) 
    return api.sendMessage("⚠️ কোনো কমান্ড পাওয়া যায়নি!", event.threadID, event.messageID);

  const commandArray = Array.from(commands.values());

  // Args অনুযায়ী limit ঠিক করা
  let limit;
  if (args[0] === "help") limit = 10;
  else if (args[0] === "help2") limit = 50;
  else if (args[0] === "help3") limit = commandArray.length;
  else limit = 10; // ডিফল্ট

  const slicedCommands = commandArray.slice(0, limit);

  let msg = `══════════════════════════════════════\n`;
  // দুই বক্সে কমান্ড দেখানো
  for (let i = 0; i < slicedCommands.length; i += 1) {
    const cmd = slicedCommands[i];
    const name = `${prefix}${cmd.config.name}`;
    const desc = cmd.config.description || "No description";
    // দুই বক্স
    msg += `╔══════════════╗    ╔══════════════╗\n`;
    msg += `${name.padEnd(18)}    ${name.padEnd(18)}\n`;
    msg += `${desc.padEnd(18)}    ${desc.padEnd(18)}\n`;
    msg += `╚══════════════╝    ╚══════════════╝\n`;
    msg += "────────────────────────────────────\n";
  }

  msg += `💎 Bot Owner: ASHIK\n📌 Tip: ব্যবহার করতে → ${prefix}command\n══════════════════════════════════════`;

  return api.sendMessage(msg, event.threadID, event.messageID);
};
