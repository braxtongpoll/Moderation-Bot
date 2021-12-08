const chalk = require('chalk');
const { MessageEmbed } = require('discord.js');

function colorize(color, content) {
    switch (color) {
        case "red":
            return chalk.red(content)
        case "green":
            return chalk.green(content)
        case "yellow":
            return chalk.yellow(content)
        case "blue":
            return chalk.blue(content)
        case "cyan":
            return chalk.cyan(content)
        default:
            return chalk.green(content);
    };
};

function permissionCheck(message, permission) {
    var bool = false;
    if (message.member.hasPermission(permission)) bool = true;
    if (bool == false) {
        var embed = new MessageEmbed()
            .setFooter(message.guild.name, message.guild.iconURL())
            .setDescription(`You're missing the permission ` + '`' + permission + '`' + ` to run this command.`)
        message.reply(embed);
    }
    return new Promise(async(resolve, reject) => {
        try {
            resolve(bool);
        } catch (e) {
            reject(new Error(e));
        };
    });
};

async function awaitReply(client, message, text, limit = 60000, mention = false, useDM = false) {
    const filter = m => m.author.id === message.author.id;
    try {
        const collected = await message.channel.awaitMessages(filter, { max: 1, time: limit, errors: ["time"] });
        if (mention == true) {
            return collected.first().mentions;
        }
        return collected.first().content;
    } catch (e) {
        return undefined;
    }
};

function findChannel(message, args) {
    let channel;
    if (message.mentions.channels.first()) return message.mentions.channels.first();
    channel = message.guild.channels.cache.find(c => c.id === args[0]);
    if (channel) return channel;
    return undefined;
};

function findRole(message, args) {
    let role;
    if (message.mentions.roles.first()) return message.mentions.roles.first();
    role = message.guild.roles.cache.find(c => c.id === args[0]);
    if (role) return role;
    return undefined;
};

function missing(message, args) {
    let embed = new MessageEmbed()
        .setFooter(message.guild.name, message.guild.iconURL())
        .setDescription(`Your arguments are missing ` + '`' + args + '`' + ` to execute.`)
    message.reply(embed);
};

function commandControl(client, message, prefix) {
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    var command = args.shift().toLowerCase()
    const cmd = client.commands.get(command);
    if (cmd) {
        try {
            cmd.run(client, message, args)
        } catch (e) {
            return console.log(error, `[NON-FATAL]: ${e}`)
        };
    };
};

function status(client) {
    let displayMessage = client.config.presence.name;
    if (displayMessage.includes("{members}")) {
        let members = 0;
        client.guilds.cache.forEach(g => {
            members += g.memberCount;
        });
        displayMessage = displayMessage.replace("{members}", members);
    };
    if (displayMessage.includes("{roles}")) {
        let roles = 0;
        client.guilds.cache.forEach(g => {
            roles += g.roles.cache.size;
        });
        displayMessage = displayMessage.replace("{roles}", roles);
    }
    if (displayMessage.includes("{ROLE")) {
        let roleID = displayMessage.split("{ROLE:")[1].split(" ")[0].replace("}", "");
        let roleCount = 0;
        client.guilds.cache.forEach(g => {
            let role = g.roles.cache.find(r => r.id === roleID);
            if (role) {
                g.members.cache.forEach(member => {
                    if (member.roles.cache.has(role.id)) roleCount++;
                });
            };
        });
        displayMessage = displayMessage.replace(`{ROLE:${roleID}}`, roleCount);
    }
    client.user.setPresence({ activity: { type: client.config.presence.type, name: displayMessage }, status: client.config.presence.status.toUpperCase() });
}
exports.status = status;
exports.commandControl = commandControl;
exports.findRole = findRole;
exports.missing = missing;
exports.findChannel = findChannel;
exports.awaitReply = awaitReply;
exports.permissionCheck = permissionCheck;
exports.colorize = colorize;