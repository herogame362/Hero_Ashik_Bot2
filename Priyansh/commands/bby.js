const { download } = require('noobs-api'); // noobs-api import
const axios = require('axios');

const baseApiUrl = async () => {
    return "https://noobs-api.top/dipto";
};

module.exports.config = {
    name: "bby",
    aliases: ["baby", "bbe", "babe", "sam"],
    version: "6.9.0",
    author: "dipto",
    countDown: 0,
    role: 0,
    description: "better than all sim simi",
    category: "chat",
    guide: {
        en: "{pn} [anyMessage] OR\nteach [YourMessage] - [Reply1], [Reply2], [Reply3]... OR\nteach [react] [YourMessage] - [react1], [react2], [react3]... OR\nremove [YourMessage] OR\nrm [YourMessage] - [indexNumber] OR\nmsg [YourMessage] OR\nlist OR all OR\nedit [YourMessage] - [NewMessage]"
    }
};

module.exports.onStart = async ({ api, event, args, usersData }) => {
    const link = `${await baseApiUrl()}/baby`;
    const dipto = args.join(" ").toLowerCase();
    const uid = event.senderID;

    try {
        if (!args[0]) {
            const ran = ["Bolo baby", "hum", "type help baby", "type !baby hi"];
            return api.sendMessage(ran[Math.floor(Math.random() * ran.length)], event.threadID, event.messageID);
        }

        // Teach / Remove / List commands
        if (args[0] === 'remove') {
            const fina = dipto.replace("remove ", "");
            const dat = (await axios.get(`${link}?remove=${fina}&senderID=${uid}`)).data.message;
            return api.sendMessage(dat, event.threadID, event.messageID);
        }

        if (args[0] === 'rm' && dipto.includes('-')) {
            const [fi, f] = dipto.replace("rm ", "").split(/\s*-\s*/);
            const da = (await axios.get(`${link}?remove=${fi}&index=${f}`)).data.message;
            return api.sendMessage(da, event.threadID, event.messageID);
        }

        if (args[0] === 'list') {
            const d = (await axios.get(`${link}?list=all`)).data;
            return api.sendMessage(`❇️ | Total Teach = ${d.length || "api off"}\n♻️ | Total Response = ${d.responseLength || "api off"}`, event.threadID, event.messageID);
        }

        if (args[0] === 'teach') {
            const [comd, command] = dipto.split(/\s*-\s*/);
            const final = comd.replace(/teach( react| amar)? /i, "");
            if (!command) return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);

            let re;
            if (comd.includes('react')) {
                re = (await axios.get(`${link}?teach=${final}&react=${command}`)).data.message;
            } else if (comd.includes('amar')) {
                re = (await axios.get(`${link}?teach=${final}&senderID=${uid}&reply=${command}&key=intro`)).data.message;
            } else {
                re = (await axios.get(`${link}?teach=${final}&reply=${command}&senderID=${uid}&threadID=${event.threadID}`)).data.message;
            }
            return api.sendMessage(`✅ Replies added: ${re}`, event.threadID, event.messageID);
        }

        // Default chat using noobs-api download
        const userMessage = encodeURIComponent(dipto);
        const data = await download(`${link}?text=${userMessage}&senderID=${uid}&font=1`);
        const reply = data.data.reply || "😶";

        api.sendMessage(reply, event.threadID, (err, info) => {
            if (!global.miraiBot.onReply) global.miraiBot.onReply = new Map();
            global.miraiBot.onReply.set(info.messageID, {
                commandName: this.config.name,
                type: "reply",
                messageID: info.messageID,
                author: uid,
                reply
            });
        }, event.messageID);

    } catch (err) {
        console.log(err);
        api.sendMessage("❌ | Error occurred. Check console.", event.threadID, event.messageID);
    }
};

module.exports.onReply = async ({ api, event }) => {
    if ([api.getCurrentUserID()].includes(event.senderID)) return;

    try {
        const userMessage = encodeURIComponent(event.body?.toLowerCase());
        const data = await download(`${await baseApiUrl()}/baby?text=${userMessage}&senderID=${event.senderID}&font=1`);
        const reply = data.data.reply || "😶";

        api.sendMessage(reply, event.threadID, (err, info) => {
            if (!global.miraiBot.onReply) global.miraiBot.onReply = new Map();
            global.miraiBot.onReply.set(info.messageID, {
                commandName: this.config.name,
                type: "reply",
                messageID: info.messageID,
                author: event.senderID,
                reply
            });
        }, event.messageID);

    } catch (err) {
        api.sendMessage(`❌ Error: ${err.message}`, event.threadID, event.messageID);
    }
};

module.exports.onChat = async ({ api, event }) => {
    try {
        const body = (event.body || "").toLowerCase();
        if (/^(baby|bby|bot|jan|babu|janu)/.test(body)) {
            const msg = body.replace(/^\S+\s*/, "");
            const randomReplies = ["😚", "Yes 😀, I am here", "What's up?", "Bolo jaan ki korte panmr jonno"];

            if (!msg) {
                const reply = randomReplies[Math.floor(Math.random() * randomReplies.length)];
                return api.sendMessage(reply, event.threadID, event.messageID);
            }

            const data = await download(`${await baseApiUrl()}/baby?text=${encodeURIComponent(msg)}&senderID=${event.senderID}&font=1`);
            const reply = data.data.reply || "😶";

            api.sendMessage(reply, event.threadID, (err, info) => {
                if (!global.miraiBot.onReply) global.miraiBot.onReply = new Map();
                global.miraiBot.onReply.set(info.messageID, {
                    commandName: this.config.name,
                    type: "reply",
                    messageID: info.messageID,
                    author: event.senderID,
                    reply
                });
            }, event.messageID);
        }
    } catch (err) {
        api.sendMessage(`❌ Error: ${err.message}`, event.threadID, event.messageID);
    }
};
