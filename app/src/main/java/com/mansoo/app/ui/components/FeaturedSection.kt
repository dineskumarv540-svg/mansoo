package com.mansoo.app.ui.components

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.mansoo.app.data.model.Post
import com.mansoo.app.ui.theme.*

@Composable
fun FeaturedSection(
    featuredPosts: List<Post>,
    onPostClick: (Post) -> Unit = {}
) {
    if (featuredPosts.isEmpty()) return

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(Color.White)
    ) {

        // ── Section Header ───────────────────────────────────
        Spacer(modifier = Modifier.height(16.dp))

        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.fillMaxWidth()
        ) {
            // Decorative top sparkle row
            Row(
                horizontalArrangement = Arrangement.Center,
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.fillMaxWidth()
            ) {
                SparkleIcon()
                Spacer(modifier = Modifier.width(8.dp))
                // Gradient line left
                Box(
                    modifier = Modifier
                        .width(40.dp)
                        .height(1.5.dp)
                        .background(
                            Brush.horizontalGradient(listOf(Color.Transparent, PrimaryPink))
                        )
                )
                Spacer(modifier = Modifier.width(6.dp))

                // ── Title: handwritten-style font ──
                Text(
                    text = "Our Best Posts",
                    fontFamily = FontFamily.Cursive,        // cursive = handwriting style
                    fontWeight = FontWeight.Bold,
                    fontSize = 26.sp,
                    color = Color(0xFFB5004C),              // deep rose
                    letterSpacing = 0.5.sp
                )

                Spacer(modifier = Modifier.width(6.dp))
                // Gradient line right
                Box(
                    modifier = Modifier
                        .width(40.dp)
                        .height(1.5.dp)
                        .background(
                            Brush.horizontalGradient(listOf(PrimaryPink, Color.Transparent))
                        )
                )
                Spacer(modifier = Modifier.width(8.dp))
                SparkleIcon()
            }

            Spacer(modifier = Modifier.height(2.dp))
            Text(
                text = "Hand-picked by the Mansoo team ✨",
                fontSize = 12.sp,
                color = TextMuted,
                fontStyle = FontStyle.Italic,
                textAlign = TextAlign.Center
            )
        }

        Spacer(modifier = Modifier.height(14.dp))

        // ── Featured Cards Horizontal Scroll ────────────────
        LazyRow(
            contentPadding = PaddingValues(horizontal = 16.dp, vertical = 4.dp),
            horizontalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            itemsIndexed(featuredPosts) { index, post ->
                FeaturedCard(
                    post = post,
                    isHero = index == 0,     // first card is bigger "Hero" card
                    onClick = { onPostClick(post) }
                )
            }
        }

        Spacer(modifier = Modifier.height(4.dp))

        // ── Page Indicator Dots ──────────────────────────────
        Row(
            horizontalArrangement = Arrangement.Center,
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 8.dp)
        ) {
            featuredPosts.forEachIndexed { index, _ ->
                Box(
                    modifier = Modifier
                        .padding(horizontal = 3.dp)
                        .size(if (index == 0) 20.dp else 6.dp, 6.dp)
                        .clip(RoundedCornerShape(50.dp))
                        .background(
                            if (index == 0)
                                Brush.horizontalGradient(listOf(GradientStart, GradientEnd))
                            else
                                Brush.horizontalGradient(listOf(Color(0xFFDDDDDD), Color(0xFFDDDDDD)))
                        )
                )
            }
        }

        Spacer(modifier = Modifier.height(4.dp))
        Divider(color = Color(0xFFF0F0F0), thickness = 6.dp)
    }
}

