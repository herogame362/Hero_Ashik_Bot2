const fs = require("fs");
module.exports.config = {
name: "owner",
version: "1.0.1",
hasPermssion: 0,
credits: "Ashikur Rahman",
description: "hihihihi",
commandCategory: "no prefix",
usages: "admin",
cooldowns: 5,
};

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
var { threadID, messageID } = event;
if (event.body.indexOf("ADMIN")==0 || event.body.indexOf("Admin")==0 || event.body.indexOf("/Admin")==0 || event.body.indexOf("#admin")==0) {
var msg = {
body: "🫅 𝐎𝐖𝐍𝐄𝐑 𝐏𝐑𝐎𝐅𝐈𝐋𝐄 🫅",
attachment:
fs.createReadStream(https://i.postimg.cc/cCnLXxmt/front.png)
}
api.sendMessage(msg, threadID, messageID);
api.setMessageReaction("🫅", event.messageID, (err) => {}, true)
}
}
module.exports.run = function({ api, event, client, __GLOBAL }) {

}const fs = require("fs");
module.exports.config = {
name: "owner",
version: "1.0.1",
hasPermssion: 0,
credits: "Ashikur Rahman",
description: "hihihihi",
commandCategory: "no prefix",
usages: "admin",
cooldowns: 5,
};

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
var { threadID, messageID } = event;
if (event.body.indexOf("ADMIN")==0 || event.body.indexOf("Admin")==0 || event.body.indexOf("/Admin")==0 || event.body.indexOf("#admin")==0) {
var msg = {
body: "🫅 𝐎𝐖𝐍𝐄𝐑 𝐏𝐑𝐎𝐅𝐈𝐋𝐄 🫅",
attachment:
fs.createReadStream(https://i.postimg.cc/cCnLXxmt/front.png)
}
api.sendMessage(msg, threadID, messageID);
api.setMessageReaction("🫅", event.messageID, (err) => {}, true)
}
}
module.exports.run = function({ api, event, client, __GLOBAL }) {

}
