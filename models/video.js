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
    },
    createdAt: {
        type: Date,
        default: Date.now,
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
    posterFile: {
        type: String,
    },
    extension: {
        type: String,
    },
    posterExtension: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    user: {
        type: UserSchema,
    },
    duration: {
        type: Number,
    },
    comments: {
        type: [CommentSchema],
        default: [],
    },
    likes: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
    }
})

VideoSchema.methods = {
    getFullFileName() {
        return `${this._id}.${this.extension}`
    },
    getFullPosterName() {
        return `${this._id}.${this.posterExtension}`
    }
}

VideoSchema.index({
    title: 'text', description: 'text', "comments.content": 'text',
}, {
    weights: {
        title: 9, description: 6, "comments.content": 1,
    }
})

export default mongoose.models.Video || mongoose.model('Video', VideoSchema);