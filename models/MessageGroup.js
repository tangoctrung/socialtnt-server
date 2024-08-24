const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageGroupSchema = new Schema({  
    content: {
        type: String,
        default: '',
    },
    conversationGroupId: {
        type: String,
        default: '',
    },
    senderId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: '',
    }
}, {timestamps: true})

module.exports = mongoose.model("MessageGroup", MessageGroupSchema); 