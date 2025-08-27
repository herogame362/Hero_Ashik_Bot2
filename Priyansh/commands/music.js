const fs = require("fs");
const path = require("path");
const ytSearch = require("yt-search");
const fetch = require("node-fetch");
const axios = require("axios");

module.exports = {
  config: {
    name: "music",
    version: "1.1.0",
    hasPermssion: 0,
    credits: "HERO + ChatGPT",
    description: "Search and download YouTube songs (with thumbnails)",
    commandCategory: "Media",
    usages: "[song name]",
    cooldowns: 5
  },

  run: async function({ api, event, args }) {
    const songName = args.join(" ");
    if (!songName) return api.sendMessage("🎵 দয়া করে গান নাম লিখুন!", event.threadID, event.messageID);

    try {
      const searchResults = await ytSearch(songName);
      if (!searchResults || !searchResults.videos.length) 
        return api.sendMessage("❌ কোনো ফলাফল পাওয়া যায়নি!", event.threadID, event.messageID);

      const topResults = searchResults.videos.slice(0, 6); // প্রথম ৬টা ভিডিও
      let msg = "🎶 নিচের লিস্ট থেকে একটি সিলেক্ট করুন:\n\n";

      // cache ফোল্ডার বানানো
      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

      let attachments = [];
      for (let i = 0; i < topResults.length; i++) {
        const video = topResults[i];
        msg += `${i + 1}. ${video.title} (${video.timestamp})\n`;

        // thumbnail ডাউনলোড করা
        const thumbPath = path.join(cacheDir, `thumb_${event.senderID}_${i}.jpg`);
        const response = await axios.get(video.thumbnail, { responseType: "arraybuffer" });
        fs.writeFileSync(thumbPath, Buffer.from(response.data, "binary"));
        attachments.push(fs.createReadStream(thumbPath));
      }

      api.sendMessage(
        { body: msg, attachment: attachments },
        event.threadID,
        (err, info) => {
          global.client.handleReply.push({
            type: "music_select",
            name: this.config.name,
            messageID: info.messageID,
            author: event.senderID,
            videos: topResults,
            thumbs: attachments.map((_, i) => path.join(cacheDir, `thumb_${event.senderID}_${i}.jpg`))
          });
        },
        event.messageID
      );

    } catch (error) {
      console.error(error);
      return api.sendMessage("❌ গান সার্চ করতে সমস্যা হয়েছে।", event.threadID, event.messageID);
    }
  },

  handleReply: async function({ api, event, handleReply }) {
    if (event.senderID !== handleReply.author) return;

    const choice = parseInt(event.body);
    if (isNaN(choice) || choice < 1 || choice > handleReply.videos.length) 
      return api.sendMessage("❌ সঠিক সংখ্যা লিখুন!", event.threadID, event.messageID);

    const video = handleReply.videos[choice-1];
    const downloadPath = path.join(__dirname, "cache", `${video.videoId}.mp3`);

    try {
      // Priyansh এর API দিয়ে গান নামানো
      const apiKey = "priyansh-here"; // এখানে তোমার API key বসাবে
      const apiUrl = `https://priyanshuapi.xyz/youtube?id=${video.videoId}&type=audio&apikey=${apiKey}`;
      const downloadResponse = await axios.get(apiUrl);
      const downloadUrl = downloadResponse.data.downloadUrl;

      const songBuffer = await (await fetch(downloadUrl)).buffer();
      fs.writeFileSync(downloadPath, songBuffer);

      // গান পাঠানো
      await api.sendMessage({
        attachment: fs.createReadStream(downloadPath),
        body: `🎧 আপনার গান: ${video.title}`
      }, event.threadID, () => {
        if (fs.existsSync(downloadPath)) fs.unlinkSync(downloadPath);
        handleReply.thumbs.forEach(t => fs.existsSync(t) && fs.unlinkSync(t)); // সব thumbnail ডিলিট
        api.unsendMessage(handleReply.messageID); // সিলেকশন মেসেজ রিমুভ
      }, event.messageID);

    } catch (error) {
      console.error(error);
      return api.sendMessage("❌ গান ডাউনলোড করতে সমস্যা হয়েছে।", event.threadID, event.messageID);
    }
  }
};
