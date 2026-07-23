package com.mansoo.app.ui.screens.explore

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.staggeredgrid.LazyVerticalStaggeredGrid
import androidx.compose.foundation.lazy.staggeredgrid.StaggeredGridCells
import androidx.compose.foundation.lazy.staggeredgrid.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.mansoo.app.data.local.SampleData
import com.mansoo.app.data.model.Post
import com.mansoo.app.ui.components.PostCard
import com.mansoo.app.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ExploreScreen(
    posts: List<Post>,
    selectedHashtag: String,
    onHashtagSelected: (String) -> Unit
) {
    var searchQuery by remember { mutableStateOf("") }
    var clickedPostDetail by remember { mutableStateOf<Post?>(null) }

    val filteredPosts = remember(posts, selectedHashtag, searchQuery) {
        posts.filter { post ->
            val matchesTag = post.tags.any { it.equals(selectedHashtag.removePrefix("#"), ignoreCase = true) } || selectedHashtag == "#Trending"
            val matchesQuery = searchQuery.isEmpty() || post.quoteText.contains(searchQuery, ignoreCase = true) || post.authorName.contains(searchQuery, ignoreCase = true)
            matchesTag && matchesQuery
        }
    }

    Scaffold(
        topBar = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(MaterialTheme.colorScheme.surface)
                    .padding(horizontal = 16.dp, vertical = 8.dp)
            ) {
                // 1. Search Bar
                OutlinedTextField(
                    value = searchQuery,
                    onValueChange = { searchQuery = it },
                    placeholder = { Text("Search quotes, poets, hashtags...", fontSize = 14.sp) },
                    leadingIcon = { Icon(Icons.Filled.Search, contentDescription = "Search", tint = TextSecondary) },
                    trailingIcon = {
                        if (searchQuery.isNotEmpty()) {
                            IconButton(onClick = { searchQuery = "" }) {
                                Icon(Icons.Filled.Close, contentDescription = "Clear", tint = TextSecondary)
                            }
                        }
                    },
                    shape = RoundedCornerShape(24.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = PrimaryPink,
                        unfocusedBorderColor = Color.LightGray.copy(alpha = 0.5f),
                        focusedContainerColor = BackgroundLight,
                        unfocusedContainerColor = BackgroundLight
                    ),
                    singleLine = true,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(52.dp)
                )

                Spacer(modifier = Modifier.height(10.dp))

                // 2. Hashtag Filter Pills Row
                LazyRow(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    items(SampleData.hashtagsList) { tag ->
                        val isSelected = tag == selectedHashtag
                        FilterChip(
                            selected = isSelected,
                            onClick = { onHashtagSelected(tag) },
                            label = {
                                Text(
                                    text = tag,
                                    fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                                    fontSize = 13.sp
                                )
                            },
                            colors = FilterChipDefaults.filterChipColors(
                                selectedContainerColor = PrimaryPink,
                                selectedLabelColor = Color.White,
                                containerColor = BackgroundLight,
                                labelColor = TextPrimary
                            ),
                            shape = RoundedCornerShape(20.dp),
                            border = null
                        )
                    }
                }
            }
        }
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .background(BackgroundLight)
        ) {
            // 3. Pinterest-style Staggered Masonry Grid Layout
            LazyVerticalStaggeredGrid(
                columns = StaggeredGridCells.Fixed(2),
                contentPadding = PaddingValues(12.dp),
                horizontalArrangement = Arrangement.spacedBy(10.dp),
                verticalItemSpacing = 10.dp,
                modifier = Modifier.fillMaxSize()
            ) {
                items(if (filteredPosts.isNotEmpty()) filteredPosts else posts) { post ->
                    val itemHeight = remember(post.id) { (180..280).random().dp }

                    Card(
                        shape = RoundedCornerShape(16.dp),
                        elevation = CardDefaults.cardElevation(defaultElevation = 3.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(itemHeight)
                            .clickable { clickedPostDetail = post }
                    ) {
                        Box(modifier = Modifier.fillMaxSize()) {
                            if (post.backgroundImageUrl.isNotEmpty()) {
                                AsyncImage(
                                    model = post.backgroundImageUrl,
                                    contentDescription = post.quoteText,
                                    contentScale = ContentScale.Crop,
                                    modifier = Modifier.fillMaxSize()
                                )
                                Box(
                                    modifier = Modifier
                                        .fillMaxSize()
                                        .background(
                                            Brush.verticalGradient(
                                                listOf(Color.Black.copy(alpha = 0.2f), Color.Black.copy(alpha = 0.7f))
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

                            Column(
                                modifier = Modifier
                                    .align(Alignment.Center)
                                    .padding(12.dp),
                                horizontalAlignment = Alignment.CenterHorizontally
                            ) {
                                Text(
                                    text = post.quoteText,
                                    color = Color.White,
                                    fontWeight = FontWeight.Medium,
                                    fontSize = 12.sp,
                                    maxLines = 4,
                                    lineHeight = 16.sp
                                )
                            }

                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                modifier = Modifier
                                    .align(Alignment.BottomStart)
                                    .padding(8.dp)
                            ) {
                                Icon(
                                    imageVector = Icons.Filled.Favorite,
                                    contentDescription = "Likes",
                                    tint = LikeRed,
                                    modifier = Modifier.size(12.dp)
                                )
                                Spacer(modifier = Modifier.width(4.dp))
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

            // Click -> Open Full Post Detail Modal
            clickedPostDetail?.let { detailPost ->
                AlertDialog(
                    onDismissRequest = { clickedPostDetail = null },
                    confirmButton = {
                        TextButton(onClick = { clickedPostDetail = null }) {
                            Text("Close", color = PrimaryPink)
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
    }
}
