export function videoFullDto(video, user) {
    return {
        uid: video._id.toString(),
        title: video.title,
        description: video.description,
        createdAt: video.createdAt,
        user: {
            uid: video.user._id.toString(),
            username: video.user.username,
        },
        likes: video.likes.length,
        liked: Boolean(user) && video.likes.includes(user._id),
    }
}