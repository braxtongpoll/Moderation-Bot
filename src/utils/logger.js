const chalk = require('chalk');
const { join } = require('path');
const { appendFileSync } = require('fs');
const moment = require('moment');
class Logger {
    static log(content, type = "log", path = global.__basedir) {
            const time = `[${moment().format("MM-DD-YYYY HH:mm")}]`;
            var action = content.toString().split('\n')[0];
            if (content.toString().includes("Missing Permissions")) {
                return console.log(`${time} ${chalk.bgMagenta("PERMISSIONS")} ${action}\nMissing permissions to execute.`)
            }
            if (content.toString().includes("Cannot send messages to this user")) return Logger.log(`${action}\nI cannot DM the user.`, "perms");

            switch (type) {
                case "log":
                    {
                        invokeLogFile("log", path, content);
                        return console.log(`${time} ${chalk.bgBlue(type.toUpperCase())} ${content}`)
                    }
                case "warn":
                    {
                        return console.log(`${time} ${chalk.bgYellow(type.toUpperCase())} ${content}`)
                    }
                case "error":
                    {
                        invokeLogFile("error", path, content);
                        return console.log(`${time} ${chalk.bgRed(type.toUpperCase())} ${content}`)
                    }
                case "debug":
                    {
                        return console.log(`${time} ${chalk.green(type.toUpperCase())} ${content}`)
                    }
                case "ready":
                    {
                        return console.log(`${time} ${chalk.bgGreen(type.toUpperCase())} ${content}`)
                    }
                case "sucess":
                    {
                        return console.log(`${time} ${chalk.bgGreen(type.toUpperCase())} ${content}`)
                    }
                case "perms":
                    {
                        return console.log(`${time} ${chalk.bgMagenta(type.toUpperCase())} ${content}`)
                    }
                case "node-exception":
                    invokeLogFile("error", path, content);
                    return console.log(`${time} ${chalk.bgRedBright(type.toUpperCase())} An uncaughtException was captured, check logs/error.log`);
                case "node-rejection":
                    invokeLogFile("error", path, content)
                    return console.log(`${time} ${chalk.bgRedBright(type.toUpperCase())} An unhandledRejection was captured, check logs/error.log`);
                case "xen":
                    {
                        return console.log(`${time} ${chalk.bgCyan(`${chalk.black('XEN')}`)} ${content}`)
            }
            default:
                throw new TypeError(`Logger type must be specified [log, warn, error, debug, ready, success]`)
        }
    }
    static error(content) {
        return this.log(content, "error")
    }
    static warn(content) {
        return this.log(content, "warn")
    }
}

async function invokeLogFile(type, path = null, message) {
    const time = moment().format("MM-DD-YYYY HH:mm:ss");
    const logObj = {
        "path": path,
        "type": type,
        "message": message,
        "time": time
    }
    switch(type) {
        case "error": 
        {
            return appendFileSync(join(__dirname, `../`, `../`, `logs/`, `error.log`), JSON.stringify(logObj) + "\n\n", (e) => {
                if (e) {
                    return console.log(e);
                }
            });
        }
        case "log": 
        {
            return appendFileSync(join(__dirname, `../`, `../`, `logs/`, `info.log`), JSON.stringify(logObj) + "\n\n", (e) => {
                if (e) {
                    return console.log(e)
                }
            });
        }
        default: 
        return appendFileSync(join(__dirname, `../`, `../`, `logs/`, `info.log`), JSON.stringify(logObj) + "\n\n", (e) => {
            if (e) {
                return console.log(e);
            }
        });
    }
}

module.exports = Logger;