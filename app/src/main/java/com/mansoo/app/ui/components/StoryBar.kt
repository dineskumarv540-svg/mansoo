package com.mansoo.app.ui.components

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.mansoo.app.data.model.User
import com.mansoo.app.ui.theme.*

@Composable
fun StoryBar(
    stories        : List<User>,
    onAddStoryClick: () -> Unit = {},
    onStoryClick   : (User) -> Unit = {}
) {
    LazyRow(
        contentPadding      = PaddingValues(horizontal = 16.dp, vertical = 12.dp),
        horizontalArrangement = Arrangement.spacedBy(16.dp),
        modifier            = Modifier.fillMaxWidth()
    ) {
        // ── "Add Story" item ──────────────────────────────────
        item {
            StoryBubble(
                imageUrl  = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200",
                label     = "Add Story",
                isAdd     = true,
                isViewed  = false,
                onClick   = onAddStoryClick
            )
        }

        // ── Friends' stories ──────────────────────────────────
        items(stories) { user ->
            StoryBubble(
                imageUrl  = user.avatarUrl,
                label     = user.name.split(" ").firstOrNull() ?: user.name,
                isAdd     = false,
                isViewed  = false,          // false = unviewed = full gradient ring
                isVerified = user.isVerified,
                onClick   = { onStoryClick(user) }
            )
        }
    }
}

// ─────────────────────────────────────────────────────────────
// STORY BUBBLE — avatar + animated gradient border ring
// ─────────────────────────────────────────────────────────────
@Composable
private fun StoryBubble(
    imageUrl   : String,
    label      : String,
    isAdd      : Boolean      = false,
    isViewed   : Boolean      = false,
    isVerified : Boolean      = false,
    onClick    : () -> Unit   = {}
) {
    // Press micro-interaction
    val interactionSource = remember { MutableInteractionSource() }
    val isPressed by interactionSource.collectIsPressedAsState()
    val pressScale by animateFloatAsState(
        targetValue   = if (isPressed) 0.92f else 1f,
        animationSpec = spring(Spring.DampingRatioMediumBouncy, Spring.StiffnessHigh),
        label         = "storyPress"
    )

    // Sweeping gradient animation for unviewed stories
    val infiniteTransition = rememberInfiniteTransition(label = "storyRing_$label")
    val sweepOffset by infiniteTransition.animateFloat(
        initialValue  = 0f,
        targetValue   = 360f,
        animationSpec = infiniteRepeatable(tween(3000, easing = LinearEasing)),
        label         = "sweep"
    )

    // Ring brush — animated sweep for unviewed, grey for viewed, plus badge for add
    val ringBrush: Brush = when {
        isAdd     -> Brush.linearGradient(listOf(AccentPink, PrimaryGreen))
        isViewed  -> Brush.linearGradient(listOf(Color(0xFFCCCCCC), Color(0xFFCCCCCC)))
        isVerified -> Brush.sweepGradient(
            listOf(PrimaryGreen, PrimaryGreenLight, AccentPink, PrimaryGreen)
        )
        else -> Brush.sweepGradient(
            // Story gradient: pink → orange → purple → pink
            listOf(
                AccentPink,
                Color(0xFFFFB347),
                Color(0xFFDA22FF),
                Color(0xFF9733EE),
                AccentPink
            )
        )
    }

    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier
            .scale(pressScale)
            .clickable(
                interactionSource = interactionSource,
                indication        = null,
                onClick           = onClick
            )
    ) {
        Box(
            contentAlignment = Alignment.Center,
            modifier         = Modifier.size(72.dp)
        ) {
            // Outer animated gradient ring
            Box(
                modifier = Modifier
                    .matchParentSize()
                    .clip(CircleShape)
                    .background(ringBrush)
            )
            // White gap between ring and avatar
            Box(
                modifier = Modifier
                    .size(66.dp)
                    .clip(CircleShape)
                    .background(Color.White)
            )
            // Avatar
            AsyncImage(
                model              = imageUrl,
                contentDescription = label,
                contentScale       = ContentScale.Crop,
                modifier           = Modifier
                    .size(60.dp)
                    .clip(CircleShape)
            )
            // "+" badge for Add Story
            if (isAdd) {
                Box(
                    contentAlignment = Alignment.Center,
                    modifier = Modifier
                        .align(Alignment.BottomEnd)
                        .size(22.dp)
                        .clip(CircleShape)
                        .background(
                            Brush.linearGradient(listOf(PrimaryGreen, AccentPink))
                        )
                        .border(2.dp, Color.White, CircleShape)
                ) {
                    Icon(
                        Icons.Filled.Add,
                        "Add",
                        tint     = Color.White,
                        modifier = Modifier.size(13.dp)
                    )
                }
            }

            // Verified dot badge
            if (!isAdd && isVerified) {
                Box(
                    modifier = Modifier
                        .align(Alignment.BottomEnd)
                        .size(16.dp)
                        .clip(CircleShape)
                        .background(VerifiedBlue)
                        .border(2.dp, Color.White, CircleShape)
                )
            }
        }

        Spacer(Modifier.height(5.dp))

        Text(
            label,
            fontSize   = 11.sp,
            fontWeight = FontWeight.Medium,
            color      = TextPrimary,
            maxLines   = 1,
            overflow   = TextOverflow.Ellipsis,
            modifier   = Modifier.widthIn(max = 64.dp)
        )
    }
}
