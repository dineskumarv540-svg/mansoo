package com.mansoo.app.ui.screens.profile

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.material3.TabRowDefaults.tabIndicatorOffset
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
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.mansoo.app.data.model.Post
import com.mansoo.app.ui.theme.*

// ── Profile data constants ───────────────────────────────────
private const val AVATAR_URL    = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400"
private const val COVER_URL     = "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1200"
private const val FULL_NAME     = "Aarav Sharma"
private const val HANDLE        = "@aarav_writes"
private const val BIO           = "Poet & Dreamer 🌙 | Author of 'Echoes of Silence' | Writing the language of the soul"
private const val WEBSITE       = "mansoo.in/aarav"

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProfileScreen(posts: List<Post>) {
    var selectedTab  by remember { mutableStateOf(0) }
    var isFollowing  by remember { mutableStateOf(false) }
    var showEditSheet by remember { mutableStateOf(false) }

    val userPosts  = remember(posts) { posts.filter { it.authorId == "u1" || it.authorName == FULL_NAME } }
    val savedPosts = remember(posts) { posts.filter { it.isSaved } }
    val likedPosts = remember(posts) { posts.filter { it.isLiked } }

    val tabPosts = when (selectedTab) {
        1    -> savedPosts
        2    -> likedPosts
        else -> userPosts
    }

    // Pulsing gradient animation for avatar ring
    val infiniteTransition = rememberInfiniteTransition(label = "avatarRing")
    val ringPhase by infiniteTransition.animateFloat(
        initialValue = 0f, targetValue = 1f,
        animationSpec = infiniteRepeatable(tween(2000, easing = LinearEasing)),
        label = "ringPhase"
    )

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        HANDLE,
                        fontWeight = FontWeight.Bold,
                        fontSize   = 16.sp,
                        color      = TextPrimary
                    )
                },
                actions = {
                    IconButton(onClick = { }) {
                        Icon(Icons.Outlined.IosShare, "Share Profile", tint = TextPrimary)
                    }
                    IconButton(onClick = { }) {
                        Icon(Icons.Filled.Settings, "Settings", tint = TextPrimary)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = Color.White)
            )
        }
    ) { padding ->

        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .background(BackgroundLight),
            contentPadding = PaddingValues(bottom = 90.dp)
        ) {

            // ══════════════════════════════════════════════════
            // 1. COVER + AVATAR HEADER
            // ══════════════════════════════════════════════════
            item {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(Color.White)
                ) {
                    // Cover photo
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(160.dp)
                    ) {
                        AsyncImage(
                            model        = COVER_URL,
                            contentDescription = "Cover",
                            contentScale = ContentScale.Crop,
                            modifier     = Modifier.fillMaxSize()
                        )
                        // Gradient fade to white at bottom
                        Box(
                            modifier = Modifier
                                .fillMaxSize()
                                .background(
                                    Brush.verticalGradient(
                                        0f   to Color.Transparent,
                                        0.6f to Color.Transparent,
                                        1f   to Color.White
                                    )
                                )
                        )
                    }

                    // Avatar positioned overlapping cover
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(top = 100.dp, bottom = 20.dp)
                    ) {

                        // ── Avatar with animated gradient ring ──
                        Box(
                            contentAlignment = Alignment.BottomEnd,
                            modifier = Modifier.size(102.dp)
                        ) {
                            // Outer animated gradient ring
                            Box(
                                modifier = Modifier
                                    .matchParentSize()
                                    .clip(CircleShape)
                                    .background(
                                        Brush.sweepGradient(
                                            listOf(
                                                GradientStart,
                                                GradientEnd,
                                                Color(0xFFFFD200),
                                                GradientStart
                                            )
                                        )
                                    )
                            )
                            // White gap ring
                            Box(
                                modifier = Modifier
                                    .size(96.dp)
                                    .align(Alignment.Center)
                                    .clip(CircleShape)
                                    .background(Color.White)
                            )
                            // Avatar image
                            AsyncImage(
                                model        = AVATAR_URL,
                                contentDescription = "Avatar",
                                contentScale = ContentScale.Crop,
                                modifier     = Modifier
                                    .size(90.dp)
                                    .align(Alignment.Center)
                                    .clip(CircleShape)
                            )
                            // Camera icon badge
                            Box(
                                contentAlignment = Alignment.Center,
                                modifier = Modifier
                                    .size(28.dp)
                                    .clip(CircleShape)
                                    .background(
                                        Brush.linearGradient(listOf(GradientStart, GradientEnd))
                                    )
                                    .border(2.dp, Color.White, CircleShape)
                            ) {
                                Icon(
                                    Icons.Filled.CameraAlt,
                                    "Change Photo",
                                    tint     = Color.White,
                                    modifier = Modifier.size(14.dp)
                                )
                            }
                        }

                        Spacer(Modifier.height(12.dp))

                        // ── Name + Verified ──
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.Center
                        ) {
                            Text(
                                FULL_NAME,
                                fontWeight = FontWeight.ExtraBold,
                                fontSize   = 22.sp,
                                color      = TextPrimary
                            )
                            Spacer(Modifier.width(6.dp))
                            Icon(
                                Icons.Filled.CheckCircle,
                                "Verified",
                                tint     = VerifiedBlue,
                                modifier = Modifier.size(18.dp)
                            )
                            Spacer(Modifier.width(4.dp))
                            // Premium crown badge
                            Box(
                                modifier = Modifier
                                    .background(
                                        Brush.horizontalGradient(
                                            listOf(Color(0xFFFFB300), Color(0xFFFFA000))
                                        ),
                                        RoundedCornerShape(6.dp)
                                    )
                                    .padding(horizontal = 5.dp, vertical = 2.dp)
                            ) {
                                Text("PRO", fontSize = 8.sp, fontWeight = FontWeight.ExtraBold, color = Color.White)
                            }
                        }

                        Spacer(Modifier.height(4.dp))

                        // Handle
                        Text(
                            HANDLE,
                            fontSize = 13.sp,
                            color    = TextSecondary,
                            fontWeight = FontWeight.Medium
                        )

                        Spacer(Modifier.height(8.dp))

                        // ── Bio ──
                        Text(
                            BIO,
                            fontSize   = 13.sp,
                            color      = TextPrimary,
                            lineHeight = 20.sp,
                            textAlign  = TextAlign.Center,
                            modifier   = Modifier.padding(horizontal = 24.dp)
                        )

                        Spacer(Modifier.height(6.dp))

                        // Website link
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                Icons.Outlined.Link,
                                null,
                                tint     = GradientStart,
                                modifier = Modifier.size(14.dp)
                            )
                            Spacer(Modifier.width(4.dp))
                            Text(
                                WEBSITE,
                                fontSize   = 13.sp,
                                color      = GradientStart,
                                fontWeight = FontWeight.SemiBold
                            )
                        }

                        Spacer(Modifier.height(16.dp))

                        // ── Stats Row ──
                        Row(
                            horizontalArrangement = Arrangement.SpaceEvenly,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            ProfileStat("Posts",     "${userPosts.size + 480}")
                            StatDivider()
                            ProfileStat("Followers", "14.2K")
                            StatDivider()
                            ProfileStat("Following", "312")
                        }

                        Spacer(Modifier.height(16.dp))

                        // ── Edit Profile + Follow Buttons ──
                        Row(
                            horizontalArrangement = Arrangement.spacedBy(10.dp),
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(horizontal = 20.dp)
                        ) {
                            // Edit Profile
                            OutlinedButton(
                                onClick  = { showEditSheet = true },
                                shape    = RoundedCornerShape(12.dp),
                                modifier = Modifier
                                    .weight(1f)
                                    .height(42.dp)
                            ) {
                                Icon(
                                    Icons.Filled.Edit,
                                    null,
                                    modifier = Modifier.size(16.dp)
                                )
                                Spacer(Modifier.width(6.dp))
                                Text(
                                    "Edit Profile",
                                    fontWeight = FontWeight.SemiBold,
                                    fontSize   = 14.sp
                                )
                            }

                            // Share profile
                            OutlinedButton(
                                onClick  = { },
                                shape    = RoundedCornerShape(12.dp),
                                modifier = Modifier
                                    .weight(1f)
                                    .height(42.dp)
                            ) {
                                Icon(
                                    Icons.Outlined.PersonAdd,
                                    null,
                                    modifier = Modifier.size(16.dp)
                                )
                                Spacer(Modifier.width(6.dp))
                                Text(
                                    "Share",
                                    fontWeight = FontWeight.SemiBold,
                                    fontSize   = 14.sp
                                )
                            }
                        }

                        Spacer(Modifier.height(16.dp))
                    }
                }
            }

            // ══════════════════════════════════════════════════
            // 2. HIGHLIGHTS ROW (Story Highlights)
            // ══════════════════════════════════════════════════
            item {
                Surface(color = Color.White) {
                    Column {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(horizontal = 16.dp, vertical = 10.dp),
                            horizontalArrangement = Arrangement.spacedBy(16.dp)
                        ) {
                            HighlightBubble(label = "📖 Poetry",  url = AVATAR_URL)
                            HighlightBubble(label = "🌙 Night",   url = "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=200")
                            HighlightBubble(label = "🌿 Nature",  url = "https://images.unsplash.com/photo-1448375240586-882707db888b?w=200")
                            HighlightBubble(label = "❤️ Love",    url = "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=200")
                            HighlightBubble(label = "+ New",      url = null, isAdd = true)
                        }
                        Divider(color = Color(0xFFF0F0F0))
                    }
                }
            }

            // ══════════════════════════════════════════════════
            // 3. TAB ROW
            // ══════════════════════════════════════════════════
            item {
                Surface(
                    color          = Color.White,
                    shadowElevation = 2.dp
                ) {
                    TabRow(
                        selectedTabIndex = selectedTab,
                        containerColor   = Color.White,
                        contentColor     = PrimaryPink,
                        indicator        = { tabPositions ->
                            TabRowDefaults.Indicator(
                                modifier = Modifier
                                    .tabIndicatorOffset(tabPositions[selectedTab])
                                    .height(3.dp),
                                color    = PrimaryPink
                            )
                        }
                    ) {
                        ProfileTab(Icons.Filled.GridOn,        "Posts",  selectedTab == 0) { selectedTab = 0 }
                        ProfileTab(Icons.Outlined.BookmarkBorder, "Saved", selectedTab == 1) { selectedTab = 1 }
                        ProfileTab(Icons.Outlined.FavoriteBorder, "Liked", selectedTab == 2) { selectedTab = 2 }
                    }
                }
            }

            // ══════════════════════════════════════════════════
            // 4. POST GRID
            // ══════════════════════════════════════════════════
            if (tabPosts.isEmpty()) {
                item { EmptyTabPlaceholder(selectedTab) }
            } else {
                item {
                    // Non-lazy 3-column grid (inside LazyColumn item)
                    val columns = 3
                    val rows    = (tabPosts.size + columns - 1) / columns
                    Column {
                        repeat(rows) { row ->
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(2.dp)
                            ) {
                                repeat(columns) { col ->
                                    val idx  = row * columns + col
                                    val post = tabPosts.getOrNull(idx)
                                    if (post != null) {
                                        PostGridCell(
                                            post     = post,
                                            modifier = Modifier.weight(1f)
                                        )
                                    } else {
                                        Spacer(Modifier.weight(1f))
                                    }
                                }
                            }
                            Spacer(Modifier.height(2.dp))
                        }
                    }
                }
            }
        }
    }

    // ── Edit Profile Bottom Sheet ─────────────────────────────
    if (showEditSheet) {
        EditProfileSheet(onDismiss = { showEditSheet = false })
    }
}

