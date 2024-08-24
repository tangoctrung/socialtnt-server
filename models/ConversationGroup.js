const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConversationGroupSchema = new Schema({
    
    membersGroup: [
        {type: String, ref: 'User'}
    ],
    messageLastGroup: {
        type: String,
        default: '',
    },
    senderIdGroup: {
        type: String,
        default: '',
    },
    avatarGroup: {
        type: String,
        default: '',
    },
    nameGroup: {
        type: String,
        default: '',
    }

}, {timestamps: true})

module.exports = mongoose.model("ConversationGroup", ConversationGroupSchema); 