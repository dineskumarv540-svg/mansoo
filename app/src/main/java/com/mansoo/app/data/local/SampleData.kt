package com.mansoo.app.data.local

import com.mansoo.app.data.model.Category
import com.mansoo.app.data.model.Comment
import com.mansoo.app.data.model.NotificationItem
import com.mansoo.app.data.model.NotificationType
import com.mansoo.app.data.model.Post
import com.mansoo.app.data.model.User

object SampleData {

    val sampleUsers = listOf(
        User(
            id = "u1",
            name = "Aarav Sharma",
            handle = "@aarav_writes",
            bio = "Poet & Dreamer 🌙 | Author of 'Echoes of Silence'",
            avatarUrl = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400",
            isVerified = true,
            isPremium = true,
            followersCount = 14200,
            followingCount = 312,
            postsCount = 480,
            isFollowing = true
        ),
        User(
            id = "u2",
            name = "Meera Roy",
            handle = "@meera_poetry",
            bio = "Crafting Shayari in Hindi & Urdu ✨ | Coffee lover ☕",
            avatarUrl = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
            isVerified = true,
            isPremium = false,
            followersCount = 28900,
            followingCount = 180,
            postsCount = 920,
            isSuggested = true
        ),
        User(
            id = "u3",
            name = "Karan Verma",
            handle = "@karan_thoughts",
            bio = "Deep thoughts & Philosophy 📖 | Daily Motivational Quotes",
            avatarUrl = "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400",
            isVerified = false,
            isPremium = true,
            followersCount = 8500,
            followingCount = 450,
            postsCount = 210,
            isSuggested = true
        ),
        User(
            id = "u4",
            name = "Ananya Das",
            handle = "@ananya_verses",
            bio = "Unexpressed feelings turned into ink 🖊️",
            avatarUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
            isVerified = true,
            isPremium = true,
            followersCount = 52000,
            followingCount = 95,
            postsCount = 1340,
            isSuggested = true
        ),
        User(
            id = "u5",
            name = "Rohan Malhotra",
            handle = "@rohan_humor",
            bio = "Life is short, laugh louder! 😂 | Stand-up comedy quotes",
            avatarUrl = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
            isVerified = false,
            isPremium = false,
            followersCount = 9400,
            followingCount = 520,
            postsCount = 310,
            isSuggested = true
        )
    )