// ────────────────────────────────────────────────────────────
// FEATURED CARD — Hero (large) and regular sizes
// ────────────────────────────────────────────────────────────
@Composable
fun FeaturedCard(
    post: Post,
    isHero: Boolean,
    onClick: () -> Unit
) {
    val cardWidth  = if (isHero) 300.dp else 240.dp
    val cardHeight = if (isHero) 200.dp else 170.dp

    // Pulsing glow animation for hero card
    val infiniteTransition = rememberInfiniteTransition(label = "glow")
    val glowAlpha by infiniteTransition.animateFloat(
        initialValue = 0.5f,
        targetValue  = 0.9f,
        animationSpec = infiniteRepeatable(
            animation   = tween(1200, easing = EaseInOutSine),
            repeatMode  = RepeatMode.Reverse
        ),
        label = "glowAlpha"
    )

    Box(
        modifier = Modifier
            .width(cardWidth)
            .height(cardHeight)
    ) {
        // Glowing outer border for hero card
        if (isHero) {
            Box(
                modifier = Modifier
                    .matchParentSize()
                    .graphicsLayer { alpha = glowAlpha }
                    .background(
                        Brush.linearGradient(listOf(GradientStart, GradientEnd)),
                        RoundedCornerShape(22.dp)
                    )
                    .padding(2.dp)
            )
        }

        Card(
            shape = RoundedCornerShape(20.dp),
            elevation = CardDefaults.cardElevation(
                defaultElevation = if (isHero) 10.dp else 5.dp
            ),
            modifier = Modifier
                .matchParentSize()
                .padding(if (isHero) 2.dp else 0.dp)   // inset from glow border
                .shadow(if (isHero) 12.dp else 4.dp, RoundedCornerShape(20.dp))
                .clickable { onClick() }
        ) {
            Box(modifier = Modifier.fillMaxSize()) {

                // Background image
                AsyncImage(
                    model = post.backgroundImageUrl,
                    contentDescription = post.quoteText,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier.fillMaxSize()
                )

                // Dark gradient overlay
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(
                            Brush.verticalGradient(
                                0f   to Color.Black.copy(alpha = 0.0f),
                                0.4f to Color.Black.copy(alpha = 0.25f),
                                1f   to Color.Black.copy(alpha = 0.85f)
                            )
                        )
                )

                // ── "Editor's Pick" badge (top-left) ──
                if (isHero) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier
                            .align(Alignment.TopStart)
                            .padding(10.dp)
                            .background(
                                Brush.horizontalGradient(listOf(GradientStart, GradientEnd)),
                                RoundedCornerShape(50.dp)
                            )
                            .padding(horizontal = 10.dp, vertical = 4.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Filled.Star,
                            contentDescription = "Featured",
                            tint = Color.White,
                            modifier = Modifier.size(11.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = "Editor's Pick",
                            color = Color.White,
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            letterSpacing = 0.5.sp
                        )
                    }
                } else {
                    // Smaller "Featured" pill for non-hero cards
                    Box(
                        modifier = Modifier
                            .align(Alignment.TopStart)
                            .padding(8.dp)
                            .background(
                                PrimaryPink.copy(alpha = 0.9f),
                                RoundedCornerShape(50.dp)
                            )
                            .padding(horizontal = 8.dp, vertical = 3.dp)
                    ) {
                        Text(
                            text = "✨ Featured",
                            color = Color.White,
                            fontSize = 9.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }

                // ── Quote text + author at bottom ──
                Column(
                    modifier = Modifier
                        .align(Alignment.BottomStart)
                        .padding(14.dp)
                ) {
                    Text(
                        text = post.quoteText,
                        color = Color.White,
                        fontFamily   = if (isHero) FontFamily.Serif else FontFamily.Default,
                        fontStyle    = FontStyle.Italic,
                        fontWeight   = FontWeight.SemiBold,
                        fontSize     = if (isHero) 14.sp else 12.sp,
                        lineHeight   = if (isHero) 20.sp else 17.sp,
                        maxLines     = 3,
                        overflow     = TextOverflow.Ellipsis
                    )
                    Spacer(modifier = Modifier.height(6.dp))

                    Row(verticalAlignment = Alignment.CenterVertically) {
                        // Author avatar
                        AsyncImage(
                            model = post.authorAvatarUrl,
                            contentDescription = post.authorName,
                            contentScale = ContentScale.Crop,
                            modifier = Modifier
                                .size(22.dp)
                                .clip(CircleShape)
                                .border(1.5.dp, Color.White, CircleShape)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = post.authorName,
                            color = Color.White.copy(alpha = 0.9f),
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Medium,
                            modifier = Modifier.weight(1f)
                        )
                        // Likes count
                        Icon(
                            imageVector = Icons.Filled.Favorite,
                            contentDescription = "Likes",
                            tint = Color(0xFFFF6B8A),
                            modifier = Modifier.size(13.dp)
                        )
                        Spacer(modifier = Modifier.width(3.dp))
                        Text(
                            text = "${post.likesCount}",
                            color = Color.White,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
        }
    }
}

// ── Animated sparkle / star icon ──
@Composable
private fun SparkleIcon() {
    val infiniteTransition = rememberInfiniteTransition(label = "sparkle")
    val scale by infiniteTransition.animateFloat(
        initialValue = 0.8f,
        targetValue  = 1.2f,
        animationSpec = infiniteRepeatable(
            animation   = tween(800, easing = EaseInOutSine),
            repeatMode  = RepeatMode.Reverse
        ),
        label = "sparkleScale"
    )
    Text(
        text = "💖",
        fontSize = 18.sp,
        modifier = Modifier.graphicsLayer { scaleX = scale; scaleY = scale }
    )
}
