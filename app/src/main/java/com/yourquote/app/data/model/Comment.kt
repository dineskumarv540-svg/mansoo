package com.yourquote.app.data.model

data class Comment(
    val id: String = "",
    val postId: String = "",
    val authorName: String = "",
    val authorAvatarUrl: String = "",
    val text: String = "",
    val timestamp: String = "Just now"
)
