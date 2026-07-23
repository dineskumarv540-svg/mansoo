package com.mansoo.app.ui.screens.notifications

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ChatBubble
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.PersonAdd
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.mansoo.app.data.model.NotificationItem
import com.mansoo.app.data.model.NotificationType
import com.mansoo.app.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun NotificationsScreen(
    notifications: List<NotificationItem>
) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Notifications", fontWeight = FontWeight.Bold, color = PrimaryPink) },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MaterialTheme.colorScheme.surface)
            )
        }
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .background(BackgroundLight)
        ) {
            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                contentPadding = PaddingValues(bottom = 80.dp)
            ) {
                items(notifications) { item ->
                    Card(
                        colors = CardDefaults.cardColors(containerColor = Color.White),
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 12.dp, vertical = 4.dp)
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(12.dp)
                        ) {
                            Box(contentAlignment = Alignment.BottomEnd) {
                                AsyncImage(
                                    model = item.actorAvatarUrl,
                                    contentDescription = item.actorName,
                                    contentScale = ContentScale.Crop,
                                    modifier = Modifier
                                        .size(46.dp)
                                        .clip(CircleShape)
                                )
                                Icon(
                                    imageVector = when (item.type) {
                                        NotificationType.LIKE -> Icons.Filled.Favorite
                                        NotificationType.COMMENT -> Icons.Filled.ChatBubble
                                        NotificationType.FOLLOW -> Icons.Filled.PersonAdd
                                        NotificationType.FEATURED -> Icons.Filled.Star
                                    },
                                    contentDescription = null,
                                    tint = when (item.type) {
                                        NotificationType.LIKE -> LikeRed
                                        NotificationType.COMMENT -> PrimaryPink
                                        NotificationType.FOLLOW -> VerifiedBlue
                                        NotificationType.FEATURED -> GoldPremium
                                    },
                                    modifier = Modifier
                                        .size(16.dp)
                                        .background(Color.White, CircleShape)
                                )
                            }

                            Spacer(modifier = Modifier.width(12.dp))

                            Column(modifier = Modifier.weight(1f)) {
                                Row {
                                    Text(text = item.actorName, fontWeight = FontWeight.Bold, fontSize = 13.sp, color = TextPrimary)
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text(
                                        text = when (item.type) {
                                            NotificationType.LIKE -> "liked your quote"
                                            NotificationType.COMMENT -> "commented: \"${item.postTitleSnippet}\""
                                            NotificationType.FOLLOW -> "started following you"
                                            NotificationType.FEATURED -> item.postTitleSnippet
                                        },
                                        fontSize = 13.sp,
                                        color = TextSecondary
                                    )
                                }
                                Text(text = item.timeAgo, fontSize = 11.sp, color = TextMuted)
                            }
                        }
                    }
                }
            }
        }
    }
}
