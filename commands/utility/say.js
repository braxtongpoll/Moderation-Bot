const { MessageAttachment } = require("discord.js");
exports.run = async(client, message, args) => {
    client.utils.permissionCheck(message, "ADMINISTRATOR").then(bool => {
        if (bool == false) return;
        if (!args) return client.utils.missing(message, "CONTENT");
        args = args.join(" ").split(" || ");
        message.delete().catch(() => {});
        if (args[1]) {
            let attachement = new MessageAttachment(args[1]);
            message.channel.send(args[0], attachement);
        } else {
            message.channel.send(args[0]);
        };
    });
}, exports.info = {
    name: "say",
    permission: `ADMINISTRATOR`,
    description: `Have the bot say something.`,
    arguments: '<prefix>say [content] || [file_link]'
}