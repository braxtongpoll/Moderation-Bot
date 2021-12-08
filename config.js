const _config = {
    // Client Settings
    // Prefix is ran through the database and is defaulted to "."

    token: "", 

    //---------------------------------------------------------------------------------------------------------//
    presence: {
        type: `WATCHING`, // WATCHING, LISTENING, PLAYING
        name: `{members} Members | {roles} Roles | {ROLE:756698642496356424} Big Men`, // Anything you want
        status: `DND` // ONLINE, DND, or AWAY
    },

    // For status use here is some dynamic things you can use:
    // {members} // This will return the total amount of members the bot is watching.
    // {roles} // This will return the total amount of roles the bot is watching.
    // {ROLE:ROLEID} // This will return the total amount of members with a role. e.x {ROLE:756698642496356424}
    //---------------------------------------------------------------------------------------------------------//

    color: "00ccff", // This is used for all embeds

    helpMenuMessage: "Moderation Bot made by https://plutosworld.net",

    //Database

    database: "mongodb+srv://USERNAME:PASSWORD@cluster.rphbc.mongodb.net/DATABASE", // 

    // Command Aliases
    aliases: {
        // Utility Commands
        help: [],
        translate: ["t"],
        say: [],
        // Configuration Commands
        discordlogs: [],
        modlogs: [],
        muterole: [],
        prefix: [],
        welcomelogs: [],
        voicelogs: [],
        // Moderation Commands
        ban: ["bean"],
        kick: ["boot", "Italy"],
        mute: [],
        prune: ["purge"],
        reason: [],
        unmute: [],
        warn: [],
        unwarn: []
    }
};

module.exports = _config;