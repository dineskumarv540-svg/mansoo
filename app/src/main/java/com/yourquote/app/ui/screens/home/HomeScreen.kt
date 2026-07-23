package com.yourquote.app.ui.screens.home

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Menu
import androidx.compose.material.icons.outlined.Notifications
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.yourquote.app.data.model.Post
import com.yourquote.app.data.model.User
import com.yourquote.app.ui.components.PostCard
import com.yourquote.app.ui.components.PostOptionsMenu
import com.yourquote.app.ui.components.StoryBar
import com.yourquote.app.ui.components.UserSuggestionsSection
import com.yourquote.app.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    posts: List<Post>,
    stories: List<User>,
    suggestedUsers: List<User>,
    onOpenNotifications: () -> Unit = {},
    onOpenDrawer: () -> Unit = {}
) {
    var selectedPostForOptions by remember { mutableStateOf<Post?>(null) }
    var snackbarMessage by remember { mutableStateOf<String?>(null) }

    val featuredPosts = remember(posts) { posts.filter { it.isFeatured } }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = "YourQuote",
                        style = MaterialTheme.typography.headlineMedium.copy(
                            fontWeight = FontWeight.Bold,
                            color = PrimaryPink
                        )
                    )
                },
                navigationIcon = {
                    IconButton(onClick = onOpenDrawer) {
                        Icon(
                            imageVector = Icons.Filled.Menu,
                            contentDescription = "Menu",
                            tint = TextPrimary
                        )
                    }
                },
                actions = {
                    Box(modifier = Modifier.padding(end = 8.dp)) {
                        IconButton(onClick = onOpenNotifications) {
                            Icon(
                                imageVector = Icons.Outlined.Notifications,
                                contentDescription = "Notifications",
                                tint = TextPrimary
                            )
                        }
                        // Notification Badge Count
                        Badge(
                            containerColor = PrimaryPink,
                            modifier = Modifier
                                .align(Alignment.TopEnd)
                                .padding(top = 8.dp, end = 8.dp)
                        ) {
                            Text("4", color = Color.White, fontSize = 10.sp)
                        }
                    }
                },
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
                // 1. Stories Row
                item {
                    StoryBar(stories = stories)
                    Divider(color = Color.Black.copy(alpha = 0.05f))
                }

                // 2. "💖 Our Best Posts 💖" Highlighted Featured Posts
                if (featuredPosts.isNotEmpty()) {
                    item {
                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 8.dp)
                        ) {
                            Text(
                                text = "💖 Our Best Posts 💖",
                                style = MaterialTheme.typography.titleMedium.copy(
                                    fontWeight = FontWeight.Bold,
                                    color = PrimaryPink
                                ),
                                textAlign = TextAlign.Center,
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(vertical = 8.dp)
                            )

                            LazyRow(
                                contentPadding = PaddingValues(horizontal = 16.dp),
                                horizontalArrangement = Arrangement.spacedBy(14.dp)
                            ) {
                                items(featuredPosts) { featuredPost ->
                                    Card(
                                        shape = RoundedCornerShape(18.dp),
                                        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp),
                                        modifier = Modifier
                                            .width(260.dp)
                                            .height(160.dp)
                                            .clickable { }
                                    ) {
                                        Box(modifier = Modifier.fillMaxSize()) {
                                            AsyncImage(
                                                model = featuredPost.backgroundImageUrl,
                                                contentDescription = "Featured Post",
                                                contentScale = ContentScale.Crop,
                                                modifier = Modifier.fillMaxSize()
                                            )
                                            Box(
                                                modifier = Modifier
                                                    .fillMaxSize()
                                                    .background(
                                                        Brush.verticalGradient(
                                                            listOf(Color.Black.copy(alpha = 0.2f), Color.Black.copy(alpha = 0.8f))
                                                        )
                                                    )
                                            )
                                            Column(
                                                modifier = Modifier
                                                    .align(Alignment.BottomStart)
                                                    .padding(14.dp)
                                            ) {
                                                Text(
                                                    text = featuredPost.quoteText,
                                                    color = Color.White,
                                                    fontWeight = FontWeight.Bold,
                                                    fontSize = 13.sp,
                                                    maxLines = 2,
                                                    overflow = androidx.compose.ui.text.style.TextOverflow.Ellipsis
                                                )
                                                Spacer(modifier = Modifier.height(4.dp))
                                                Text(
                                                    text = "By ${featuredPost.authorName}",
                                                    color = Color.White.copy(alpha = 0.8f),
                                                    fontSize = 11.sp
                                                )
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                // 3. Post Feed & User Suggestions Insert
                items(posts.size) { index ->
                    val post = posts[index]
                    PostCard(
                        post = post,
                        onOptionsClick = { selectedPostForOptions = it }
                    )

                    // Insert User Suggestions carousel after 2nd post
                    if (index == 1 && suggestedUsers.isNotEmpty()) {
                        UserSuggestionsSection(users = suggestedUsers)
                    }
                }
            }

            // 3-Dot Options Bottom Sheet
            selectedPostForOptions?.let { post ->
                PostOptionsMenu(
                    post = post,
                    onDismiss = { selectedPostForOptions = null },
                    onActionSelected = { action ->
                        snackbarMessage = "Action: $action executed for post"
                    }
                )
            }

            // Toast / Snackbar feedback
            snackbarMessage?.let { msg ->
                Snackbar(
                    modifier = Modifier
                        .align(Alignment.BottomCenter)
                        .padding(16.dp),
                    action = {
                        TextButton(onClick = { snackbarMessage = null }) {
                            Text("OK", color = Color.White)
                        }
                    }
                ) {
                    Text(msg)
                }
            }
        }
    }
}
