const carden = require(`carden`);
const chalk = require('chalk');
const figlet = require(`figlet`);
const { readdir } = require('fs');
const { join } = require('path');


module.exports = {
    async prompt(client) {
        var djsVer = require(`discord.js`).version;
        var operating;
        client.db.findById(client.user.id, async function(err, res) {

            if (process.platform == "aix") operating = "IBM AIX";
            if (process.platform == "darwin") operating = "Apple Darwin";
            if (process.platform == "freebsd") operating = "FreeBSD";
            if (process.platform == "linux") operating = "Linux/Linux Distro";
            if (process.platform == "openbsd") operating = "OpenBSD";
            if (process.platform == "sunos") operating = "SunOS";
            if (process.platform == "win32") operating = "Windows";
            else operating = "Unknown";
            var db_name = await client.config.database.split(`.net/`)[1];

            var totalEvents;

            readdir(join(__dirname, "../", "../", "events/"), (err, files) => {
                totalEvents = files.length;
            })
            let aliases = 0;
            await Object.keys(client.config.aliases).forEach(cmd => {
                aliases += client.config.aliases[cmd].length;
            });
            let string1 = "Xe";
            let string2 = "n  ";
            let string3 = "  Mode";
            let string4 = "ration";
            let botVersion = require("../../package-lock.json").version;
            figlet.text(string1 + string2 + string3 + string4, { width: '500' }, async function(err, art) {
                if (err) return;
                var box = carden(art, chalk.black(`Logged in as ${client.user.tag} (${chalk.green(client.user.id)})\n\nPrefix: ${res.prefix}\nCommands: ${chalk.red(client.commands.size)}\nAliases: ${chalk.red(global.aliases)}\nEvents: ${chalk.red(totalEvents)}\nPurchased from ${chalk.blue("Xen Development")}\n\nOperating System: ${operating}\nProcess PID: ${process.pid}\nDiscord.js Version: ${djsVer}\nNode Version: ${process.version}\nXen Moderation: v${botVersion}\nDatabase: ${chalk.green(db_name)}`), { borderColor: "#191fe0", borderStyle: "bold", padding: 1, backgroundColor: "black", header: { backgroundColor: "#191fe0" }, content: { backgroundColor: "white" } });

                return console.log(box);
            });
        });
    }
};