const { MessageEmbed } = require(`discord.js`);
const { prompt } = require(`../src/utils/start.js`)
module.exports = async function(client) {
    await client.botStart();
    prompt(client);
    setInterval(() => {
        client.db.findById(client.user.id, function(err, res) {
            let modLogs = client.channels.cache.find(c => c.id === res.modLogs);
            if (!modLogs) return;
            let muteRole = modLogs.guild.roles.cache.find(r => r.id === res.muteRole);
            if (res.muteCases) {
                Object.keys(res.muteCases).forEach(user => {
                    if (res.muteCases[user] == null) return;
                    let member = modLogs.guild.members.cache.find(m => m.id === user);
                    if (!member) {
                        res.muteCases[user] = undefined;
                    } else {
                        res.muteCases[user] = res.muteCases[user] - 10000;
                    };
                    if (res.muteCases[user] <= 10000) {
                        res.muteCases[user] = undefined;
                        if (muteRole) member.roles.remove(muteRole).catch(() => {});
                        if (member.voice.channel && member.voice.mute == true) member.voice.setMute(false, "Unmuted by: " + client.user.tag);
                        let embed = new MessageEmbed()
                            .setFooter(modLogs.guild.name, modLogs.guild.iconURL())
                            .setColor(res.embedColor)
                            .setAuthor(`Unmute | Case #${res.caseNumber}`, client.user.displayAvatarURL({ format: `png`, dynamic: true, size: 1024 }))
                            .setDescription(`**• Victim**: ${member.user.username} (${member.id})\n**• Moderator**: ${client.user.username} (${client.user.id})\n**• Reason**: Duration complete.`)
                        if (modLogs) modLogs.send(embed).catch(() => {});
                        client.db.findByIdAndUpdate(client.user.id, {
                            muteCases: res.muteCases,
                            caseNumber: res.caseNumber + 1
                        }).then(() => {});
                    };
                });
            };
        });
    }, 10000);
};