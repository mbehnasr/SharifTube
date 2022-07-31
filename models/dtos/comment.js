export function commentLightDto(comment) {
    return {
        uid: comment._id.toString(),
        text: comment.content,
        createdAt: comment.createdAt,
        user: {
            uid: comment.author._id.toString(),
            username: comment.author.username,
        },
    }
}