    val sampleStories = listOf(
        User("s1", "Aarav", "@aarav", "", "", "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200", isVerified = true),
        User("s2", "Meera", "@meera", "", "", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200", isVerified = true),
        User("s3", "Karan", "@karan", "", "", "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200"),
        User("s4", "Ananya", "@ananya", "", "", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200", isVerified = true),
        User("s5", "Rohan", "@rohan", "", "", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200"),
        User("s6", "Priya", "@priya", "", "", "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200"),
        User("s7", "Vikram", "@vikram", "", "", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200")
    )

    val samplePosts = listOf(
        Post(
            id = "p1",
            authorId = "u1",
            authorName = "Aarav Sharma",
            authorHandle = "@aarav_writes",
            authorAvatarUrl = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400",
            isVerified = true,
            isPremium = true,
            quoteText = "कुछ बातें अनकही ही खूबसूरत होती हैं,\nलफ़्ज़ों में ढलते ही अक्सर मलाल बन जाती हैं।",
            category = "Poem",
            backgroundImageUrl = "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800",
            fontStyle = "Serif",
            textColor = 0xFFFFFFFF,
            likesCount = 428,
            commentsCount = 34,
            sharesCount = 89,
            isLiked = true,
            isSaved = false,
            isFeatured = true,
            tags = listOf("Poem", "Life", "Feelings"),
            commentsPreview = listOf(
                Comment("c1", "p1", "Meera Roy", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200", "अद्भुत पंक्तियाँ! बहुत सुंदर। ❤️"),
                Comment("c2", "p1", "Karan Verma", "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200", "Touch my heart... deep meaning.")
            )
        ),
        Post(
            id = "p2",
            authorId = "u2",
            authorName = "Meera Roy",
            authorHandle = "@meera_poetry",
            authorAvatarUrl = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
            isVerified = true,
            isPremium = false,
            quoteText = "Do not bleed on people\nwho didn't cut you.\n\nHeal yourself first, darling.",
            category = "Quotes",
            backgroundImageUrl = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
            fontStyle = "Sans",
            textColor = 0xFFFFFFFF,
            likesCount = 1240,
            commentsCount = 98,
            sharesCount = 310,
            isLiked = false,
            isSaved = true,
            isFeatured = true,
            tags = listOf("Quotes", "Unique", "Feelings"),
            commentsPreview = listOf(
                Comment("c3", "p2", "Ananya Das", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200", "So true! Needed to read this today 🙏")
            )
        ),
        Post(
            id = "p3",
            authorId = "u3",
            authorName = "Karan Verma",
            authorHandle = "@karan_thoughts",
            authorAvatarUrl = "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400",
            isVerified = false,
            isPremium = true,
            quoteText = "The highest form of intelligence is to observe yourself without judging.",
            category = "Life",
            backgroundImageUrl = "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800",
            fontStyle = "Monospace",
            textColor = 0xFFF5F5F5,
            likesCount = 890,
            commentsCount = 42,
            sharesCount = 120,
            isLiked = false,
            isSaved = false,
            isFeatured = false,
            tags = listOf("Trending", "Life", "Quotes")
        ),
        Post(
            id = "p4",
            authorId = "u4",
            authorName = "Ananya Das",
            authorHandle = "@ananya_verses",
            authorAvatarUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
            isVerified = true,
            isPremium = true,
            quoteText = "She wore her scars like wings,\nand flew into the storm.",
            category = "Story",
            backgroundImageUrl = "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800",
            fontStyle = "Cursive",
            textColor = 0xFFFFFFFF,
            likesCount = 2300,
            commentsCount = 180,
            sharesCount = 540,
            isLiked = true,
            isSaved = true,
            isFeatured = true,
            tags = listOf("Story", "Trending", "Unique")
        ),
        Post(
            id = "p5",
            authorId = "u5",
            authorName = "Rohan Malhotra",
            authorHandle = "@rohan_humor",
            authorAvatarUrl = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
            isVerified = false,
            isPremium = false,
            quoteText = "My alarm clock is clearly jealous of my relationship with my bed! 😴 ⏰",
            category = "Meme",
            backgroundImageUrl = "https://images.unsplash.com/photo-1531685250784-756995259377?w=800",
            fontStyle = "Sans",
            textColor = 0xFF000000,
            likesCount = 540,
            commentsCount = 29,
            sharesCount = 65,
            isLiked = false,
            isSaved = false,
            isFeatured = false,
            tags = listOf("Meme", "Humor", "Jokes")
        )
    )

    val sampleCategories = listOf(
        Category("cat1", "Nature", "🌿", "https://images.unsplash.com/photo-1448375240586-882707db888b?w=500", listOf("The mountains call and I must go.", "Peace in every leaf.")),
        Category("cat2", "Love", "💖", "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500", listOf("You are my favorite notification.", "Love is poetry written by two souls.")),
        Category("cat3", "Politics", "🏛️", "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=500", listOf("Truth is always revolutionary.", "Democracy dies in darkness.")),
        Category("cat4", "Humor", "🎭", "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=500", listOf("I’m not lazy, I’m on energy saving mode.", "Chocolate doesn’t ask questions.")),
        Category("cat5", "Jokes", "😂", "https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=500", listOf("Why don’t scientists trust atoms? They make up everything!", "Parallel lines have so much in common."))
    )

    val sampleNotifications = listOf(
        NotificationItem("n1", NotificationType.LIKE, "Meera Roy", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200", "कुछ बातें अनकही...", "2m ago"),
        NotificationItem("n2", NotificationType.COMMENT, "Karan Verma", "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200", "Touch my heart... deep meaning.", "15m ago"),
        NotificationItem("n3", NotificationType.FOLLOW, "Ananya Das", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200", "started following you", "1h ago"),
        NotificationItem("n4", NotificationType.FEATURED, "Mansoo Team", "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200", "Your post was selected for 'Best Posts of the Week' 🎉", "3h ago")
    )

    val hashtagsList = listOf("#Story", "#Poem", "#Quotes", "#Trending", "#Novel", "#Life", "#Culture", "#Unique", "#Feelings", "#Meme")
}
