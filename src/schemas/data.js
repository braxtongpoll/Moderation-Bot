const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    _id: String,
    prefix: { type: String, default: `.` },
    muteRole: { type: String, default: `` },
    modLogs: { type: String, default: `` },
    discordLogs: { type: String, default: `` },
    voiceChannelLogs: { type: String, default: "" },
    welcomeLogs: { type: String, default: `` },
    embedColor: { type: String, default: `00ccff` },
    cases: { type: Object, default: {} },
    caseNumber: { type: Number, default: 1 },
    muteCases: { type: Object, default: {} }
});
module.exports = mongoose.model(`datas`, clientSchema);