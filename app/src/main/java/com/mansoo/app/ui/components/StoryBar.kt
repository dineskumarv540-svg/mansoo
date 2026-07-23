package com.mansoo.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.mansoo.app.data.model.User
import com.mansoo.app.ui.theme.GradientEnd
import com.mansoo.app.ui.theme.GradientStart
import com.mansoo.app.ui.theme.PrimaryPink
import com.mansoo.app.ui.theme.TextPrimary
import com.mansoo.app.ui.theme.VerifiedBlue

@Composable
fun StoryBar(
    stories: List<User>,
    onAddStoryClick: () -> Unit = {},
    onStoryClick: (User) -> Unit = {}
) {
    LazyRow(
        contentPadding = PaddingValues(horizontal = 16.dp, vertical = 12.dp),
        horizontalArrangement = Arrangement.spacedBy(16.dp),
        modifier = Modifier.fillMaxWidth()
    ) {
        // 1. First Item: "+ Add Story"
        item {
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier.clickable { onAddStoryClick() }
            ) {
                Box(
                    contentAlignment = Alignment.Center,
                    modifier = Modifier.size(68.dp)
                ) {
                    // Profile Image
                    AsyncImage(
                        model = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200",
                        contentDescription = "Add Story",
                        contentScale = ContentScale.Crop,
                        modifier = Modifier
                            .size(62.dp)
                            .clip(CircleShape)
                            .border(2.dp, Color.LightGray.copy(alpha = 0.5f), CircleShape)
                    )

                    // Plus icon (+) overlay badge
                    Box(
                        contentAlignment = Alignment.Center,
                        modifier = Modifier
                            .align(Alignment.BottomEnd)
                            .size(22.dp)
                            .clip(CircleShape)
                            .background(PrimaryPink)
                            .border(2.dp, Color.White, CircleShape)
                    ) {
                        Icon(
                            imageVector = Icons.Filled.Add,
                            contentDescription = "Add Story",
                            tint = Color.White,
                            modifier = Modifier.size(14.dp)
                        )
                    }
                }
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "+ Add Story",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = TextPrimary,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
            }
        }

        // 2. Friends Stories (Circular Avatars with Gradient/Blue Border)
        items(stories) { storyUser ->
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier.clickable { onStoryClick(storyUser) }
            ) {
                Box(
                    contentAlignment = Alignment.Center,
                    modifier = Modifier
                        .size(68.dp)
                        .border(
                            width = 2.5.dp,
                            brush = if (storyUser.isVerified) {
                                Brush.linearGradient(listOf(GradientStart, GradientEnd))
                            } else {
                                Brush.linearGradient(listOf(VerifiedBlue, PrimaryPink))
                            },
                            shape = CircleShape
                        )
                        .padding(3.dp)
                ) {
                    AsyncImage(
                        model = storyUser.avatarUrl,
                        contentDescription = storyUser.name,
                        contentScale = ContentScale.Crop,
                        modifier = Modifier
                            .fillMaxSize()
                            .clip(CircleShape)
                    )
                }
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = storyUser.name.split(" ").firstOrNull() ?: storyUser.name,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Medium,
                    color = TextPrimary,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
            }
        }
    }
}
