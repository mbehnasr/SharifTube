import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'username can not be empty.'],
        maxlength: [60, 'username can not be longer than 60 characters.'],
    },
    password: {
        type: String,
        required: [true, 'password can not be empty.'],
    },
    roles: {
        type: [String],
        default: ['user'],
    },
    verified: {
        type: Boolean,
    },
})

export default mongoose.models.User || mongoose.model('User', UserSchema)