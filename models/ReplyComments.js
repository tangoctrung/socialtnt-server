const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReplyCommentsSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        // type: String,
        required: true,
    },
    commentId: {
        // type: mongoose.Types.ObjectId,
        // ref: 'Comment',
        type: String,
        required: true,
    },
    content: {
        type: String,
        default: '',
    },
    likes: {
        type: Array,
        default: [],
    },
    totalReport: {
        type: Array,
        default: [],
    },
    isDelete: {
        type: Boolean,
        default: false,
    }


}, {timestamps: true})

module.exports = mongoose.model("ReplyComment", ReplyCommentsSchema);