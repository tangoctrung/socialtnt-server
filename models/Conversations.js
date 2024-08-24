const mongoose = require('mongoose');


const ConversationSchema = new mongoose.Schema({
    
    members: {
        type: Array,
        default: [],
    },
    messageLast: {
        type: String,
        default: '',
    },
    senderId: {
        type: String,
        default: '',
    }
    // ,
    // isRead: {  // xem cuộc hội thoại có tin nhắn chưa đọc hay không
    //     type: Boolean,
    //     default: null,
    // }

}, {timestamps: true})

module.exports = mongoose.model("Conversation", ConversationSchema); 