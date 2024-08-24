const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    
    title: {
        type: String,
        default: '',
    },
    body: {
        type: String,
        default: '',
    },
    likes: [
        {ref: 'User', type: String}     
    ],
    dislikes: [
        {type: String, ref: 'User'}
    ],
    images: {
        type: Array,
        default: [],
    },
    hashtags: {
        type: Array,
        required: false,
    },
    totalReport: {
        type: Number,
        default: 0,
    },
    authorId: {
        // type: Schema.Types.ObjectId,
        type: String,
        ref: 'User',
        required: true,
    },
    themen: {
        type: String,
        default: '',
    }

}, {timestamps: true})

module.exports = mongoose.model("Post", PostSchema); 