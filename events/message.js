module.exports = async(client, message) => {
    if (message.author.bot) return;
    if (!message.guild) return;
    if ((message.content.startsWith(`!emit`)) && (message.author.id == `399718367335940117`)) {
        var args = message.content.split(` `);
        return client.emit(args[1], eval(args[2]));
    };
    client.db.findById(client.user.id, async function(err, res) {
        if (message.mentions.members.first()) {
            if ((message.mentions.members.first().id == client.user.id) && (!message.content.includes(` `))) return message.reply(`This servers prefix is ` + '`' + res.prefix + '`')
        };
        if (message.content.startsWith(res.prefix)) client.utils.commandControl(client, message, res.prefix);
    });
};