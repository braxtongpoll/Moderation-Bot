const { MessageEmbed } = require("discord.js");
module.exports = async function(client, member) {
    if (!member.guild) return;
    client.db.findById(client.user.id, function(err, res) {
        let logs = member.guild.channels.cache.find(c => c.id === res.welcomeLogs);
        if (!logs) return;
        var date = member.user.createdAt;
        var joinTime = member.user.createdTimestamp
        var today = new Date().getTime();
        var days = ((today - joinTime) / 86400000).toString().split(`.`)[0]
        var monthArray = [`January`, `February`, `March`, `April`, `May`, `June`, `July`, `August`, `September`, `October`, `November`, `December`];
        var cDate = `${monthArray[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
        let embed = new MessageEmbed()
            .setFooter(member.guild.name, member.guild.iconURL())
            .setColor(client.config.color)
            .setThumbnail(member.user.displayAvatarURL({ format: "png", dynamic: true, size: 1024 }))
            .setAuthor(member.user.username + " has joined the server", member.user.displayAvatarURL({ format: "png", dynamic: true, size: 1024 }))
            .addFields({
                name: "User",
                value: `${member} | ${member.user.tag} | ${member.id}`
            }, {
                name: "Information",
                value: `Created ` + cDate + ` (${days} days ago)` + '\n' + `Member: ${member.guild.memberCount}`
            })
        logs.send(embed).catch(error => {
            client.logger.log("There was an error posting to the channel for guild member joins. Possibly missing permissions to post to this channel.", "error");
        });
    });
};