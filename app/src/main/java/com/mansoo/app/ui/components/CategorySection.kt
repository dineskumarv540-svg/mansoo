package com.mansoo.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ChevronRight
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
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
import com.mansoo.app.data.model.Category
import com.mansoo.app.ui.theme.*

// Curated per-category gradient palettes
private val categoryGradients: Map<String, List<Color>> = mapOf(
    "Nature"       to listOf(Color(0xFF11998E), Color(0xFF38EF7D)),
    "Love"         to listOf(Color(0xFFFF416C), Color(0xFFFF4B2B)),
    "Politics"     to listOf(Color(0xFF2C3E50), Color(0xFF4CA1AF)),
    "Humor"        to listOf(Color(0xFFF7971E), Color(0xFFFFD200)),
    "Jokes"        to listOf(Color(0xFFDA22FF), Color(0xFF9733EE)),
    "Sadness"      to listOf(Color(0xFF373B44), Color(0xFF4286F4)),
    "Motivation"   to listOf(Color(0xFFEB5757), Color(0xFF000000)),
    "Friendship"   to listOf(Color(0xFFDA22FF), Color(0xFF9733EE)),
    "Spirituality" to listOf(Color(0xFFF5AF19), Color(0xFFF12711)),
)
private val fallbackGradient = listOf(Color(0xFF667EEA), Color(0xFF764BA2))

@Composable
fun CategorySection(
    category: Category,
    onCategoryClick: (Category) -> Unit = {}
) {
    val gradient = categoryGradients[category.name] ?: fallbackGradient

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 10.dp)
    ) {

        // ── Section Header ──────────────────────────────────
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 4.dp)
        ) {
            // Colored accent bar
            Box(
                modifier = Modifier
                    .width(4.dp)
                    .height(22.dp)
                    .background(
                        Brush.verticalGradient(gradient),
                        RoundedCornerShape(4.dp)
                    )
            )
            Spacer(modifier = Modifier.width(10.dp))

            // Emoji
            Text(text = category.emoji, fontSize = 22.sp)

            Spacer(modifier = Modifier.width(8.dp))

            // Category name
            Text(
                text = category.name,
                fontWeight = FontWeight.ExtraBold,
                fontSize = 18.sp,
                color = TextPrimary,
                modifier = Modifier.weight(1f)
            )

            // "See All" →
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier
                    .clickable { onCategoryClick(category) }
                    .padding(4.dp)
            ) {
                Text(
                    text = "See All",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = gradient.first()
                )
                Icon(
                    imageVector = Icons.Filled.ChevronRight,
                    contentDescription = "See All",
                    tint = gradient.first(),
                    modifier = Modifier.size(18.dp)
                )
            }
        }

        Spacer(modifier = Modifier.height(10.dp))

        // ── Horizontal Scrolling Cards ─────────────────────
        LazyRow(
            contentPadding = PaddingValues(horizontal = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            itemsIndexed(category.sampleQuotes) { index, quoteText ->
                CategoryQuoteCard(
                    quoteText = quoteText,
                    coverImageUrl = category.coverImageUrl,
                    gradient = gradient,
                    isImageCard = index % 2 == 0,       // alternate image/gradient cards
                    onClick = { onCategoryClick(category) }
                )
            }

            // Last card = "Explore More" CTA card
            item {
                ExploreMoreCard(gradient = gradient, onClick = { onCategoryClick(category) })
            }
        }
    }

    // Divider between sections
    Divider(
        color = Color(0xFFF0F0F0),
        thickness = 6.dp,
        modifier = Modifier.fillMaxWidth()
    )
}

// ────────────────────────────────────────────────────────────
// INDIVIDUAL QUOTE CARD
// ────────────────────────────────────────────────────────────
@Composable
fun CategoryQuoteCard(
    quoteText: String,
    coverImageUrl: String,
    gradient: List<Color>,
    isImageCard: Boolean,
    onClick: () -> Unit
) {
    Card(
        shape = RoundedCornerShape(18.dp),
        elevation = CardDefaults.cardElevation(defaultElevation = 5.dp, pressedElevation = 2.dp),
        modifier = Modifier
            .width(190.dp)
            .height(150.dp)
            .shadow(6.dp, RoundedCornerShape(18.dp))
            .clickable { onClick() }
    ) {
        Box(modifier = Modifier.fillMaxSize()) {

            if (isImageCard && coverImageUrl.isNotEmpty()) {
                // Image background with overlay
                AsyncImage(
                    model = coverImageUrl,
                    contentDescription = quoteText,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier.fillMaxSize()
                )
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(
                            Brush.verticalGradient(
                                0f to Color.Black.copy(alpha = 0.15f),
                                1f to Color.Black.copy(alpha = 0.80f)
                            )
                        )
                )
            } else {
                // Gradient background
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(Brush.linearGradient(gradient))
                )
                // Decorative large quote mark
                Text(
                    text = "\u201C",
                    fontSize = 80.sp,
                    fontFamily = FontFamily.Serif,
                    color = Color.White.copy(alpha = 0.12f),
                    modifier = Modifier
                        .align(Alignment.TopStart)
                        .padding(start = 4.dp, top = 0.dp)
                )
            }

            // Quote text centered
            Text(
                text = "\u201C$quoteText\u201D",
                color = Color.White,
                fontWeight = FontWeight.Medium,
                fontStyle = FontStyle.Italic,
                fontSize = 12.sp,
                lineHeight = 17.sp,
                textAlign = TextAlign.Center,
                maxLines = 5,
                overflow = TextOverflow.Ellipsis,
                modifier = Modifier
                    .align(Alignment.Center)
                    .padding(horizontal = 14.dp, vertical = 10.dp)
            )
        }
    }
}

// ────────────────────────────────────────────────────────────
// "EXPLORE MORE" CTA CARD (last card in the row)
// ────────────────────────────────────────────────────────────
@Composable
fun ExploreMoreCard(
    gradient: List<Color>,
    onClick: () -> Unit
) {
    Box(
        contentAlignment = Alignment.Center,
        modifier = Modifier
            .width(120.dp)
            .height(150.dp)
            .clip(RoundedCornerShape(18.dp))
            .background(Brush.linearGradient(gradient.map { it.copy(alpha = 0.15f) }))
            .clickable { onClick() }
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Box(
                contentAlignment = Alignment.Center,
                modifier = Modifier
                    .size(44.dp)
                    .background(Brush.linearGradient(gradient), RoundedCornerShape(50.dp))
            ) {
                Icon(
                    imageVector = Icons.Filled.ChevronRight,
                    contentDescription = "Explore",
                    tint = Color.White,
                    modifier = Modifier.size(26.dp)
                )
            }
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = "Explore\nMore",
                fontSize = 12.sp,
                fontWeight = FontWeight.Bold,
                textAlign = TextAlign.Center,
                color = gradient.first()
            )
        }
    }
}
