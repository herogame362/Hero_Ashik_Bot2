const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "askai", // <-- নতুন কমান্ড নাম
  version: "3.0",
  hasPermssion: 0,
  credits: "Raj (Modified by Aria)",
  description: "Generate AI image using Replicate (stability-ai/sdxl)",
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

  const prompt = args.join(" ");
  const loadingMsg = await api.sendMessage(
    `🎨 | Generating image for: "${prompt}" using Replicate SDXL...`,
    event.threadID
  );

  try {
    // Replicate API call
    const replicateResponse = await axios.post(
      "https://api.replicate.com/v1/predictions",
      {
        version: "7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc", // model version hash
        input: { prompt }
      },
      {
        headers: {
          "Authorization": "Token r8_JsOTkiIQ7NhAzM3laQeJsSsD8g5zDSr0kbyJ5", // আপনার API token
          "Content-Type": "application/json"
        }
      }
    );

    // Poll for result
    let prediction = replicateResponse.data;
    while (prediction.status !== "succeeded" && prediction.status !== "failed") {
      await new Promise(r => setTimeout(r, 2000));
      const statusRes = await axios.get(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
        headers: { "Authorization": "Token r8_JsOTkiIQ7NhAzM3laQeJsSsD8g5zDSr0kbyJ5" }
      });
      prediction = statusRes.data;
    }

    if (prediction.status === "failed") throw new Error("Prediction failed");

    const imageUrl = prediction.output[0]; // image URL from Replicate

    // Download image
    const imageRes = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const cacheDir = path.join(__dirname, "cache");
    fs.ensureDirSync(cacheDir);
    const imagePath = path.join(cacheDir, `${Date.now()}_replicate.jpg`);
    fs.writeFileSync(imagePath, imageRes.data);

    // Send image
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
      "❌ | Failed to generate image. Try again later.",
      event.threadID,
      event.messageID
    );
  }
};
