export function videoFullDto(video, user) {
    return {
        uid: video._id.toString(),
        title: video.title,
        description: video.description,
        createdAt: video.createdAt.toJSON(),
        user: {
            uid: video.user._id.toString(),
            username: video.user.username,
        },
        likes: video.likes.length,
        liked: Boolean(user) && video.likes.includes(user._id),
        duration: video.duration,
        extraTags: video.extraTags,
    }
}

export function videoAdminDto(video) {
    return {
        uid: video._id.toString(),
        title: video.title,
        description: video.description,
        createdAt: video.createdAt.toJSON(),
        user: {
            uid: video.user._id.toString(),
            username: video.user.username,
        },
        likes: video.likes.length,
        duration: video.duration,
        visible: video.visible,
        extraTags: video.extraTags,
    }
}