const mongoose = require('mongoose');


const MessageSchema = new mongoose.Schema({  
    content: {
        type: String,
        default: '',
    },
    url: [
        {
            urlDoc: {type: String, default: ''},
            typeDoc: {type: String, default: ''},
            nameDoc: {type: String, default: ''}
        }
    ],
    conversationId: {
        type: String,
        default: '',
    },
    senderId: {
        type: String,
        ref: 'User',
        default: '',
    },
    typeMessage: {
        type: String,
        default: 'text',
    },
    isDelete: {
        type: Boolean,
        default: false,
    },
    isReply: {
        type: Boolean,
        default: false,
    },
    contentReply: {
        type: String,
        default: ''
    },
    personIdReply: {
        type: String,
        // ref: 'User',
        default: ''
    }
}, {timestamps: true})

module.exports = mongoose.model("Message", MessageSchema); 