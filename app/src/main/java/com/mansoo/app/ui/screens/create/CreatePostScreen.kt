package com.mansoo.app.ui.screens.create

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.mansoo.app.data.model.Post
import com.mansoo.app.ui.theme.*

// ── Alignment states cycling ──────────────────────────────────
private val alignCycle = listOf(TextAlign.Start, TextAlign.Center, TextAlign.End, TextAlign.Justify)
private val alignIcons  = listOf(
    Icons.Filled.FormatAlignLeft,
    Icons.Filled.FormatAlignCenter,
    Icons.Filled.FormatAlignRight,
    Icons.Filled.FormatAlignJustify
)

// ── Background options ────────────────────────────────────────
private val bgImages = listOf(
    "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800",
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800",
    "https://images.unsplash.com/photo-1531685250784-756995259377?w=800",
    "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800",
    "https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=800"
)

private val solidBgColors = listOf(
    Color(0xFF0F3D3E), Color(0xFF1A1A2E), Color(0xFF2C3E50),
    Color(0xFF8B0000), Color(0xFF4A0080), Color(0xFF1B5E20),
    Color(0xFF37474F), Color(0xFFBF360C), Color(0xFF006064)
)

private val textColorOptions = listOf(
    0xFFFFFFFF.toLong(), 0xFF000000.toLong(), 0xFFFFD54F.toLong(),
    0xFF81D4FA.toLong(), 0xFFF48FB1.toLong(), 0xFFA5D6A7.toLong(),
    0xFFFFAB91.toLong(), 0xFFCE93D8.toLong()
)

