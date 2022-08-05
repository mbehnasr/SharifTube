export function ticketListDto(ticket) {
    return {
        uid: ticket._id.toString(),
        title: ticket.title,
        createdAt: ticket.createdAt,
        status: ticket.status,
    }
}

export function ticketFullDto(ticket) {
    return {
        uid: ticket._id.toString(),
        title: ticket.title,
        content: ticket.content,
        answer: ticket.answer,
        createdAt: ticket.createdAt.toJSON(),
        status: ticket.status,
    }
}

export function ticketAdminListDto(ticket) {
    return {
        uid: ticket._id.toString(),
        title: ticket.title,
        createdAt: ticket.createdAt,
        status: ticket.status,
        user: {
            uid: ticket.user._id.toString(),
            username: ticket.user.username
        }
    }
}

export function ticketAdminFullDto(ticket) {
    return {
        uid: ticket._id.toString(),
        title: ticket.title,
        content: ticket.content,
        answer: ticket.answer,
        createdAt: ticket.createdAt.toJSON(),
        status: ticket.status,
        user: {
            uid: ticket.user._id.toString(),
            username: ticket.user.username
        }
    }
}