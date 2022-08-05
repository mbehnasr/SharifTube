import mongoose from 'mongoose'

export const Role = {
    USER: 'user',
    ADMIN: 'admin',
    MANAGER: 'manager',
}

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
        default: [Role.USER],
    },
    verified: {
        type: Boolean,
    },
    strike: {
        type: Boolean,
        default: false,
    }
})

UserSchema.index({
    username: "text"
})

export default mongoose.models.User || mongoose.model('User', UserSchema)