package com.yourquote.app.data.model

data class Post(
    val id: String = "",
    val authorId: String = "",
    val authorName: String = "",
    val authorHandle: String = "",
    val authorAvatarUrl: String = "",
    val isVerified: Boolean = false,
    val isPremium: Boolean = false,
    val quoteText: String = "",
    val language: String = "English", // Hindi, English, Urdu, etc.
    val category: String = "Quotes",
    val backgroundImageUrl: String = "",
    val gradientColors: List<Long> = emptyList(),
    val fontStyle: String = "Serif",
    val textColor: Long = 0xFFFFFFFF,
    val likesCount: Int = 0,
    val commentsCount: Int = 0,
    val sharesCount: Int = 0,
    val isLiked: Boolean = false,
    val isSaved: Boolean = false,
    val isFeatured: Boolean = false,
    val createdAtTimestamp: Long = System.currentTimeMillis(),
    val tags: List<String> = emptyList(),
    val commentsPreview: List<Comment> = emptyList()
)
