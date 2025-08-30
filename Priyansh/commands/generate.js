const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "genv",
    version: "2.0",
    hasPermssion: 0,
    credits: "Raj",
    description: "Generate AI image using prompt",
    commandCategory: "ai",
    usages: "generate <prompt>",
    cooldowns: 3
  },

  onStart: async function ({ api, event, args }) {
    const prompt = args.join(" ");
    if (!prompt) return api.sendMessage("⚠️ | Please provide a prompt.\n\nExample: generate flying boy raj", event.threadID, event.messageID);

    const loading = await api.sendMessage(`🎨 | Generating image for: "${prompt}"...`, event.threadID);

    try {
      // Ensure cache folder exists
      const cacheDir = path.join(__dirname, "cache");
      fs.ensureDirSync(cacheDir);

      const res = await axios.get(`https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`, {
        responseType: 'arraybuffer'
      });

      const imagePath = path.join(cacheDir, `${Date.now()}_gen.jpg`);
      fs.writeFileSync(imagePath, res.data);

      api.sendMessage({
        body: `✅ | Prompt: "${prompt}"`,
        attachment: fs.createReadStream(imagePath)
      }, event.threadID, () => fs.unlinkSync(imagePath), loading.messageID);

    } catch (err) {
      console.error(err);
      api.sendMessage("❌ | Failed to generate image. Try again later.", event.threadID, event.messageID);
    }
  }
};
