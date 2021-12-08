const { MessageEmbed } = require(`discord.js`);
exports.run = async(client, message, args) => {
    client.utils.permissionCheck(message, `MANAGE_GUILD`).then(async(bool) => {
        if (bool == false) return;
        let channel = await client.utils.findChannel(message, args);
        if (!channel) return client.utils.missing(message, `CHANNEL`);
        client.db.findByIdAndUpdate(client.user.id, {
            welcomeLogs: `${channel.id}`
        }).then(() => {
            message.reply(`The welcome logs channel was set to ${channel}.`)
        });
    });
}, exports.info = {
    name: "welcomelogs",
    permission: `MANAGE_GUILD`,
    description: `Set the channel to logs join/leaves.`,
    arguments: '<prefix>welcomelogs [channel]'
};