private val fontOptions    = listOf("Serif", "Sans", "Mono", "Cursive")
private val lineSpacings   = listOf(20.sp, 24.sp, 28.sp, 34.sp)
private val categories     = listOf("Poem", "Shayari", "Quotes", "Story", "Life", "Meme")

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CreatePostScreen(
    onPostCreated: (Post) -> Unit,
    onNavigateBack: () -> Unit = {}
) {
    // ── State ─────────────────────────────────────────────────
    var quoteText          by remember { mutableStateOf("") }
    var isBold             by remember { mutableStateOf(false) }
    var isItalic           by remember { mutableStateOf(false) }
    var alignIndex         by remember { mutableStateOf(1) }     // default = Center
    var lineSpacingIndex   by remember { mutableStateOf(1) }
    var selectedFont       by remember { mutableStateOf("Serif") }
    var selectedTextColor  by remember { mutableStateOf(textColorOptions[0]) }
    var selectedCategory   by remember { mutableStateOf("Quotes") }
    var bgTab              by remember { mutableStateOf(0) }     // 0 = image, 1 = color
    var selectedBgUrl      by remember { mutableStateOf(bgImages[0]) }
    var selectedBgColor    by remember { mutableStateOf(solidBgColors[0]) }
    var showDraftDialog    by remember { mutableStateOf(false) }

    val currentAlign     = alignCycle[alignIndex]
    val currentLineHeight = lineSpacings[lineSpacingIndex]

    // Derived text style for preview
    val previewTextStyle = TextStyle(
        fontFamily  = when (selectedFont) {
            "Serif"   -> FontFamily.Serif
            "Mono"    -> FontFamily.Monospace
            "Cursive" -> FontFamily.Cursive
            else      -> FontFamily.Default
        },
        fontWeight  = if (isBold) FontWeight.Bold else FontWeight.Normal,
        fontStyle   = if (isItalic) FontStyle.Italic else FontStyle.Normal,
        textAlign   = currentAlign,
        fontSize    = 18.sp,
        lineHeight  = currentLineHeight,
        color       = Color(selectedTextColor)
    )

    Scaffold(
        topBar = {
            TopAppBar(
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.Filled.ArrowBack, "Back", tint = TextPrimary)
                    }
                },
                title = {
                    Text(
                        "Create Post",
                        fontFamily  = FontFamily.Serif,
                        fontWeight  = FontWeight.Bold,
                        fontSize    = 20.sp,
                        color       = Color(0xFF0F3D3E)
                    )
                },
                actions = {
                    // Save Draft button
                    OutlinedButton(
                        onClick = { showDraftDialog = true },
                        shape  = RoundedCornerShape(20.dp),
                        border = ButtonDefaults.outlinedButtonBorder,
                        modifier = Modifier
                            .padding(end = 4.dp)
                            .height(36.dp)
                    ) {
                        Icon(
                            Icons.Outlined.SaveAlt,
                            "Draft",
                            modifier = Modifier.size(16.dp),
                            tint = TextSecondary
                        )
                        Spacer(Modifier.width(4.dp))
                        Text(
                            "Draft",
                            fontSize   = 13.sp,
                            fontWeight = FontWeight.SemiBold,
                            color      = TextSecondary
                        )
                    }
                    // Publish button
                    Button(
                        onClick = {
                            if (quoteText.isNotBlank()) {
                                onPostCreated(
                                    Post(
                                        id                = "p_${System.currentTimeMillis()}",
                                        authorId          = "u1",
                                        authorName        = "Aarav Sharma",
                                        authorHandle      = "@aarav_writes",
                                        authorAvatarUrl   = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400",
                                        isVerified        = true,
                                        quoteText         = quoteText,
                                        category          = selectedCategory,
                                        backgroundImageUrl = if (bgTab == 0) selectedBgUrl else "",
                                        fontStyle         = selectedFont,
                                        textColor         = selectedTextColor,
                                        createdAtTimestamp = System.currentTimeMillis()
                                    )
                                )
                            }
                        },
                        colors   = ButtonDefaults.buttonColors(containerColor = PrimaryPink),
                        shape    = RoundedCornerShape(20.dp),
                        modifier = Modifier
                            .padding(end = 8.dp)
                            .height(36.dp)
                    ) {
                        Icon(Icons.Filled.Send, "Publish", modifier = Modifier.size(16.dp))
                        Spacer(Modifier.width(4.dp))
                        Text("Post", fontSize = 13.sp, fontWeight = FontWeight.Bold)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = Color.White)
            )
        }
    ) { paddingValues ->

        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .background(BackgroundLight)
                .verticalScroll(rememberScrollState())
        ) {

            // ═══════════════════════════════════════════════════
            // SECTION 1 — LIVE CANVAS PREVIEW
            // ═══════════════════════════════════════════════════
            Box(
                contentAlignment = Alignment.Center,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(300.dp)
            ) {
                // Background layer
                if (bgTab == 0) {
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
                                    listOf(Color.Black.copy(0.25f), Color.Black.copy(0.65f))
                                )
                            )
                    )
                } else {
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .background(selectedBgColor)
                    )
                }

                // Text preview
                Text(
                    text = if (quoteText.isBlank()) "Your words appear here…" else quoteText,
                    style = previewTextStyle.copy(
                        color = Color(selectedTextColor).copy(
                            alpha = if (quoteText.isBlank()) 0.5f else 1f
                        )
                    ),
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 24.dp, vertical = 16.dp)
                )

                // Watermark
                Text(
                    "Mansoo.in",
                    color    = Color.White.copy(0.6f),
                    fontSize = 10.sp,
                    modifier = Modifier
                        .align(Alignment.BottomEnd)
                        .padding(12.dp)
                )
            }

            Spacer(Modifier.height(12.dp))

            // ═══════════════════════════════════════════════════
            // SECTION 2 — TEXT EDITOR
            // ═══════════════════════════════════════════════════
            EditorCard(title = "✍️  Write") {

                // ── Formatting Toolbar ────────────────────────
                Surface(
                    color         = Color(0xFFF5F5F5),
                    shape         = RoundedCornerShape(12.dp),
                    modifier      = Modifier.fillMaxWidth()
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier
                            .horizontalScroll(rememberScrollState())
                            .padding(horizontal = 8.dp, vertical = 4.dp)
                    ) {
                        // Bold
                        FormatButton(
                            icon      = Icons.Filled.FormatBold,
                            label     = "Bold",
                            isActive  = isBold,
                            onClick   = { isBold = !isBold }
                        )
                        ToolbarDivider()

                        // Italic
                        FormatButton(
                            icon      = Icons.Filled.FormatItalic,
                            label     = "Italic",
                            isActive  = isItalic,
                            onClick   = { isItalic = !isItalic }
                        )
                        ToolbarDivider()

                        // Text Align (cycles through 4 states)
                        FormatButton(
                            icon      = alignIcons[alignIndex],
                            label     = "Align",
                            isActive  = false,
                            onClick   = { alignIndex = (alignIndex + 1) % alignCycle.size }
                        )
                        ToolbarDivider()

                        // Line Spacing (cycles 4 sizes)
                        FormatButton(
                            icon      = Icons.Filled.FormatLineSpacing,
                            label     = "Spacing",
                            isActive  = lineSpacingIndex > 0,
                            onClick   = { lineSpacingIndex = (lineSpacingIndex + 1) % lineSpacings.size }
                        )
                        ToolbarDivider()

                        // Font style chips
                        fontOptions.forEach { font ->
                            val active = font == selectedFont
                            Box(
                                contentAlignment = Alignment.Center,
                                modifier = Modifier
                                    .padding(horizontal = 4.dp)
                                    .clip(RoundedCornerShape(8.dp))
                                    .background(if (active) PrimaryPink else Color.Transparent)
                                    .clickable { selectedFont = font }
                                    .padding(horizontal = 10.dp, vertical = 6.dp)
                            ) {
                                Text(
                                    text = font,
                                    fontSize   = 12.sp,
                                    fontFamily = when (font) {
                                        "Serif"   -> FontFamily.Serif
                                        "Mono"    -> FontFamily.Monospace
                                        "Cursive" -> FontFamily.Cursive
                                        else      -> FontFamily.Default
                                    },
                                    fontWeight = if (active) FontWeight.Bold else FontWeight.Normal,
                                    color      = if (active) Color.White else TextSecondary
                                )
                            }
                        }
                    }
                }

                Spacer(Modifier.height(10.dp))

                // ── Text Input Box ────────────────────────────
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .defaultMinSize(minHeight = 130.dp)
                        .shadow(2.dp, RoundedCornerShape(14.dp))
                        .background(Color.White, RoundedCornerShape(14.dp))
                        .border(
                            1.5.dp,
                            Brush.horizontalGradient(listOf(GradientStart, GradientEnd)),
                            RoundedCornerShape(14.dp)
                        )
                        .padding(14.dp)
                ) {
                    BasicTextField(
                        value       = quoteText,
                        onValueChange = { quoteText = it },
                        textStyle   = previewTextStyle.copy(fontSize = 15.sp),
                        cursorBrush = SolidColor(PrimaryPink),
                        modifier    = Modifier.fillMaxWidth(),
                        decorationBox = { inner ->
                            if (quoteText.isEmpty()) {
                                Text(
                                    "Write your Shayari, Quote or Story…",
                                    style = TextStyle(
                                        fontSize = 15.sp,
                                        color    = TextMuted
                                    )
                                )
                            }
                            inner()
                        }
                    )
                }

                Spacer(Modifier.height(10.dp))

                // ── Text Color Picker ─────────────────────────
                SectionLabel("🎨  Text Color")
                Spacer(Modifier.height(6.dp))
                Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    textColorOptions.forEach { colorLong ->
                        val isSelected = selectedTextColor == colorLong
                        Box(
                            contentAlignment = Alignment.Center,
                            modifier = Modifier
                                .size(32.dp)
                                .shadow(if (isSelected) 4.dp else 0.dp, CircleShape)
                                .clip(CircleShape)
                                .background(Color(colorLong))
                                .border(
                                    width = if (isSelected) 2.5.dp else 1.dp,
                                    brush = if (isSelected)
                                        Brush.linearGradient(listOf(GradientStart, GradientEnd))
                                    else
                                        Brush.linearGradient(listOf(Color(0xFFCCCCCC), Color(0xFFCCCCCC))),
                                    shape = CircleShape
                                )
                                .clickable { selectedTextColor = colorLong }
                        ) {
                            if (isSelected) {
                                Icon(
                                    Icons.Filled.Check,
                                    contentDescription = null,
                                    tint   = if (colorLong == 0xFFFFFFFF.toLong()) Color.Black else Color.White,
                                    modifier = Modifier.size(16.dp)
                                )
                            }
                        }
                    }
                }
            }

            Spacer(Modifier.height(12.dp))

            // ═══════════════════════════════════════════════════
            // SECTION 3 — BACKGROUND PICKER
            // ═══════════════════════════════════════════════════
            EditorCard(title = "🖼️  Background") {

                // Tab switcher: Image | Color
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(12.dp))
                        .background(Color(0xFFF0F0F0))
                        .padding(3.dp)
                ) {
                    listOf("🌅  Image", "🎨  Color").forEachIndexed { idx, label ->
                        val active = bgTab == idx
                        Box(
                            contentAlignment = Alignment.Center,
                            modifier = Modifier
                                .weight(1f)
                                .clip(RoundedCornerShape(10.dp))
                                .background(
                                    if (active)
                                        Brush.horizontalGradient(listOf(GradientStart, GradientEnd))
                                    else
                                        Brush.horizontalGradient(listOf(Color.Transparent, Color.Transparent))
                                )
                                .clickable { bgTab = idx }
                                .padding(vertical = 10.dp)
                        ) {
                            Text(
                                label,
                                fontSize   = 13.sp,
                                fontWeight = if (active) FontWeight.Bold else FontWeight.Medium,
                                color      = if (active) Color.White else TextSecondary
                            )
                        }
                    }
                }

                Spacer(Modifier.height(12.dp))

                if (bgTab == 0) {
                    // ── Image Picker ──────────────────────────
                    SectionLabel("Select a background image")
                    Spacer(Modifier.height(8.dp))
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(10.dp),
                        modifier = Modifier.horizontalScroll(rememberScrollState())
                    ) {
                        bgImages.forEach { bgUrl ->
                            val isSelected = bgUrl == selectedBgUrl
                            Box(
                                modifier = Modifier
                                    .size(if (isSelected) 80.dp else 68.dp)
                                    .shadow(if (isSelected) 8.dp else 2.dp, RoundedCornerShape(14.dp))
                                    .clip(RoundedCornerShape(14.dp))
                                    .border(
                                        width = if (isSelected) 3.dp else 0.dp,
                                        brush = Brush.linearGradient(listOf(GradientStart, GradientEnd)),
                                        shape = RoundedCornerShape(14.dp)
                                    )
                                    .clickable { selectedBgUrl = bgUrl }
                            ) {
                                AsyncImage(
                                    model = bgUrl,
                                    contentDescription = "BG option",
                                    contentScale = ContentScale.Crop,
                                    modifier = Modifier.fillMaxSize()
                                )
                                if (isSelected) {
                                    Box(
                                        contentAlignment = Alignment.Center,
                                        modifier = Modifier
                                            .fillMaxSize()
                                            .background(Color.Black.copy(0.25f))
                                    ) {
                                        Icon(
                                            Icons.Filled.CheckCircle,
                                            null,
                                            tint     = Color.White,
                                            modifier = Modifier.size(24.dp)
                                        )
                                    }
                                }
                            }
                        }
                    }
                } else {
                    // ── Solid Color Picker ────────────────────
                    SectionLabel("Select a background color")
                    Spacer(Modifier.height(8.dp))
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(12.dp),
                        modifier = Modifier.horizontalScroll(rememberScrollState())
                    ) {
                        solidBgColors.forEach { color ->
                            val isSelected = color == selectedBgColor
                            Box(
                                contentAlignment = Alignment.Center,
                                modifier = Modifier
                                    .size(if (isSelected) 52.dp else 44.dp)
                                    .shadow(if (isSelected) 6.dp else 1.dp, CircleShape)
                                    .clip(CircleShape)
                                    .background(color)
                                    .border(
                                        width = if (isSelected) 3.dp else 1.dp,
                                        brush = Brush.linearGradient(listOf(GradientStart, GradientEnd)),
                                        shape = CircleShape
                                    )
                                    .clickable { selectedBgColor = color }
                            ) {
                                if (isSelected) {
                                    Icon(
                                        Icons.Filled.Check,
                                        null,
                                        tint     = Color.White,
                                        modifier = Modifier.size(20.dp)
                                    )
                                }
                            }
                        }
                    }
                }
            }

            Spacer(Modifier.height(12.dp))

            // ═══════════════════════════════════════════════════
            // SECTION 4 — CATEGORY
            // ═══════════════════════════════════════════════════
            EditorCard(title = "🏷️  Category") {
                Row(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    modifier = Modifier.horizontalScroll(rememberScrollState())
                ) {
                    categories.forEach { cat ->
                        val isSelected = cat == selectedCategory
                        Box(
                            contentAlignment = Alignment.Center,
                            modifier = Modifier
                                .clip(RoundedCornerShape(50.dp))
                                .background(
                                    if (isSelected)
                                        Brush.horizontalGradient(listOf(GradientStart, GradientEnd))
                                    else
                                        Brush.horizontalGradient(listOf(Color(0xFFF0F0F0), Color(0xFFF0F0F0)))
                                )
                                .clickable { selectedCategory = cat }
                                .padding(horizontal = 16.dp, vertical = 8.dp)
                        ) {
                            Text(
                                cat,
                                fontSize   = 13.sp,
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                                color      = if (isSelected) Color.White else TextSecondary
                            )
                        }
                    }
                }
            }

            Spacer(Modifier.height(12.dp))

            // ═══════════════════════════════════════════════════
            // SECTION 5 — BOTTOM ACTION BUTTONS
            // ═══════════════════════════════════════════════════
            Row(
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp)
            ) {
                // Save Draft
                OutlinedButton(
                    onClick  = { showDraftDialog = true },
                    shape    = RoundedCornerShape(16.dp),
                    modifier = Modifier
                        .weight(1f)
                        .height(52.dp),
                    border = ButtonDefaults.outlinedButtonBorder
                ) {
                    Icon(Icons.Outlined.SaveAlt, "Draft", modifier = Modifier.size(20.dp))
                    Spacer(Modifier.width(6.dp))
                    Text("Save Draft", fontWeight = FontWeight.SemiBold, fontSize = 15.sp)
                }

                // Publish / Post
                Button(
                    onClick = {
                        if (quoteText.isNotBlank()) {
                            onPostCreated(
                                Post(
                                    id                 = "p_${System.currentTimeMillis()}",
                                    authorId           = "u1",
                                    authorName         = "Aarav Sharma",
                                    authorHandle       = "@aarav_writes",
                                    authorAvatarUrl    = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400",
                                    isVerified         = true,
                                    quoteText          = quoteText,
                                    category           = selectedCategory,
                                    backgroundImageUrl = if (bgTab == 0) selectedBgUrl else "",
                                    fontStyle          = selectedFont,
                                    textColor          = selectedTextColor,
                                    createdAtTimestamp = System.currentTimeMillis()
                                )
                            )
                        }
                    },
                    colors   = ButtonDefaults.buttonColors(containerColor = Color.Transparent),
                    shape    = RoundedCornerShape(16.dp),
                    contentPadding = PaddingValues(0.dp),
                    modifier = Modifier
                        .weight(1f)
                        .height(52.dp)
                        .background(
                            Brush.horizontalGradient(listOf(GradientStart, GradientEnd)),
                            RoundedCornerShape(16.dp)
                        )
                ) {
                    Icon(Icons.Filled.Send, "Post", modifier = Modifier.size(20.dp), tint = Color.White)
                    Spacer(Modifier.width(6.dp))
                    Text(
                        "Post Now",
                        fontWeight = FontWeight.Bold,
                        fontSize   = 15.sp,
                        color      = Color.White
                    )
                }
            }

            Spacer(Modifier.height(90.dp))   // clear bottom nav
        }
    }

    // ── Save Draft Confirmation Dialog ────────────────────────
    if (showDraftDialog) {
        AlertDialog(
            onDismissRequest = { showDraftDialog = false },
            icon  = { Icon(Icons.Outlined.SaveAlt, null, tint = PrimaryPink) },
            title = {
                Text("Save to Drafts?", fontWeight = FontWeight.Bold)
            },
            text  = {
                Text(
                    "Your post will be saved privately. You can publish it anytime from your profile.",
                    color = TextSecondary
                )
            },
            confirmButton = {
                Button(
                    onClick  = { showDraftDialog = false },
                    colors   = ButtonDefaults.buttonColors(containerColor = PrimaryPink),
                    shape    = RoundedCornerShape(12.dp)
                ) {
                    Text("Save Draft", fontWeight = FontWeight.Bold)
                }
            },
            dismissButton = {
                TextButton(onClick = { showDraftDialog = false }) {
                    Text("Cancel", color = TextSecondary)
                }
            },
            shape = RoundedCornerShape(20.dp)
        )
    }
}

