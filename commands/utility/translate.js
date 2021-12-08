const translate = require(`@k3rn31p4nic/google-translate-api`);
const { MessageEmbed } = require(`discord.js`);
exports.run = async(client, message, args) => {
    client.db.findById(client.user.id, async(err, res) => {
        if (!args[1]) return client.utils.missing(mesage, `LANGUAGE / TEXT_TO_LANUAGE`);
        let text = args.slice(1).join(` `);
        let link;
        if (args[1].startsWith(`https`)) {
            let newArg = args[1].split(`channels/`)[1].split(`/`);
            let guild = await client.guilds.cache.find(g => g.id === newArg[0]);
            if (!guild) return client.utils.missing(message, `VALID MESSAGE LINK`);
            let channel = guild.channels.cache.find(c => c.id === newArg[1]);
            if (!channel) return client.utils.missing(message, `VALID MESSAGE LINK`);
            let msg = await channel.messages.fetch(newArg[2]);
            if (!msg) return client.utils.missing(message, `VALID MESSAGE LINK`);
            if (!msg.content) return client.sendTemp(message, `That message does not have any content to translate.`);
            text = msg.content;
            link = `https://discord.com/channels/${guild.id}/${channel.id}/${msg.id}`;
        } else if ((!isNaN(args[1])) && (!args[2])) {
            let msg = await message.channel.messages.fetch(args[1]);
            if (!msg) return client.utils.missing(message, `VALID MESSAGE ID`);
            if (!msg.content) return client.sendTemp(message, `That message does not have any content to translate.`);
            text = msg.content;
            link = `https://discord.com/channels/${message.guild.id}/${message.channel.id}/${msg.id}`;
        }
        var trans = ``;
        var yes = false;
        Object.keys(languages).forEach(ali => {
            if (yes == true) return;
            if (languages[ali].toLowerCase() == args[0]) {
                yes = true;
                trans = `${languages[ali]} (${ali})`;
                return args[0] = ali;
            };
            if (args[0].toLowerCase() == ali) {
                yes = true;
                return trans = `${languages[ali]} (${ali})`;
            }
        });
        if (yes == false) return message.reply(`Please use a language permitted by Google API.`)
        try {
            const result = await translate(text, { to: args[0].toLowerCase() });
            var embed = new MessageEmbed()
                .setAuthor("Requested By: " + message.author.username, message.author.displayAvatarURL({ format: `png`, dynamic: true, size: 1024 }))
                .setColor(res.embedColor)
                .setDescription(result.text)
                .setFooter(`${languages[result.from.language.iso]} (${result.from.language.iso}) → ${trans}`, message.guild.iconURL())
            if (link) embed.setDescription(`[Original Message](${link})\n` + result.text)
            message.reply(embed);
        } catch (e) { return console.log(e.stack) };
    });
}, exports.info = {
    name: "translate",
    permission: `@everyone`,
    description: `Translation one language to another.`,
    arguments: '<prefix>translate [language] [text]\n<prefix>translate [language] [message_link]\n<prefix>translate [language] [message_id]'
};


const languages = {
    "auto": "Automatic",
    "af": "Afrikaans",
    "sq": "Albanian",
    "am": "Amharic",
    "ar": "Arabic",
    "hy": "Armenian",
    "az": "Azerbaijani",
    "eu": "Basque",
    "be": "Belarusian",
    "bn": "Bengali",
    "bs": "Bosnian",
    "bg": "Bulgarian",
    "ca": "Catalan",
    "ceb": "Cebuano",
    "ny": "Chichewa",
    "zh-cn": "Chinese Simplified",
    "zh-tw": "Chinese Traditional",
    "co": "Corsican",
    "hr": "Croatian",
    "cs": "Czech",
    "da": "Danish",
    "nl": "Dutch",
    "en": "English",
    "eo": "Esperanto",
    "et": "Estonian",
    "tl": "Filipino",
    "fi": "Finnish",
    "fr": "French",
    "fy": "Frisian",
    "gl": "Galician",
    "ka": "Georgian",
    "de": "German",
    "el": "Greek",
    "gu": "Gujarati",
    "ht": "Haitian Creole",
    "ha": "Hausa",
    "haw": "Hawaiian",
    "iw": "Hebrew",
    "hi": "Hindi",
    "hmn": "Hmong",
    "hu": "Hungarian",
    "is": "Icelandic",
    "ig": "Igbo",
    "id": "Indonesian",
    "ga": "Irish",
    "it": "Italian",
    "ja": "Japanese",
    "jw": "Javanese",
    "kn": "Kannada",
    "kk": "Kazakh",
    "km": "Khmer",
    "ko": "Korean",
    "ku": "Kurdish (Kurmanji)",
    "ky": "Kyrgyz",
    "lo": "Lao",
    "la": "Latin",
    "lv": "Latvian",
    "lt": "Lithuanian",
    "lb": "Luxembourgish",
    "mk": "Macedonian",
    "mg": "Malagasy",
    "ms": "Malay",
    "ml": "Malayalam",
    "mt": "Maltese",
    "mi": "Maori",
    "mr": "Marathi",
    "mn": "Mongolian",
    "my": "Myanmar (Burmese)",
    "ne": "Nepali",
    "no": "Norwegian",
    "ps": "Pashto",
    "fa": "Persian",
    "pl": "Polish",
    "pt": "Portuguese",
    "pa": "Punjabi",
    "ro": "Romanian",
    "ru": "Russian",
    "sm": "Samoan",
    "gd": "Scots Gaelic",
    "sr": "Serbian",
    "st": "Sesotho",
    "sn": "Shona",
    "sd": "Sindhi",
    "si": "Sinhala",
    "sk": "Slovak",
    "sl": "Slovenian",
    "so": "Somali",
    "es": "Spanish",
    "su": "Sundanese",
    "sw": "Swahili",
    "sv": "Swedish",
    "tg": "Tajik",
    "ta": "Tamil",
    "te": "Telugu",
    "th": "Thai",
    "tr": "Turkish",
    "uk": "Ukrainian",
    "ur": "Urdu",
    "uz": "Uzbek",
    "vi": "Vietnamese",
    "cy": "Welsh",
    "xh": "Xhosa",
    "yi": "Yiddish",
    "yo": "Yoruba",
    "zu": "Zulu"
};