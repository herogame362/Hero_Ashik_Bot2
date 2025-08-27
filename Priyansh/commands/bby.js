const { download } = require('noobs-api');

module.exports.onChat = async ({ api, event }) => {
    try {
        let body = (event.body || "").trim().toLowerCase(); // trim() দিয়ে extra space remove
        if (/^(baby|bby|bot|jan|babu|janu)/.test(body)) {
            let msg = body.replace(/^\S+\s*/, ""); // প্রথম word বাদ
            if (!msg) { // যদি শুধু bby লেখা থাকে
                const randomReplies = ["😚", "Yes 😀, I am here", "What's up?", "Bolo jaan ki korte panmr jonno"];
                return api.sendMessage(randomReplies[Math.floor(Math.random() * randomReplies.length)], event.threadID, event.messageID);
            }

            // API call
            const apiData = await download(`${await baseApiUrl()}/baby?text=${encodeURIComponent(msg)}&senderID=${event.senderID}&font=1`);
            const reply = apiData.data?.reply || "😶"; // fallback reply
            api.sendMessage(reply, event.threadID, event.messageID);
        }
    } catch (err) {
        console.error("Chat error:", err);
        api.sendMessage(`❌ Error: ${err.message}`, event.threadID, event.messageID);
    }
};
