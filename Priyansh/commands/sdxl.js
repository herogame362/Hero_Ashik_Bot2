const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "askai",
  version: "3.1",
  hasPermssion: 0,
  credits: "Raj (Modified by Aria)",
  description: "Generate AI image using Replicate SDXL (safe & reliable)",
  commandCategory: "ai",
  usages: "askai <prompt>",
  cooldowns: 3
};

module.exports.run = async function ({ api, event, args }) {
  if (!args[0]) return api.sendMessage(
    "⚠️ | Please provide a prompt.\n\nExample: askai Itachi Uchiha cinematic anime",
    event.threadID,
    event.messageID
  );

  // sanitize prompt (remove quotes etc.)
  const prompt = args.join(" ").replace(/["']/g, "");

  const loadingMsg = await api.sendMessage(
    `🎨 | Generating image for: "${prompt}" using Replicate SDXL...`,
    event.threadID
  );

  try {
    const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN; // load from .env

    // start prediction
    let prediction = (await axios.post(
      "https://api.replicate.com/v1/predictions",
      {
        version: "7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc",
        input: { prompt }
      },
      {
        headers: {
          "Authorization": `Token ${REPLICATE_API_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    )).data;

    // poll until finished
    while (prediction.status !== "succeeded" && prediction.status !== "failed") {
      await new Promise(r => setTimeout(r, 2000)); // wait 2s
      prediction = (await axios.get(
        `https://api.replicate.com/v1/predictions/${prediction.id}`,
        { headers: { "Authorization": `Token ${REPLICATE_API_TOKEN}` } }
      )).data;
    }

    if (prediction.status === "failed") {
      throw new Error("Prediction failed. Check your API token, credits, or prompt.");
    }

    const imageUrl = prediction.output[0]; // generated image URL

    // download image
    const imageRes = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const cacheDir = path.join(__dirname, "cache");
    fs.ensureDirSync(cacheDir);
    const imagePath = path.join(cacheDir, `${Date.now()}_replicate.jpg`);
    fs.writeFileSync(imagePath, imageRes.data);

    // send image
    api.sendMessage(
      {
        body: `✅ | Prompt: "${prompt}"`,
        attachment: fs.createReadStream(imagePath)
      },
      event.threadID,
      () => fs.unlinkSync(imagePath),
      loadingMsg.messageID
    );

  } catch (err) {
    console.error(err);
    api.sendMessage(
      `❌ | Failed to generate image.\nReason: ${err.message}`,
      event.threadID,
      event.messageID
    );
  }
};
