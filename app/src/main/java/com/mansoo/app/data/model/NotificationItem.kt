package com.mansoo.app.data.model

data class NotificationItem(
    val id: String = "",
    val type: NotificationType = NotificationType.LIKE,
    val actorName: String = "",
    val actorAvatarUrl: String = "",
    val postTitleSnippet: String = "",
    val timeAgo: String = "",
    val isRead: Boolean = false
)

enum class NotificationType {
    LIKE,
    COMMENT,
    FOLLOW,
    FEATURED
}
