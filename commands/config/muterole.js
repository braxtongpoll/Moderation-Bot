const { MessageEmbed } = require(`discord.js`);
exports.run = async(client, message, args) => {
    client.utils.permissionCheck(message, `MANAGE_GUILD`).then(async(bool) => {
        if (bool == false) return;
        let role;
        if (message.mentions.roles.first()) {
            role = message.mentions.roles.first();
        } else {
            role = message.guild.roles.cache.find(r => r.id === args[0]);
        }
        if (!role) return client.utils.missing(message, `ROLE`);
        client.db.findByIdAndUpdate(client.user.id, {
            muteRole: `${role.id}`
        }).then(() => {
            message.reply(`Mute role was set to **${role.name}**.`)
        });
    });
}, exports.info = {
    name: "muterole",
    permission: `MANAGE_GUILD`,
    description: `Set the mute role for the server.`,
    arguments: '<prefix>muterole [role]'
};