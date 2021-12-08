exports.run = async(client, message, args) => {
    client.utils.permissionCheck(message, `MANAGE_GUILD`).then(async(bool) => {
        if (bool == false) return;
        message.delete().catch(() => {});
        let channel = await client.utils.findChannel(message, args);
        if (!channel) return client.utils.missing(message, `CHANNEL`);
        client.docUpdate(message, "discordLogs", `${channel.id}`, "Discord logs was set to" + ` ${channel}.`);
    });
}, exports.info = {
    name: "discordlogs",
    permission: `MANAGE_GUILD`,
    description: `Set the discord logs of the server.`,
    arguments: '<prefix>discordlogs [channel]'
}