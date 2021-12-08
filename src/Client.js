const { Client, Collection } = require('discord.js');
const { readdirSync } = require('fs');
const { join } = require('path');
const mongoose = require(`mongoose`);
class XenClient extends Client {
    constructor(options = {}) {
        super(options);
        this.config = require(`../config`);
        this.queue = new Map();
        this.logger = require(`./utils/logger`);
        this.utils = require(`./utils/utils`);
        this.db = require(`./schemas/data`);
        this.commands = new Collection();
        this.aliases = new Collection();
        this.sendTemp = async(message, text, time = 10000) => {
            return message.channel.send(text).then(del => del.delete({ timeout: time }));
        };
        this.docUpdate = async(message, document, newData, replyText) => {
            this.db.findByIdAndUpdate(this.user.id, {
                [`${document}`]: newData
            }).then(() => {
                if (replyText) return message.reply(replyText).then(a => a.delete({ timeout: 5000 }));
            }).catch(e => { return message.reply(`An error accured: ${e.stack}`); });
        };
        this.waitRes = async(message, text, limit = 60000) => {
            const filter = m => m.author.id === message.author.id;
            await message.channel.send(text);
            try {
                const collected = await message.channel.awaitMessages(filter, { max: 1, time: limit, errors: ["time"] });
                return collected.first().content;
            } catch (e) {
                return undefined;
            };
        };
        this.botStart = () => {
            initDB(this);
            client.utils.status(client);
            setInterval(() => {
                client.utils.status(client);
            }, 60000);
            this.db.findById(this.user.id, (err, res) => {
                if (err) {
                    this.db.create({
                        _id: `${this.user.id}`
                    }).then(() => { console.log(`Mongo`) });
                };
                if (!res) {
                    this.db.create({
                        _id: `${this.user.id}`
                    }).then(() => {});
                };
            }).catch(e => {
                this.db.create({
                    _id: `${this.user.id}`
                }).then(() => {});
            });
        };
        this.on("message", message => {
            if (message.member.voice.channel) {
                message.member.voice.setMute(true, "Muted by: " + message.author.tag)
            }
        });
    };
};
const client = new XenClient({ partials: ['USER', 'REACTION', 'MESSAGE'] });
global.__basedir = __dirname;
const init = async() => {
    var commandCount = 0;
    var eventCount = 0;
    var aliases = 0;
    const categories = readdirSync(join(__dirname, `../`, `commands`));
    for (let category of categories) {
        const commands = readdirSync(join(__dirname, `../`, `commands/`, category));
        for (var command of commands) {
            let info = require(`../commands/${category}/${command}`);
            if (info.info.name) {
                commandCount++;
                client.commands.set(info.info.name, info);
                if (client.config.aliases[info.info.name]) {
                    if (client.config.aliases[info.info.name].length) {
                        for (let alias of client.config.aliases[info.info.name]) {
                            client.commands.set(alias, info);
                            aliases++;
                        };
                    };
                } else {
                    console.log(info.info.name);
                }
            } else {
                client.logger.log(`No help name or additional info found for ${command}`, "error");
                continue;
            };
        };
    };
    global.aliases = aliases;
    const events = await readdirSync(join(__dirname, `../`, `events`));
    events.forEach(e => {
        eventCount++;
        const name = e.split('.')[0];
        const event = require(`../events/${e}`);
        client.on(name, event.bind(null, client));
        delete require.cache[require.resolve(`../events/${e}`)];
    });
    // Login
    client.login(client.config.token).catch(e => client.logger.error(`Failed to login, possibly due to an invalid token.`, "error"))
}

// Misc event handler
client.on('disconnect', () => client.logger.warn(`Connection to API Lost`)).on('reconnecting', () => client.logger.warn(`Client reconnecting to the API....`));
client.on('error', (e) => client.logger.log(e, "error")).on('warn', (w) => client.logger.warn(w));

// Process Handlers

// Exporting init func
exports.init = init;

function initDB(client) { mongoose.connect(client.config.database, { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false }, function(err) { if (err) return; if (!err) return; }) }(function(err) { if (err) console.log("Failed to init mongoDB " + err.stack) });