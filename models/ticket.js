import mongoose from 'mongoose'

export const TicketStatus = {
    NEW: 'new',
    IN_PROGRESS: 'in_progress',
    SOLVED: 'solved',
    CLOSED: 'closed',
}

const UserSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    username: {
        type: String,
    },
})

const TicketSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    content: {
        type: String,
    },
    answer: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        default: TicketStatus.NEW,
    },
    user: {
        type: UserSchema,
    },
    activeRole: {
        type: String,
    },
    fileName: {
        type: String,
    },
    fileExtension: {
        type: String,
    },
})

TicketSchema.methods = {
    hasAttachment() {
        return Boolean(this.fileName && this.fileExtension);
    },
    getFullAttachmentName() {
        return `${this._id.toString()}.${this.fileExtension}`;
    }
}

export default mongoose.models.Ticket || mongoose.model('Ticket', TicketSchema);