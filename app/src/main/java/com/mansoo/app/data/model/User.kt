package com.mansoo.app.data.model

data class User(
    val id: String = "",
    val name: String = "",
    val handle: String = "",
    val email: String = "",
    val bio: String = "",
    val avatarUrl: String = "",
    val isVerified: Boolean = false,
    val isPremium: Boolean = false,
    val followersCount: Int = 0,
    val followingCount: Int = 0,
    val postsCount: Int = 0,
    val isFollowing: Boolean = false,
    val isSuggested: Boolean = false
)