// ─────────────────────────────────────────────────────────────
// GRID CELL — 3-column post thumbnail
// ─────────────────────────────────────────────────────────────
@Composable
private fun PostGridCell(post: Post, modifier: Modifier = Modifier) {
    Box(
        modifier = modifier
            .aspectRatio(1f)
            .background(Color(0xFF222222))
            .clickable { }
    ) {
        if (post.backgroundImageUrl.isNotEmpty()) {
            AsyncImage(
                model        = post.backgroundImageUrl,
                contentDescription = post.quoteText,
                contentScale = ContentScale.Crop,
                modifier     = Modifier.fillMaxSize()
            )
            // Subtle text overlay
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(Color.Black.copy(alpha = 0.20f))
            )
        } else {
            // Gradient card if no image
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(
                        Brush.linearGradient(listOf(GradientStart, GradientEnd))
                    )
            )
            Text(
                post.quoteText,
                color     = Color.White,
                fontSize  = 9.sp,
                maxLines  = 4,
                overflow  = TextOverflow.Ellipsis,
                textAlign = TextAlign.Center,
                modifier  = Modifier
                    .align(Alignment.Center)
                    .padding(6.dp)
            )
        }

        // Likes badge (bottom-left)
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier
                .align(Alignment.BottomStart)
                .padding(4.dp)
        ) {
            Icon(
                Icons.Filled.Favorite,
                null,
                tint     = Color.White,
                modifier = Modifier.size(10.dp)
            )
            Spacer(Modifier.width(2.dp))
            Text(
                "${post.likesCount}",
                color    = Color.White,
                fontSize = 9.sp,
                fontWeight = FontWeight.Bold
            )
        }

        // Featured star
        if (post.isFeatured) {
            Icon(
                Icons.Filled.Star,
                null,
                tint     = Color(0xFFFFD700),
                modifier = Modifier
                    .align(Alignment.TopEnd)
                    .padding(4.dp)
                    .size(12.dp)
            )
        }
    }
}

