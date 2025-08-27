const axios = require('axios');
const baseApiUrl = "https://noobs-api.top/dipto";

module.exports.config = {
    name: "bby",
    aliases: ["baby", "bbe", "babe", "sam"],
    version: "6.9.0",
    author: "dipto",
    description: "better than all sim simi",
};

// Event handler
module.exports.onMessage = async (event) => {
    try {
        const message = event.messageChain
            .filter(m => m.type === "Plain")
            .map(m => m.text)
            .join(" ")
            .toLowerCase();

        const senderId = event.sender.id;
        const groupId = event.sender.group ? event.sender.group.id : null;

        if (!message.startsWith("bby") && !message.startsWith("baby") && !message.startsWith("bot") && !message.startsWith("jan") && !message.startsWith("babu") && !message.startsWith("janu")) {
            return; // শুধু বট নাম দিলে রেসপন্ড করবে
        }

        const args = message.split(/\s+/);
        const commandText = args.slice(1).join(" ");

        // Basic reply when no args
        if (!commandText) {
            const ran = ["😚", "Yes 😀, I am here", "What's up?", "Bolo jaan ki korte panmr jonno"];
            return axios.post(`http://localhost:8080/sendGroupMessage`, {
                target: groupId || senderId,
                messageChain: [{ type: "Plain", text: ran[Math.floor(Math.random() * ran.length)] }]
            });
        }

        const link = `${baseApiUrl}/baby`;

        // Teach command
        if (args[0] === "teach") {
            const [comd, reply] = commandText.split(/\s*-\s*/);
            if (!reply || reply.length < 2) return sendMiraiMessage(senderId, groupId, "❌ | Invalid format! Use teach [Message] - [Reply]");
            const res = await axios.get(`${link}?teach=${encodeURIComponent(comd.replace("teach ", ""))}&reply=${encodeURIComponent(reply)}&senderID=${senderId}`);
            return sendMiraiMessage(senderId, groupId, `✅ Replies added: ${res.data.message}`);
        }

        // Remove command
        if (args[0] === "remove") {
            const toRemove = commandText.replace("remove ", "");
            const res = await axios.get(`${link}?remove=${encodeURIComponent(toRemove)}&senderID=${senderId}`);
            return sendMiraiMessage(senderId, groupId, res.data.message);
        }

        // List command
        if (args[0] === "list") {
            const res = await axios.get(`${link}?list=all`);
            return sendMiraiMessage(senderId, groupId, `Total Teach: ${res.data.length || "API off"}`);
        }

        // Normal chat reply
        const chatRes = await axios.get(`${link}?text=${encodeURIComponent(commandText)}&senderID=${senderId}&font=1`);
        return sendMiraiMessage(senderId, groupId, chatRes.data.reply);

    } catch (err) {
        console.log(err);
        const senderId = event.sender.id;
        const groupId = event.sender.group ? event.sender.group.id : null;
        sendMiraiMessage(senderId, groupId, `Error: ${err.message}`);
    }
};

// Helper function to send message
async function sendMiraiMessage(senderId, groupId, text) {
    const target = groupId || senderId;
    await axios.post(`http://localhost:8080/sendGroupMessage`, {
        target,
        messageChain: [{ type: "Plain", text }]
    });
              }
