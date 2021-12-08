exports.run = async(client, message, args) => {
    client.utils.permissionCheck(message, `MANAGE_GUILD`).then(async(bool) => {
        if (bool == false) return;
        let channel = await client.utils.findChannel(message, args);
        if (!channel) return client.utils.missing(message, `CHANNEL`);
        client.db.findByIdAndUpdate(client.user.id, {
            modLogs: `${channel.id}`
        }).then(() => {
            message.reply(`Moderation logs was set to ${channel}.`)
        });
    });
}, exports.info = {
    name: "modlogs",
    permission: `MANAGE_GUILD`,
    description: `Set the moderation logs of the server.`,
    arguments: '<prefix>modlogs [channel]'
};