// ─────────────────────────────────────────────────────────────
// STORY HIGHLIGHT BUBBLE
// ─────────────────────────────────────────────────────────────
@Composable
private fun HighlightBubble(label: String, url: String?, isAdd: Boolean = false) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier.width(64.dp)
    ) {
        Box(
            contentAlignment = Alignment.Center,
            modifier = Modifier
                .size(60.dp)
                .background(
                    if (isAdd) Color(0xFFF0F0F0)
                    else Brush.sweepGradient(listOf(GradientStart, GradientEnd, Color(0xFFFFD200), GradientStart)).let { Color.Transparent },
                    CircleShape
                )
                .border(
                    width = 2.dp,
                    brush = Brush.sweepGradient(listOf(GradientStart, GradientEnd, Color(0xFFFFD200), GradientStart)),
                    shape = CircleShape
                )
                .clickable { }
        ) {
            if (isAdd) {
                Icon(Icons.Filled.Add, null, tint = TextSecondary, modifier = Modifier.size(28.dp))
            } else if (url != null) {
                AsyncImage(
                    model = url,
                    contentDescription = label,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier
                        .size(54.dp)
                        .clip(CircleShape)
                )
            }
        }
        Spacer(Modifier.height(4.dp))
        Text(
            label,
            fontSize  = 10.sp,
            color     = TextSecondary,
            maxLines  = 1,
            overflow  = TextOverflow.Ellipsis,
            textAlign = TextAlign.Center
        )
    }
}

