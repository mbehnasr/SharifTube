import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    username: {
        type: String,
    },
})

const CommentSchema = new mongoose.Schema({
    author: {
        type: UserSchema,
    },
    content: {
        type: String,
    }
})

const VideoSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    file: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    user: {
        type: UserSchema,
    },
    comments: {
        type: [CommentSchema],
        default: [],
    }
})

export default mongoose.models.Video || mongoose.model('Video', VideoSchema);