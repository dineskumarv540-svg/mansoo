package com.yourquote.app.ui.screens.create

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Download
import androidx.compose.material.icons.filled.FormatQuote
import androidx.compose.material.icons.filled.Publish
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.yourquote.app.data.model.Post
import com.yourquote.app.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CreatePostScreen(
    onPostCreated: (Post) -> Unit,
    onNavigateBack: () -> Unit = {}
) {
    var quoteText by remember { mutableStateOf("") }
    var selectedCategory by remember { mutableStateOf("Quotes") }
    var selectedBgUrl by remember { mutableStateOf("https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800") }
    var selectedFont by remember { mutableStateOf("Serif") }
    var selectedTextColor by remember { mutableStateOf(0xFFFFFFFF) }

    val bgImages = listOf(
        "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
        "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800",
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800",
        "https://images.unsplash.com/photo-1531685250784-756995259377?w=800"
    )

    val fontOptions = listOf("Serif", "Sans", "Monospace", "Cursive")
    val colorOptions = listOf(0xFFFFFFFF, 0xFF000000, 0xFFFFD54F, 0xFF81D4FA, 0xFFF48FB1)
    val categories = listOf("Poem", "Shayari", "Quotes", "Story", "Life", "Meme")

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Create Quote Post", fontWeight = FontWeight.Bold) },
                actions = {
                    Button(
                        onClick = {
                            if (quoteText.isNotBlank()) {
                                val newPost = Post(
                                    id = "p_" + System.currentTimeMillis(),
                                    authorId = "u1",
                                    authorName = "Aarav Sharma",
                                    authorHandle = "@aarav_writes",
                                    authorAvatarUrl = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400",
                                    isVerified = true,
                                    quoteText = quoteText,
                                    category = selectedCategory,
                                    backgroundImageUrl = selectedBgUrl,
                                    fontStyle = selectedFont,
                                    textColor = selectedTextColor,
                                    createdAtTimestamp = System.currentTimeMillis()
                                )
                                onPostCreated(newPost)
                            }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = PrimaryPink),
                        shape = RoundedCornerShape(20.dp),
                        modifier = Modifier.padding(end = 8.dp)
                    ) {
                        Icon(Icons.Filled.Publish, contentDescription = "Post", modifier = Modifier.size(18.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Publish", fontWeight = FontWeight.Bold)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MaterialTheme.colorScheme.surface)
            )
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .background(BackgroundLight)
                .verticalScroll(rememberScrollState())
                .padding(16.dp)
        ) {
            // 1. Live Canvas Preview
            Card(
                shape = RoundedCornerShape(20.dp),
                elevation = CardDefaults.cardElevation(defaultElevation = 6.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(280.dp)
            ) {
                Box(contentAlignment = Alignment.Center, modifier = Modifier.fillMaxSize()) {
                    AsyncImage(
                        model = selectedBgUrl,
                        contentDescription = "Background",
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

                    Text(
                        text = if (quoteText.isBlank()) "Type your Shayari, Poem or Quote here..." else quoteText,
                        color = Color(selectedTextColor).copy(alpha = if (quoteText.isBlank()) 0.6f else 1.0f),
                        fontSize = 18.sp,
                        fontFamily = when (selectedFont) {
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
                        text = "YourQuote.in",
                        color = Color.White.copy(alpha = 0.7f),
                        fontSize = 10.sp,
                        modifier = Modifier
                            .align(Alignment.BottomEnd)
                            .padding(12.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // 2. Export Image Button
            OutlinedButton(
                onClick = { /* Export canvas to gallery feature */ },
                shape = RoundedCornerShape(14.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Icon(Icons.Filled.Download, contentDescription = "Export")
                Spacer(modifier = Modifier.width(8.dp))
                Text("Export High-Res Image to Gallery", fontWeight = FontWeight.Bold)
            }

            Spacer(modifier = Modifier.height(16.dp))

            // 3. Text Editor
            OutlinedTextField(
                value = quoteText,
                onValueChange = { quoteText = it },
                label = { Text("Write your thoughts...") },
                placeholder = { Text("Write Shayari / Quote / Story...") },
                leadingIcon = { Icon(Icons.Filled.FormatQuote, contentDescription = null, tint = PrimaryPink) },
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(130.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = PrimaryPink,
                    focusedContainerColor = Color.White,
                    unfocusedContainerColor = Color.White
                )
            )

            Spacer(modifier = Modifier.height(16.dp))

            // 4. Category Selector Pills
            Text("Category:", fontWeight = FontWeight.Bold, fontSize = 14.sp)
            Spacer(modifier = Modifier.height(6.dp))
            LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                items(categories) { category ->
                    val isSelected = category == selectedCategory
                    FilterChip(
                        selected = isSelected,
                        onClick = { selectedCategory = category },
                        label = { Text(category) },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = PrimaryPink,
                            selectedLabelColor = Color.White
                        )
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // 5. Background Image Selector
            Text("Background Theme:", fontWeight = FontWeight.Bold, fontSize = 14.sp)
            Spacer(modifier = Modifier.height(8.dp))
            LazyRow(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                items(bgImages) { bgUrl ->
                    Box(
                        modifier = Modifier
                            .size(60.dp)
                            .clip(RoundedCornerShape(12.dp))
                            .border(
                                width = if (bgUrl == selectedBgUrl) 3.dp else 0.dp,
                                color = if (bgUrl == selectedBgUrl) PrimaryPink else Color.Transparent,
                                shape = RoundedCornerShape(12.dp)
                            )
                            .clickable { selectedBgUrl = bgUrl }
                    ) {
                        AsyncImage(
                            model = bgUrl,
                            contentDescription = "Background option",
                            contentScale = ContentScale.Crop,
                            modifier = Modifier.fillMaxSize()
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // 6. Font Style Selector
            Text("Typography Style:", fontWeight = FontWeight.Bold, fontSize = 14.sp)
            Spacer(modifier = Modifier.height(8.dp))
            LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                items(fontOptions) { font ->
                    val isSelected = font == selectedFont
                    FilterChip(
                        selected = isSelected,
                        onClick = { selectedFont = font },
                        label = { Text(font) },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = PrimaryPink,
                            selectedLabelColor = Color.White
                        )
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // 7. Text Color Selector
            Text("Text Color:", fontWeight = FontWeight.Bold, fontSize = 14.sp)
            Spacer(modifier = Modifier.height(8.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                colorOptions.forEach { colorHex ->
                    Box(
                        contentAlignment = Alignment.Center,
                        modifier = Modifier
                            .size(36.dp)
                            .clip(CircleShape)
                            .background(Color(colorHex))
                            .border(1.dp, Color.Gray, CircleShape)
                            .clickable { selectedTextColor = colorHex }
                    ) {
                        if (selectedTextColor == colorHex) {
                            Icon(
                                Icons.Filled.Check,
                                contentDescription = null,
                                tint = if (colorHex == 0xFFFFFFFF) Color.Black else Color.White,
                                modifier = Modifier.size(20.dp)
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(40.dp))
        }
    }
}