// ─────────────────────────────────────────────────────────────
// STAT COLUMN
// ─────────────────────────────────────────────────────────────
@Composable
private fun ProfileStat(label: String, value: String) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier            = Modifier.clickable { }
    ) {
        Text(
            value,
            fontWeight = FontWeight.ExtraBold,
            fontSize   = 20.sp,
            color      = TextPrimary
        )
        Text(
            label,
            fontSize = 12.sp,
            color    = TextSecondary
        )
    }
}

@Composable
private fun StatDivider() {
    Box(
        modifier = Modifier
            .width(1.dp)
            .height(32.dp)
            .background(Color(0xFFE0E0E0))
    )
}

// ─────────────────────────────────────────────────────────────
// TAB ITEM
// ─────────────────────────────────────────────────────────────
@Composable
private fun ProfileTab(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    label: String,
    isSelected: Boolean,
    onClick: () -> Unit
) {
    Tab(
        selected = isSelected,
        onClick  = onClick,
        icon     = {
            Icon(
                icon,
                label,
                tint     = if (isSelected) PrimaryPink else TextSecondary,
                modifier = Modifier.size(22.dp)
            )
        }
    )
}

// ─────────────────────────────────────────────────────────────
// EMPTY STATE
// ─────────────────────────────────────────────────────────────
@Composable
private fun EmptyTabPlaceholder(tab: Int) {
    val (emoji, text) = when (tab) {
        1    -> "🔖" to "No saved posts yet.\nTap the bookmark icon on any post!"
        2    -> "❤️" to "No liked posts yet.\nExplore and show some love!"
        else -> "✍️" to "No posts yet.\nShare your first quote!"
    }
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier
            .fillMaxWidth()
            .padding(60.dp)
    ) {
        Text(emoji, fontSize = 48.sp)
        Spacer(Modifier.height(12.dp))
        Text(
            text,
            fontSize   = 14.sp,
            color      = TextSecondary,
            textAlign  = TextAlign.Center,
            lineHeight = 22.sp
        )
    }
}

