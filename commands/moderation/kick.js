const { MessageEmbed } = require(`discord.js`);
exports.run = async(client, message, args) => {
    client.utils.permissionCheck(message, `KICK_MEMBERS`).then(bool => {
        if (bool == false) return;
        let member;
        if (message.mentions.members.first()) {
            member = message.mentions.members.first();
        } else {
            member = message.guild.members.cache.find(m => m.id === args[0]);
        };
        if (!member) return client.utils.missing(message, `MEMBER`);
        if (member.roles.highest.position > message.member.roles.highest.position) return message.reply(`You cannot kick a member with a higher ranking role than you.`).then(a => a.delete({ timeout: 15000 }));
        let reason = args.slice(1).join(` `) || `No reason supplied.`;
        if (member.id == message.author.id) return message.reply(`Why are you trying to kick yourself?`);
        message.delete();
        client.db.findById(client.user.id, async(err, res) => {
            let embed = new MessageEmbed()
                .setFooter(message.guild.name, message.guild.iconURL())
                .setColor(res.embedColor)
                .setAuthor(`Kick | Case #${res.caseNumber}`, message.author.displayAvatarURL({ format: `png`, dynamic: true, size: 1024 }))
                .setDescription(`**• Victim**: ${member.user.username} (${member.id})\n**• Moderator**: ${message.author.username} (${message.author.id})\n**• Reason**: ${reason}`)
            let modLogs = message.guild.channels.cache.find(c => c.id === res.modLogs);
            member.kick(reason);
            message.channel.send(`Member kicked.`);
            if (modLogs) {
                modLogs.send(embed).then(msg => {
                    res.cases[res.caseNumber] = {
                        message: msg.id,
                        channel: msg.channel.id,
                        victim: member.id,
                        moderator: message.author.id,
                        reason: reason,
                        time: new Date().getTime(),
                        type: `kick`
                    };
                    client.db.findByIdAndUpdate(client.user.id, {
                        caseNumber: res.caseNumber + 1,
                        cases: res.cases
                    }).then(() => {});
                })
            }
        });
    })
}, exports.info = {
    name: "kick",
    permission: `KICK_MEMBERS`,
    description: `Kick a user from the server.`,
    arguments: '<prefix>kick [member] [reason]'
}