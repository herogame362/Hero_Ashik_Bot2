module.exports.run = async function({ api, event }) {
    const { createReadStream, existsSync, mkdirSync, readdirSync } = global.nodemodule["fs-extra"];
    const { join } = global.nodemodule["path"];
    const { threadID } = event;

    // যদি বট গ্রুপে যুক্ত হয়
    if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
        api.changeNickname(`[ ${global.config.PREFIX} ] • ${(!global.config.BOTNAME) ? " " : global.config.BOTNAME}`, threadID, api.getCurrentUserID());
        const fs = require("fs");
        return api.sendMessage("", event.threadID, () => 
            api.sendMessage({
                body: `🍒💙•••Ɓ❍ʈ Ƈøɳɳɛƈʈɛɗ•••💞🌿
🕊️🌸...Ɦɛɭɭ❍ Ɠɣus Ɱɣ Ɲɑɱɛ Is 🍒💙•••✦Ariya✦•••💞🌿`,
                attachment: fs.createReadStream(__dirname + "/cache/botjoin.mp4")
            }, threadID)
        );
    } else {
        try {
            let { threadName, participantIDs } = await api.getThreadInfo(threadID);
            const threadData = global.data.threadData.get(parseInt(threadID)) || {};
            const path = join(__dirname, "cache", "joinvideo");
            const pathGif = join(path, `${threadID}.video`);
            
            var mentions = [], nameArray = [], memLength = [], i = 0;
            for (id in event.logMessageData.addedParticipants) {
                const userName = event.logMessageData.addedParticipants[id].fullName;
                nameArray.push(userName);
                mentions.push({ tag: userName, id });
                memLength.push(participantIDs.length - i++);
            }
            memLength.sort((a, b) => a - b);

            // নতুন ফ্যান্সি স্টাইল মেসেজ, নাম ফিক্স করে "Ashikur Rahman"
            let msg = (typeof threadData.customJoin == "undefined") ?
`‎╭━━━━━━ ⬣ ⚝ ⬣ ━━━━━━╮
 🌸 𝑾𝒆𝒍𝒄𝒐𝒎𝒆, 🌟 Ashikur Rahman 🌸
 ╰━━━━━━ ⬣ ⚝ ⬣ ━━━━━━╯

🚪 𝗝𝗼𝗶𝗻𝗲𝗱 𝗧𝗵𝗲: 『 ${threadName} 』
🧭 𝗧𝗶𝗺𝗲 𝗼𝗳 𝗗𝗮𝘆: ${new Date().toLocaleTimeString()} 🌌
🎭 𝗔𝗱𝗱𝗲𝗱 𝗕𝘆: ${event.senderName}

📖 𝗥𝘂𝗹𝗲𝘀 𝗠𝗮𝘁𝘁𝗲𝗿 — 𝗥𝗲𝘀𝗽𝗲𝗰𝘁 𝗘𝘃𝗲𝗿𝘆𝗼𝗻𝗲 🛡️
🧃 𝗨𝘀𝗲 『 ${global.config.PREFIX}help 』 𝘁𝗼 𝘀𝗲𝗲 𝗯𝗼𝘁 𝗰𝗼𝗺𝗺𝗮𝗻𝗱𝘀!

✨ 𝗛𝗮𝘃𝗲 𝗔 𝗠𝗮𝗴𝗶𝗰𝗮𝗹 𝗝𝗼𝘂𝗿𝗻𝗲𝘆! 🌠` 
: threadData.customJoin;

            msg = msg.replace(/\{name}/g, nameArray.join(', '))
                     .replace(/\{threadName}/g, threadName);

            if (existsSync(path)) mkdirSync(path, { recursive: true });

            const randomPath = readdirSync(join(__dirname, "cache", "joinGif", "randomgif"));
            let formPush;

            if (existsSync(pathGif)) formPush = { body: msg, attachment: createReadStream(pathGif), mentions }
            else if (randomPath.length != 0) {
                const pathRandom = join(__dirname, "cache", "joinGif", "randomgif", `${randomPath[Math.floor(Math.random() * randomPath.length)]}`);
                formPush = { body: msg, attachment: createReadStream(pathRandom), mentions }
            }
            else formPush = { body: msg, mentions }

            return api.sendMessage(formPush, threadID);
        } catch (e) { 
            return console.log(e);
        }
    }
                                 }