// ─────────────────────────────────────────────────────────────
// EDIT PROFILE BOTTOM SHEET
// ─────────────────────────────────────────────────────────────
@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun EditProfileSheet(onDismiss: () -> Unit) {
    var name     by remember { mutableStateOf(FULL_NAME) }
    var handle   by remember { mutableStateOf(HANDLE) }
    var bio      by remember { mutableStateOf(BIO) }
    var website  by remember { mutableStateOf(WEBSITE) }

    ModalBottomSheet(
        onDismissRequest = onDismiss,
        shape = RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp),
        containerColor = Color.White
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp)
                .padding(bottom = 40.dp)
        ) {
            // Handle indicator
            Box(
                modifier = Modifier
                    .width(40.dp)
                    .height(4.dp)
                    .background(Color(0xFFDDDDDD), CircleShape)
                    .align(Alignment.CenterHorizontally)
            )
            Spacer(Modifier.height(16.dp))

            Text(
                "Edit Profile",
                fontWeight = FontWeight.ExtraBold,
                fontSize   = 20.sp,
                color      = TextPrimary
            )

            Spacer(Modifier.height(20.dp))

            // Avatar change row
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.fillMaxWidth()
            ) {
                Box(contentAlignment = Alignment.BottomEnd) {
                    AsyncImage(
                        model = AVATAR_URL,
                        contentDescription = null,
                        contentScale = ContentScale.Crop,
                        modifier = Modifier
                            .size(70.dp)
                            .clip(CircleShape)
                            .border(2.dp,
                                Brush.linearGradient(listOf(GradientStart, GradientEnd)),
                                CircleShape)
                    )
                    Box(
                        contentAlignment = Alignment.Center,
                        modifier = Modifier
                            .size(24.dp)
                            .clip(CircleShape)
                            .background(Brush.linearGradient(listOf(GradientStart, GradientEnd)))
                            .border(2.dp, Color.White, CircleShape)
                    ) {
                        Icon(Icons.Filled.CameraAlt, null, tint = Color.White, modifier = Modifier.size(12.dp))
                    }
                }
                Spacer(Modifier.width(16.dp))
                Text(
                    "Change Profile Photo",
                    color    = GradientStart,
                    fontWeight = FontWeight.SemiBold,
                    fontSize = 14.sp,
                    modifier = Modifier.clickable { }
                )
            }

            Spacer(Modifier.height(20.dp))

            listOf(
                Triple("Full Name",  name,    { v: String -> name    = v }),
                Triple("Username",   handle,  { v: String -> handle  = v }),
                Triple("Bio",        bio,     { v: String -> bio     = v }),
                Triple("Website",    website, { v: String -> website = v })
            ).forEach { (label, value, onChange) ->
                OutlinedTextField(
                    value         = value,
                    onValueChange = onChange,
                    label         = { Text(label) },
                    shape         = RoundedCornerShape(14.dp),
                    singleLine    = label != "Bio",
                    maxLines      = if (label == "Bio") 3 else 1,
                    colors        = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor   = PrimaryPink,
                        focusedContainerColor = Color.White,
                        unfocusedContainerColor = Color.White
                    ),
                    modifier = Modifier.fillMaxWidth()
                )
                Spacer(Modifier.height(12.dp))
            }

            Spacer(Modifier.height(8.dp))

            Button(
                onClick = onDismiss,
                shape   = RoundedCornerShape(16.dp),
                colors  = ButtonDefaults.buttonColors(containerColor = Color.Transparent),
                contentPadding = PaddingValues(0.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(52.dp)
                    .background(
                        Brush.horizontalGradient(listOf(GradientStart, GradientEnd)),
                        RoundedCornerShape(16.dp)
                    )
            ) {
                Icon(Icons.Filled.Check, null, tint = Color.White)
                Spacer(Modifier.width(8.dp))
                Text(
                    "Save Changes",
                    fontWeight = FontWeight.Bold,
                    fontSize   = 16.sp,
                    color      = Color.White
                )
            }
        }
    }
}


