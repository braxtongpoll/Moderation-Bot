const { MessageEmbed, MessageAttachment } = require(`discord.js`);
module.exports = async(client, message) => {
    if (!message.guild) return;
    if (message.author == null) return;
    if (message.author.bot) return;
    client.db.findById(client.user.id, function(err, res) {
        if (message.content.startsWith(res.prefix)) return;
        let logs = message.guild.channels.cache.find(c => c.id === res.discordLogs);
        if (!logs) return;
        let date = new Date();
        date = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        let embed = new MessageEmbed()
            .setFooter(message.guild.name + " | Date: " + date, message.guild.iconURL())
            .setColor(res.embedColor)
            .setAuthor(`Message Delete`, message.author.displayAvatarURL({ format: `png`, dynamic: true, size: 1024 }))
            .setDescription(message.content)
            .addFields({
                name: `Channel`,
                value: `${message.channel}`,
                inline: true
            }, {
                name: `Author`,
                value: `${message.author}`,
                inline: true
            });
        let image;
        try { image = new MessageAttachment(message.attachments.array()[0].proxyURL) } catch (e) {};
        try { embed.setImage(image.attachment) } catch (e) {};
        logs.send(embed).catch(e => { return client.logger.log(`Failed to post in ${client.utils.chalk("green", logs.name)}`, "error") });
    });
};