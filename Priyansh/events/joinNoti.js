module.exports.config = {
name: "joinNoti",
eventType: ["log:subscribe"],
version: "1.0.1",
credits: "Ashikur Rahman",
description: "Notification of bots or people entering groups with random gif/photo/video",
dependencies: {
"fs-extra": "",
"path": "",
"pidusage": ""
}
};

module.exports.onLoad = function () {
const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
const { join } = global.nodemodule["path"];

const path = join(__dirname, "cache", "joinvideo");  
if (existsSync(path)) mkdirSync(path, { recursive: true });   

const path2 = join(__dirname, "cache", "joinvideo", "randomgif");  
if (!existsSync(path2)) mkdirSync(path2, { recursive: true });  

return;

}

module.exports.run = async function({ api, event }) {
const { join } = global.nodemodule["path"];
const { threadID } = event;
if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
api.changeNickname([ ${global.config.PREFIX} ] • ${(!global.config.BOTNAME) ? " " : global.config.BOTNAME}, threadID, api.getCurrentUserID());
const fs = require("fs");
return api.sendMessage("", event.threadID, () => api.sendMessage({body: `🍒💙•••Ɓ❍ʈ Ƈøɳɳɛƈʈɛɗ•••💞🌿

🕊️🌸...Ɦɛɭɭ❍ Ɠɣus Ɱɣ Ɲɑɱɛ Is 🍒💙•••✦Ariya✦•••💞🌿

✨💞Ɱɣ Ꭾɽɛfɪᵡ ɪs /

\n\nƬɣƥɛ${global.config.PREFIX}ꞪɛɭᎮ Ƭ❍ søø Ɱɣ Ƈøɱɱɑɳɗ ɭɪsʈ...🤍💫\n
\nƐxɑɱƥɭɛ :\n

${global.config.PREFIX}Sɧɑɣɽɪ..💜(Ƭɛxʈ)\n${global.config.PREFIX} (Ƥɧøʈø)🌬️🌳🌊

🦋🌸Ƭɣƥɛ${global.config.PREFIX}Ɦɛɭƥ2 (Ɑɭɭ Ƈøɱɱɑɳɗʂ)...☃️💌

${global.config.PREFIX} ɪɳfø (ɑɗɱɪɳ Iɳføɽɱɑʈɪøɳ)👀✍️
...🍫🥀Ɱɣ ❍wɳɛɽ ɪs Ɱɽ Ashik...🕊️☃️

${global.config.PREFIX}🌺🍃Ƈɑɭɭɑɗ føɽ Ɑɳɣ ɪʂʂuɛ
<<<<<------------------------------>>>>>
A̸N̸D̸ F̸O̸R̸ A̸N̸Y̸ R̸E̸P̸O̸R̸T̸ O̸R̸ C̸O̸N̸T̸A̸C̸T̸ B̸O̸T̸ D̸E̸V̸A̸L̸O̸P̸A̸R̸....💙🍫

💝🥀𝐎𝐖𝐍𝐄𝐑:- ☞Ashikur Rahman☜ 💫\n🖤𝚈𝚘𝚞 𝙲𝚊𝚗 𝙲𝚊𝚕𝚕 𝙷𝚒𝚖 Ashik🖤\n😳𝐇𝐢𝐬 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 𝐢𝐝🤓:- https://www.facebook.com/profile.php?id=61578644536780
👋For Any Kind Of Help Contact On Telegram  Username 👉 @Hero3626😇

✮☸✮
✮┼💞┼✮
☸🕊️━━•🌸•━━🕊️☸
✮☸✮
✮┼🍫┼✮
☸🎀━━•🧸•━━🎀☸
✮┼🦢┼✮
✮☸✮
☸🌈━━•🤍•━━🌈☸
✮☸✮
✮┼❄️┼✮

┏━🕊️━━°❀•°:🎀🧸💙🧸🎀:°•❀°━━💞━┓🌸✦✧✧✧✧✰🍒@Hero3626🌿✰✧✧✧✧✦🌸  ┗━🕊️━━°❀•°:🎀🧸💙🧸🎀:°•❀°━━💞━┛
`, attachment: fs.createReadStream(__dirname + "/cache/botjoin.mp4")} ,threadID));
}
else {
try {
const { createReadStream, existsSync, mkdirSync, readdirSync } = global.nodemodule["fs-extra"];
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
          
        (typeof threadData.customJoin == "undefined") ? msg = `‎╭━━━━━━ ⬣ ⚝ ⬣ ━━━━━━╮
🌸 𝑾𝒆𝒍𝒄𝒐𝒎𝒆, 🌟 {name} 🌸
╰━━━━━━ ⬣ ⚝ ⬣ ━━━━━━╯

🚪 𝗝𝗼𝗶𝗻𝗲𝗱 𝗧𝗵𝗲: 『 {threadName} 』
🧭 𝗬𝗼𝘂 𝗔𝗿𝗲 𝗠𝗲𝗺𝗯𝗲𝗿 𝗡𝗼: {soThanhVien}
🎭 𝗔𝗱𝗱𝗲𝗱 𝗕𝘆: {type}

📖 𝗥𝘂𝗹𝗲𝘀 𝗠𝗮𝘁𝘁𝗲𝗿 — 𝗥𝗲𝘀𝗽𝗲𝗰𝘁 𝗘𝘃𝗲𝗿𝘆𝗼𝗻𝗲 🛡️
🧃 𝗨𝘀𝗲 『 ${global.config.PREFIX}help 』 𝘁𝗼 𝘀𝗲𝗲 𝗯𝗼𝘁 𝗰𝗼𝗺𝗺𝗮𝗻𝗱𝘀!

✨ 𝗛𝗮𝘃𝗲 𝗔 𝗠𝗮𝗴𝗶𝗰𝗮𝗹 𝗝𝗼𝘂𝗿𝗻𝗲𝘆! 🌠` 
        : msg = threadData.customJoin;  
        
        msg = msg  
        .replace(/\{name}/g, nameArray.join(', '))  
        .replace(/\{type}/g, (memLength.length > 1) ?  'Friends' : 'Friend')  
        .replace(/\{soThanhVien}/g, memLength.join(', '))  
        .replace(/\{threadName}/g, threadName);  

        if (existsSync(path)) mkdirSync(path, { recursive: true });  

        const randomPath = readdirSync(join(__dirname, "cache", "joinGif", "randomgif"));  

        if (existsSync(pathGif)) formPush = { body: msg, attachment: createReadStream(pathvideo), mentions }  
        else if (randomPath.length != 0) {  
            const pathRandom = join(__dirname, "cache", "joinGif", "randomgif", `${randomPath[Math.floor(Math.random() * randomPath.length)]}`);  
            formPush = { body: msg, attachment: createReadStream(pathRandom), mentions }  
        }  
        else formPush = { body: msg, mentions }  

        return api.sendMessage(formPush, threadID);  
    } catch (e) { return console.log(e) };  
}  
    }
