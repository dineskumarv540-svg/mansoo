package com.mansoo.app.ui.screens.explore

import androidx.compose.animation.animateColorAsState
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.animation.core.animateDpAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.lazy.staggeredgrid.LazyVerticalStaggeredGrid
import androidx.compose.foundation.lazy.staggeredgrid.StaggeredGridCells
import androidx.compose.foundation.lazy.staggeredgrid.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.outlined.BookmarkBorder
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.mansoo.app.data.local.SampleData
import com.mansoo.app.data.model.Post
import com.mansoo.app.ui.components.PostCard
import com.mansoo.app.ui.theme.*

// Predefined card heights for stagger effect — alternating taller/shorter per column
private val staggerHeights = listOf(200, 260, 220, 300, 180, 250, 230, 190, 270, 210)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ExploreScreen(
    posts: List<Post>,
    selectedHashtag: String,
    onHashtagSelected: (String) -> Unit
) {
    var searchQuery by remember { mutableStateOf("") }
    var isSearchFocused by remember { mutableStateOf(false) }
    var clickedPostDetail by remember { mutableStateOf<Post?>(null) }

    val filteredPosts = remember(posts, selectedHashtag, searchQuery) {
        posts.filter { post ->
            val matchesTag = selectedHashtag == "#Trending" ||
                    post.tags.any { it.equals(selectedHashtag.removePrefix("#"), ignoreCase = true) }
            val matchesQuery = searchQuery.isEmpty() ||
                    post.quoteText.contains(searchQuery, ignoreCase = true) ||
                    post.authorName.contains(searchQuery, ignoreCase = true)
            matchesTag && matchesQuery
        }
    }

    val displayPosts = if (filteredPosts.isNotEmpty()) filteredPosts else posts

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundLight)
    ) {
        // ─────────────────────────────────────────
        // TOP HEADER: Search + Hashtags
        // ─────────────────────────────────────────
        Surface(
            color = Color.White,
            shadowElevation = 4.dp,
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(horizontal = 16.dp, vertical = 12.dp)) {

                // ── Search Bar ──
                val borderBrush = if (isSearchFocused)
                    Brush.horizontalGradient(listOf(GradientStart, GradientEnd))
                else
                    Brush.horizontalGradient(listOf(Color(0xFFE0E0E0), Color(0xFFE0E0E0)))

                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .shadow(if (isSearchFocused) 8.dp else 2.dp, RoundedCornerShape(28.dp))
                        .background(Color.White, RoundedCornerShape(28.dp))
                        .border(
                            width = if (isSearchFocused) 2.dp else 1.dp,
                            brush = borderBrush,
                            shape = RoundedCornerShape(28.dp)
                        )
                        .padding(horizontal = 16.dp, vertical = 4.dp)
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Icon(
                            imageVector = Icons.Filled.Search,
                            contentDescription = "Search",
                            tint = if (isSearchFocused) GradientStart else TextSecondary,
                            modifier = Modifier.size(20.dp)
                        )
                        Spacer(modifier = Modifier.width(10.dp))
                        BasicTextField(
                            value = searchQuery,
                            onValueChange = { searchQuery = it },
                            singleLine = true,
                            textStyle = LocalTextStyle.current.copy(
                                fontSize = 14.sp,
                                color = TextPrimary
                            ),
                            decorationBox = { innerTextField ->
                                Box(modifier = Modifier.weight(1f)) {
                                    if (searchQuery.isEmpty()) {
                                        Text(
                                            text = "Search quotes, poets, hashtags…",
                                            fontSize = 14.sp,
                                            color = TextMuted
                                        )
                                    }
                                    innerTextField()
                                }
                            },
                            modifier = Modifier
                                .weight(1f)
                                .padding(vertical = 10.dp)
                        )
                        if (searchQuery.isNotEmpty()) {
                            IconButton(
                                onClick = { searchQuery = "" },
                                modifier = Modifier.size(20.dp)
                            ) {
                                Icon(
                                    imageVector = Icons.Filled.Close,
                                    contentDescription = "Clear",
                                    tint = TextSecondary,
                                    modifier = Modifier.size(16.dp)
                                )
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                // ── Hashtag Chips ──
                LazyRow(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    contentPadding = PaddingValues(horizontal = 2.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    itemsIndexed(SampleData.hashtagsList) { _, tag ->
                        val isSelected = tag == selectedHashtag

                        val animatedBgAlpha by animateColorAsState(
                            targetValue = if (isSelected) Color.Transparent else Color(0xFFF0F0F0),
                            animationSpec = tween(200),
                            label = "chipBg"
                        )
                        val chipElevation by animateDpAsState(
                            targetValue = if (isSelected) 4.dp else 0.dp,
                            animationSpec = tween(200),
                            label = "chipElevation"
                        )

                        Box(
                            contentAlignment = Alignment.Center,
                            modifier = Modifier
                                .shadow(chipElevation, RoundedCornerShape(50.dp))
                                .background(
                                    brush = if (isSelected)
                                        Brush.horizontalGradient(listOf(GradientStart, GradientEnd))
                                    else
                                        Brush.horizontalGradient(listOf(animatedBgAlpha, animatedBgAlpha)),
                                    shape = RoundedCornerShape(50.dp)
                                )
                                .clickable { onHashtagSelected(tag) }
                                .padding(horizontal = 14.dp, vertical = 8.dp)
                        ) {
                            Text(
                                text = tag,
                                fontSize = 13.sp,
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                                color = if (isSelected) Color.White else TextSecondary
                            )
                        }
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(2.dp))

        // ─────────────────────────────────────────
        // PINTEREST STAGGERED GRID
        // ─────────────────────────────────────────
        LazyVerticalStaggeredGrid(
            columns = StaggeredGridCells.Fixed(2),
            contentPadding = PaddingValues(horizontal = 10.dp, vertical = 10.dp),
            horizontalArrangement = Arrangement.spacedBy(10.dp),
            verticalItemSpacing = 10.dp,
            modifier = Modifier.fillMaxSize()
        ) {
            items(displayPosts) { post ->
                val index = displayPosts.indexOf(post)
                val cardHeight = staggerHeights[index % staggerHeights.size].dp
                val isImageCard = post.backgroundImageUrl.isNotEmpty()

                ExploreGridCard(
                    post = post,
                    cardHeight = cardHeight,
                    isImageCard = isImageCard,
                    onClick = { clickedPostDetail = post }
                )
            }
        }
    }

    // ─────────────────────────────────────────
    // FULL POST DETAIL DIALOG
    // ─────────────────────────────────────────
    clickedPostDetail?.let { detailPost ->
        AlertDialog(
            onDismissRequest = { clickedPostDetail = null },
            confirmButton = {
                TextButton(onClick = { clickedPostDetail = null }) {
                    Text("Close", color = PrimaryPink, fontWeight = FontWeight.SemiBold)
                }
            },
            text = {
                Box(modifier = Modifier.fillMaxWidth()) {
                    PostCard(post = detailPost)
                }
            },
            shape = RoundedCornerShape(24.dp),
            containerColor = Color.Transparent
        )
    }
}

// ─────────────────────────────────────────────────────────────
// GRID CARD — Image card vs Quote card with premium styling
// ─────────────────────────────────────────────────────────────
@Composable
fun ExploreGridCard(
    post: Post,
    cardHeight: androidx.compose.ui.unit.Dp,
    isImageCard: Boolean,
    onClick: () -> Unit
) {
    Card(
        shape = RoundedCornerShape(16.dp),
        elevation = CardDefaults.cardElevation(defaultElevation = 3.dp, pressedElevation = 1.dp),
        modifier = Modifier
            .fillMaxWidth()
            .height(cardHeight)
            .clickable { onClick() }
    ) {
        Box(modifier = Modifier.fillMaxSize()) {

            if (isImageCard) {
                // ── IMAGE CARD ──
                AsyncImage(
                    model = post.backgroundImageUrl,
                    contentDescription = post.quoteText,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier.fillMaxSize()
                )
                // Gradient overlay darkens bottom
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(
                            Brush.verticalGradient(
                                0f to Color.Transparent,
                                0.5f to Color.Black.copy(alpha = 0.2f),
                                1f to Color.Black.copy(alpha = 0.75f)
                            )
                        )
                )
                // Quote text overlay
                Text(
                    text = post.quoteText,
                    color = Color.White,
                    fontWeight = FontWeight.SemiBold,
                    fontSize = 12.sp,
                    lineHeight = 16.sp,
                    textAlign = TextAlign.Center,
                    maxLines = 4,
                    modifier = Modifier
                        .align(Alignment.Center)
                        .padding(horizontal = 10.dp, vertical = 8.dp)
                )
            } else {
                // ── QUOTE CARD (gradient background) ──
                val gradientColors = listOf(
                    listOf(Color(0xFF667EEA), Color(0xFF764BA2)),
                    listOf(Color(0xFFFF416C), Color(0xFFFF4B2B)),
                    listOf(Color(0xFF11998E), Color(0xFF38EF7D)),
                    listOf(Color(0xFFF7971E), Color(0xFFFFD200)),
                    listOf(Color(0xFF2193B0), Color(0xFF6DD5FA)),
                    listOf(Color(0xFFCC2B52), Color(0xFFAF4261)),
                )
                val colorPair = gradientColors[post.id.hashCode().let { kotlin.math.abs(it) } % gradientColors.size]

                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(Brush.linearGradient(colorPair))
                )

                // Large decorative quote mark
                Text(
                    text = "\u201C",
                    fontSize = 72.sp,
                    fontFamily = FontFamily.Serif,
                    color = Color.White.copy(alpha = 0.15f),
                    modifier = Modifier
                        .align(Alignment.TopStart)
                        .padding(start = 4.dp, top = 0.dp)
                )

                // Quote text centered
                Text(
                    text = post.quoteText,
                    color = Color.White,
                    fontWeight = FontWeight.Medium,
                    fontStyle = FontStyle.Italic,
                    fontSize = 12.sp,
                    lineHeight = 18.sp,
                    textAlign = TextAlign.Center,
                    maxLines = 6,
                    modifier = Modifier
                        .align(Alignment.Center)
                        .padding(horizontal = 12.dp, vertical = 12.dp)
                )

                // Watermark
                Text(
                    text = "Mansoo",
                    color = Color.White.copy(alpha = 0.4f),
                    fontSize = 9.sp,
                    modifier = Modifier
                        .align(Alignment.BottomEnd)
                        .padding(6.dp)
                )
            }

            // ── BOTTOM ROW: Author avatar + name + likes ──
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier
                    .align(Alignment.BottomStart)
                    .fillMaxWidth()
                    .padding(horizontal = 8.dp, vertical = 6.dp)
            ) {
                // Author avatar
                AsyncImage(
                    model = post.authorAvatarUrl,
                    contentDescription = post.authorName,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier
                        .size(20.dp)
                        .clip(CircleShape)
                        .border(1.dp, Color.White, CircleShape)
                )
                Spacer(modifier = Modifier.width(4.dp))
                Text(
                    text = post.authorHandle.ifEmpty { post.authorName },
                    color = Color.White,
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Medium,
                    maxLines = 1,
                    modifier = Modifier.weight(1f)
                )
                // Likes
                Icon(
                    imageVector = Icons.Filled.Favorite,
                    contentDescription = "Likes",
                    tint = Color(0xFFFF6B8A),
                    modifier = Modifier.size(12.dp)
                )
                Spacer(modifier = Modifier.width(3.dp))
                Text(
                    text = "${post.likesCount}",
                    color = Color.White,
                    fontSize = 10.sp,
                    fontWeight = FontWeight.SemiBold
                )
            }
        }
    }
}
