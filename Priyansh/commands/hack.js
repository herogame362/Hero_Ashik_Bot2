const { loadImage, createCanvas } = require("canvas");
const fs = require("fs-extra");
const axios = require("axios");

module.exports.config = {
  name: "hack",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Modified by Aria",
  description: "Hack Style Profile Card",
  commandCategory: "fun",
  usages: "@mention",
  cooldowns: 0
};

async function wrapText(ctx, text, maxWidth) {
  if (ctx.measureText(text).width < maxWidth) return [text];
  if (ctx.measureText("W").width > maxWidth) return null;

  const words = text.split(" ");
  const lines = [];
  let line = "";

  while (words.length > 0) {
    let split = false;
    while (ctx.measureText(words[0]).width >= maxWidth) {
      const temp = words[0];
      words[0] = temp.slice(0, -1);
      if (split) words[1] = `${temp.slice(-1)}${words[1]}`;
      else {
        split = true;
        words.splice(1, 0, temp.slice(-1));
      }
    }
    if (ctx.measureText(line + words[0]).width < maxWidth) {
      line += `${words.shift()} `;
    } else {
      lines.push(line.trim());
      line = "";
    }
    if (words.length === 0) lines.push(line.trim());
  }
  return lines;
}

module.exports.run = async function ({ api, event, Users }) {
  try {
    let pathImg = __dirname + "/cache/bg.png";
    let pathAvt = __dirname + "/cache/avt.png";

    // Mention অথবা sender id
    var id = Object.keys(event.mentions)[0] || event.senderID;
    var name = await Users.getNameUser(id);

    // Background image
    var bgList = [
      "https://i.imgur.com/VQXViKI.png"
    ];
    var rdBg = bgList[Math.floor(Math.random() * bgList.length)];

    // User avatar
    let getAvt = (
      await axios.get(
        `https://graph.facebook.com/${id}/picture?width=720&height=720`,
        { responseType: "arraybuffer" }
      )
    ).data;
    fs.writeFileSync(pathAvt, Buffer.from(getAvt, "utf-8"));

    // Background download
    let getBG = (
      await axios.get(rdBg, { responseType: "arraybuffer" })
    ).data;
    fs.writeFileSync(pathImg, Buffer.from(getBG, "utf-8"));

    // Load Images
    let baseImage = await loadImage(pathImg);
    let avatar = await loadImage(pathAvt);

    // Canvas Create
    let canvas = createCanvas(baseImage.width, baseImage.height);
    let ctx = canvas.getContext("2d");

    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

    // Font set
    ctx.font = "23px sans-serif";
    ctx.fillStyle = "#1878F3";
    ctx.textAlign = "start";

    // Name wrap
    const lines = await wrapText(ctx, name, 1160);
    ctx.fillText(lines.join("\n"), 200, 497);

    // Avatar Draw
    ctx.drawImage(avatar, 83, 437, 100, 101);

    // Export
    const imageBuffer = canvas.toBuffer();
    fs.writeFileSync(pathImg, imageBuffer);
    fs.removeSync(pathAvt);

    return api.sendMessage(
      { body: "Hacked 😈", attachment: fs.createReadStream(pathImg) },
      event.threadID,
      () => fs.unlinkSync(pathImg),
      event.messageID
    );
  } catch (err) {
    return api.sendMessage("⚠️ Error: " + err.message, event.threadID, event.messageID);
  }
};
