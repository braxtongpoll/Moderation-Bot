const { MessageEmbed } = require(`discord.js`);
exports.run = async(client, message, args) => {
    client.utils.permissionCheck(message, `MANAGE_GUILD`).then(async(bool) => {
        if (bool == false) return;
        if (!args[0]) return client.utils.missing(message, `PREFIX`);
        client.db.findByIdAndUpdate(client.user.id, {
            prefix: args[0]
        }).then(() => {
            message.reply(`The prefix was set to ${args[0]}`);
        });
    });
}, exports.info = {
    name: "prefix",
    permission: `MANAGE_GUILD`,
    description: `Set the prefix of the server.`,
    arguments: '<prefix>modlogs [channel]'
};