// ─────────────────────────────────────────────────────────────
// HELPER COMPOSABLES
// ─────────────────────────────────────────────────────────────

/** White card section with gradient top-left accent bar */
@Composable
private fun EditorCard(title: String, content: @Composable ColumnScope.() -> Unit) {
    Surface(
        color          = Color.White,
        shape          = RoundedCornerShape(18.dp),
        shadowElevation = 3.dp,
        modifier       = Modifier
            .fillMaxWidth()
            .padding(horizontal = 12.dp)
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(
                    modifier = Modifier
                        .width(4.dp)
                        .height(18.dp)
                        .background(
                            Brush.verticalGradient(listOf(GradientStart, GradientEnd)),
                            RoundedCornerShape(4.dp)
                        )
                )
                Spacer(Modifier.width(8.dp))
                Text(
                    title,
                    fontWeight = FontWeight.Bold,
                    fontSize   = 14.sp,
                    color      = TextPrimary
                )
            }
            Spacer(Modifier.height(10.dp))
            content()
        }
    }
}

/** Single formatting toolbar button (icon + optional active highlight) */
@Composable
private fun FormatButton(
    icon: ImageVector,
    label: String,
    isActive: Boolean,
    onClick: () -> Unit
) {
    val bg by animateColorAsState(
        targetValue = if (isActive) PrimaryPink.copy(alpha = 0.15f) else Color.Transparent,
        animationSpec = tween(150),
        label = "fmtBg"
    )
    Box(
        contentAlignment = Alignment.Center,
        modifier = Modifier
            .clip(RoundedCornerShape(8.dp))
            .background(bg)
            .clickable { onClick() }
            .padding(8.dp)
    ) {
        Icon(
            imageVector  = icon,
            contentDescription = label,
            tint         = if (isActive) PrimaryPink else TextSecondary,
            modifier     = Modifier.size(20.dp)
        )
    }
}

/** Thin vertical divider for the toolbar */
@Composable
private fun ToolbarDivider() {
    Box(
        modifier = Modifier
            .padding(horizontal = 4.dp)
            .width(1.dp)
            .height(22.dp)
            .background(Color(0xFFE0E0E0))
    )
}

/** Small bold section sub-label */
@Composable
private fun SectionLabel(text: String) {
    Text(
        text,
        fontSize   = 12.sp,
        fontWeight = FontWeight.SemiBold,
        color      = TextSecondary
    )
}
