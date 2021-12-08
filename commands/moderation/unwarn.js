const { MessageEmbed } = require(`discord.js`);
exports.run = async(client, message, args) => {
    client.utils.permissionCheck(message, `KICK_MEMBERS`).then(bool => {
        if (bool == false) return;
        message.delete();
        client.db.findById(client.user.id, async(err, res) => {
            if (!res.cases[args[0]]) return client.utils.missing(message, "VALID CASE NUMBER");
            if (res.cases[args[0]].type !== "warn") return client.utils.missing(message, "VALID WARN CASE NUMBER");
            if (res.cases[args[0]].active == false) return client.sendTemp(message, "That warning was already removed.");
            let user = await client.users.fetch(res.cases[args[0]].victim) || res.cases[args[0]].victim;
            let reason = args.slice(1).join(` `) || `No reason supplied.`;
            let string1 = `${user.username} (${user.id})` || user;
            let string2 = user.displayAvatarURL({ format: "png", dynamic: true, size: 1024 }) || client.user.displayAvatarURL({ format: "png", dynamic: true, size: 1024 });
            let embed = new MessageEmbed()
                .setFooter(message.guild.name, message.guild.iconURL())
                .setColor(res.embedColor)
                .setAuthor(`Warning Removed | Case #${res.caseNumber}`, string2)
                .setDescription(`**• Victim**: ${string1}\n**• Moderator**: ${message.author.username} (${message.author.id})\n**• Reason**: ${reason}`)
            let modLogs = message.guild.channels.cache.find(c => c.id === res.modLogs);
            let total = 0;
            res.cases[args[0]].active = false;
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
                        victim: user.id || user,
                        moderator: message.author.id,
                        reason: reason,
                        time: new Date().getTime(),
                        type: `unwarn`
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
    name: "unwarn",
    permission: `KICK_MEMBERS`,
    description: `Unwarn a member.`,
    arguments: '<prefix>unwarn [case_number] [reason]'
}