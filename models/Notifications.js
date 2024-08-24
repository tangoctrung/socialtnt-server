const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
    senderNotiId: {
        type: String,
        ref: 'User',
    },
    receiverNotiId: [ 
        {type: String, ref: 'User',}
    ],
    typeNoti: {
        type: String,
        default: "",
    },
    content: {
        type: String,
        default: "",
    },
    postNotiId: {
        type: String,
        ref: 'Post',
    },
    readNotiId: [
        {type: String, ref: 'User',}
    ],
    deleteNotiId: [
        {type: String, ref: 'User',}
    ]
}, {timestamps: true});

module.exports = mongoose.model("Notification", NotificationSchema); 