exports.run = async(client, message, args) => {
    client.utils.permissionCheck(message, `MANAGE_GUILD`).then(async(bool) => {
        if (bool == false) return;
        let channel = await client.utils.findChannel(message, args);
        if (!channel) return client.utils.missing(message, `CHANNEL`);
        client.db.findByIdAndUpdate(client.user.id, {
            voiceChannelLogs: `${channel.id}`
        }).then(() => {
            message.reply(`Voice Channel logs was set to ${channel}.`)
        });
    });
}, exports.info = {
    name: "voicelogs",
    permission: `MANAGE_GUILD`,
    description: `Set the voice channel logs of the server.`,
    arguments: '<prefix>voicelogs [channel]'
};