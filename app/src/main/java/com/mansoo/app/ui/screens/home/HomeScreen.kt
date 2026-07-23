package com.mansoo.app.ui.screens.home

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Menu
import androidx.compose.material.icons.outlined.Notifications
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mansoo.app.data.model.Post
import com.mansoo.app.data.model.User
import com.mansoo.app.ui.components.FeaturedSection
import com.mansoo.app.ui.components.PostCard
import com.mansoo.app.ui.components.PostOptionsMenu
import com.mansoo.app.ui.components.StoryBar
import com.mansoo.app.ui.components.UserSuggestionsSection
import com.mansoo.app.ui.theme.*

private val DarkGreen = Color(0xFF0F3D3E)

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
                        text = "Mansoo",
                        fontFamily = FontFamily.Serif,
                        style = MaterialTheme.typography.headlineMedium.copy(
                            fontWeight = FontWeight.Bold,
                            color = DarkGreen
                        )
                    )
                },
                navigationIcon = {
                    IconButton(onClick = onOpenDrawer) {
                        Icon(
                            imageVector = Icons.Filled.Menu,
                            contentDescription = "Menu ☰",
                            tint = TextPrimary
                        )
                    }
                },
                actions = {
                    Box(modifier = Modifier.padding(end = 8.dp)) {
                        IconButton(onClick = onOpenNotifications) {
                            Icon(
                                imageVector = Icons.Outlined.Notifications,
                                contentDescription = "Notification 🔔",
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
                // 1. Stories Row (Horizontal scroll, circular avatars with gradient/blue border, first: "+ Add Story")
                item {
                    StoryBar(
                        stories = stories,
                        onAddStoryClick = { snackbarMessage = "Open Story Creator" }
                    )
                    Divider(color = Color.Black.copy(alpha = 0.05f))
                }

                // 2. "💖 Our Best Posts 💖" — Premium Featured Section
                item {
                    FeaturedSection(
                        featuredPosts = featuredPosts,
                        onPostClick = { /* Navigate to post detail */ }
                    )
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
