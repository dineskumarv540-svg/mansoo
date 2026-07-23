package com.yourquote.app.data.model

data class Category(
    val id: String = "",
    val name: String = "",
    val emoji: String = "",
    val coverImageUrl: String = "",
    val sampleQuotes: List<String> = emptyList()
)
