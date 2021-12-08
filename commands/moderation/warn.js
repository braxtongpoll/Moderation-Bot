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
        if (member.roles.highest.position > message.member.roles.highest.position) return message.reply(`You cannot warn a member with a higher ranking role than you.`).then(a => a.delete({ timeout: 15000 }));
        let reason = args.slice(1).join(` `) || `No reason supplied.`;
        if (member.id == message.author.id) return message.reply(`Why are you trying to warn yourself?`);
        message.delete();
        client.db.findById(client.user.id, async(err, res) => {
            let embed = new MessageEmbed()
                .setFooter(message.guild.name, message.guild.iconURL())
                .setColor(res.embedColor)
                .setAuthor(`Warning | Case #${res.caseNumber}`, message.author.displayAvatarURL({ format: `png`, dynamic: true, size: 1024 }))
                .setDescription(`**• Victim**: ${member.user.username} (${member.id})\n**• Moderator**: ${message.author.username} (${message.author.id})\n**• Reason**: ${reason}`)
            let modLogs = message.guild.channels.cache.find(c => c.id === res.modLogs);
            let total = 1;
            await Object.keys(res.cases).forEach((c) => {
                if (res.cases[c].type == "warn" && res.cases[c].active == true) {
                    total += 1;
                };
            })
            message.channel.send(`Member Warned. They now have ${total} warnings.`);
            if (modLogs) {
                modLogs.send(embed).then(msg => {
                    res.cases[res.caseNumber] = {
                        message: msg.id,
                        channel: msg.channel.id,
                        victim: member.id,
                        moderator: message.author.id,
                        reason: reason,
                        active: true,
                        time: new Date().getTime(),
                        type: `warn`
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
    name: "warn",
    permission: `KICK_MEMBERS`,
    description: `Warn a member.`,
    arguments: '<prefix>warn [member] [reason]'
}