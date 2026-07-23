package com.mansoo.app.ui.components

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.spring
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.mansoo.app.data.model.Post
import com.mansoo.app.ui.theme.*

@Composable
fun PostCard(
    post: Post,
    onLikeClick: (Post) -> Unit = {},
    onCommentClick: (Post) -> Unit = {},
    onShareClick: (Post) -> Unit = {},
    onSaveClick: (Post) -> Unit = {},
    onOptionsClick: (Post) -> Unit = {}
) {
    var isLiked by remember { mutableStateOf(post.isLiked) }
    var likesCount by remember { mutableStateOf(post.likesCount) }
    var isSaved by remember { mutableStateOf(post.isSaved) }

    Card(
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(
            defaultElevation = 4.dp,
            pressedElevation = 2.dp
        ),
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 12.dp, vertical = 8.dp)
    ) {
        Column(modifier = Modifier.fillMaxWidth()) {

            // 1. [Profile Pic]  Username        ⋮
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 12.dp, vertical = 10.dp)
            ) {
                // [Profile Pic]
                AsyncImage(
                    model = post.authorAvatarUrl,
                    contentDescription = post.authorName,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier
                        .size(40.dp)
                        .clip(CircleShape)
                )

                Spacer(modifier = Modifier.width(10.dp))

                // Username
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.weight(1f)
                ) {
                    Text(
                        text = post.authorName,
                        fontWeight = FontWeight.Bold,
                        fontSize = 14.sp,
                        color = TextPrimary
                    )
                    if (post.isVerified) {
                        Spacer(modifier = Modifier.width(4.dp))
                        Icon(
                            imageVector = Icons.Filled.CheckCircle,
                            contentDescription = "Verified",
                            tint = VerifiedBlue,
                            modifier = Modifier.size(14.dp)
                        )
                    }
                }

                // 3-Dot Menu Button ⋮
                IconButton(onClick = { onOptionsClick(post) }) {
                    Icon(
                        imageVector = Icons.Filled.MoreVert,
                        contentDescription = "Options",
                        tint = TextSecondary
                    )
                }
            }

            // 2. [Post Image / Background]
            Box(
                contentAlignment = Alignment.Center,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(280.dp)
                    .background(Color.Black)
            ) {
                if (post.backgroundImageUrl.isNotEmpty()) {
                    AsyncImage(
                        model = post.backgroundImageUrl,
                        contentDescription = "Post Background",
                        contentScale = ContentScale.Crop,
                        modifier = Modifier.fillMaxSize()
                    )
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .background(
                                Brush.verticalGradient(
                                    listOf(Color.Black.copy(alpha = 0.3f), Color.Black.copy(alpha = 0.65f))
                                )
                            )
                    )
                } else {
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .background(
                                Brush.linearGradient(listOf(GradientStart, GradientEnd))
                            )
                    )
                }

                // Quote text overlay
                Text(
                    text = post.quoteText,
                    color = Color(post.textColor),
                    fontSize = 18.sp,
                    fontFamily = when (post.fontStyle) {
                        "Serif" -> FontFamily.Serif
                        "Monospace" -> FontFamily.Monospace
                        "Cursive" -> FontFamily.Cursive
                        else -> FontFamily.Default
                    },
                    fontWeight = FontWeight.SemiBold,
                    textAlign = TextAlign.Center,
                    lineHeight = 28.sp,
                    modifier = Modifier.padding(24.dp)
                )

                Text(
                    text = "Mansoo.in",
                    color = Color.White.copy(alpha = 0.75f),
                    fontSize = 10.sp,
                    modifier = Modifier
                        .align(Alignment.BottomEnd)
                        .padding(12.dp)
                )
            }

            // 3. ❤️   💬   🔗         🔖
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 12.dp, vertical = 6.dp)
            ) {
                    // Like ❤️  — scale + bounce via AnimatedLikeButton
                    AnimatedLikeButton(
                        isLiked  = isLiked,
                        onToggle = {
                            isLiked = !isLiked
                            likesCount += if (isLiked) 1 else -1
                            onLikeClick(post)
                        }
                    ) { liked ->
                        Icon(
                            imageVector        = if (liked) Icons.Filled.Favorite else Icons.Outlined.FavoriteBorder,
                            contentDescription = "Like",
                            tint               = if (liked) LikeRed else TextPrimary,
                            modifier           = Modifier
                                .padding(8.dp)
                                .size(24.dp)
                        )
                    }

                    // Comment 💬
                    IconButton(onClick = { onCommentClick(post) }) {
                        Icon(
                            imageVector = Icons.Outlined.ChatBubbleOutline,
                            contentDescription = "Comment",
                            tint = TextPrimary,
                            modifier = Modifier.size(22.dp)
                        )
                    }

                    // Share 🔗
                    IconButton(onClick = { onShareClick(post) }) {
                        Icon(
                            imageVector = Icons.Outlined.Share,
                            contentDescription = "Share",
                            tint = TextPrimary,
                            modifier = Modifier.size(22.dp)
                        )
                    }
                }

                // Save 🔖
                IconButton(
                    onClick = {
                        isSaved = !isSaved
                        onSaveClick(post)
                    }
                ) {
                    Icon(
                        imageVector = if (isSaved) Icons.Filled.Bookmark else Icons.Outlined.BookmarkBorder,
                        contentDescription = "Save",
                        tint = if (isSaved) PrimaryPink else TextPrimary,
                        modifier = Modifier.size(24.dp)
                    )
                }
            }

            // 4. 👥  Story_of_love + 20 others like this
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 12.dp, vertical = 2.dp)
            ) {
                Icon(
                    imageVector = Icons.Filled.People,
                    contentDescription = "Likes",
                    tint = TextSecondary,
                    modifier = Modifier.size(16.dp)
                )
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = "Story_of_love + ${likesCount - 1} others like this",
                    fontWeight = FontWeight.SemiBold,
                    fontSize = 13.sp,
                    color = TextPrimary
                )
            }

            // 5. Username: Post text preview...
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 12.dp, vertical = 4.dp)
            ) {
                Text(
                    text = "${post.authorName}: ",
                    fontWeight = FontWeight.Bold,
                    fontSize = 13.sp,
                    color = TextPrimary
                )
                Text(
                    text = post.quoteText.replace("\n", " "),
                    fontSize = 13.sp,
                    color = TextSecondary,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
            }

            // 6. View all comments
            Text(
                text = "View all comments",
                fontSize = 12.sp,
                fontWeight = FontWeight.Medium,
                color = TextMuted,
                modifier = Modifier
                    .clickable { onCommentClick(post) }
                    .padding(horizontal = 12.dp, vertical = 6.dp)
            )

            Spacer(modifier = Modifier.height(4.dp))
        }
    }
}
