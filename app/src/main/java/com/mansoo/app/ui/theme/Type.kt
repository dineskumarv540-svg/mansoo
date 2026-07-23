package com.mansoo.app.ui.theme

import androidx.compose.material3.Typography
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp
import com.mansoo.app.R

// ── Playfair Display — Heading font ────────────────────────
val PlayfairDisplay = FontFamily(
    Font(R.font.playfair_display_regular,    FontWeight.Normal),
    Font(R.font.playfair_display_medium,     FontWeight.Medium),
    Font(R.font.playfair_display_semibold,   FontWeight.SemiBold),
    Font(R.font.playfair_display_bold,       FontWeight.Bold),
    Font(R.font.playfair_display_extrabold,  FontWeight.ExtraBold),
    Font(R.font.playfair_display_italic,     FontWeight.Normal,   FontStyle.Italic),
    Font(R.font.playfair_display_bolditalic, FontWeight.Bold,     FontStyle.Italic)
)

// ── Poppins — Body font ────────────────────────────────────
val Poppins = FontFamily(
    Font(R.font.poppins_light,      FontWeight.Light),
    Font(R.font.poppins_regular,    FontWeight.Normal),
    Font(R.font.poppins_medium,     FontWeight.Medium),
    Font(R.font.poppins_semibold,   FontWeight.SemiBold),
    Font(R.font.poppins_bold,       FontWeight.Bold),
    Font(R.font.poppins_extrabold,  FontWeight.ExtraBold)
)

// ── Quote text style (Serif Italic mix) ────────────────────
val QuoteTextStyle = TextStyle(
    fontFamily = FontFamily.Serif,
    fontStyle  = FontStyle.Italic,
    fontWeight = FontWeight.Medium,
    fontSize   = 17.sp,
    lineHeight = 26.sp,
    letterSpacing = 0.2.sp
)

// ── Material3 Typography ───────────────────────────────────
val Typography = Typography(

    // Headings — Playfair Display
    displayLarge = TextStyle(
        fontFamily  = PlayfairDisplay,
        fontWeight  = FontWeight.Bold,
        fontSize    = 48.sp,
        lineHeight  = 58.sp,
        letterSpacing = (-0.5).sp
    ),
    displayMedium = TextStyle(
        fontFamily  = PlayfairDisplay,
        fontWeight  = FontWeight.Bold,
        fontSize    = 36.sp,
        lineHeight  = 44.sp
    ),
    headlineLarge = TextStyle(
        fontFamily  = PlayfairDisplay,
        fontWeight  = FontWeight.Bold,
        fontSize    = 28.sp,
        lineHeight  = 36.sp
    ),
    headlineMedium = TextStyle(
        fontFamily  = PlayfairDisplay,
        fontWeight  = FontWeight.SemiBold,
        fontSize    = 22.sp,
        lineHeight  = 30.sp
    ),
    headlineSmall = TextStyle(
        fontFamily  = PlayfairDisplay,
        fontWeight  = FontWeight.SemiBold,
        fontSize    = 18.sp,
        lineHeight  = 26.sp
    ),

    // Titles — Poppins SemiBold
    titleLarge = TextStyle(
        fontFamily  = Poppins,
        fontWeight  = FontWeight.SemiBold,
        fontSize    = 20.sp,
        lineHeight  = 28.sp
    ),
    titleMedium = TextStyle(
        fontFamily  = Poppins,
        fontWeight  = FontWeight.SemiBold,
        fontSize    = 16.sp,
        lineHeight  = 22.sp
    ),
    titleSmall = TextStyle(
        fontFamily  = Poppins,
        fontWeight  = FontWeight.Medium,
        fontSize    = 14.sp,
        lineHeight  = 20.sp
    ),

    // Body — Poppins Regular
    bodyLarge = TextStyle(
        fontFamily  = Poppins,
        fontWeight  = FontWeight.Normal,
        fontSize    = 16.sp,
        lineHeight  = 24.sp,
        letterSpacing = 0.15.sp
    ),
    bodyMedium = TextStyle(
        fontFamily  = Poppins,
        fontWeight  = FontWeight.Normal,
        fontSize    = 14.sp,
        lineHeight  = 20.sp,
        letterSpacing = 0.1.sp
    ),
    bodySmall = TextStyle(
        fontFamily  = Poppins,
        fontWeight  = FontWeight.Normal,
        fontSize    = 12.sp,
        lineHeight  = 16.sp
    ),

    // Labels — Poppins Medium
    labelLarge = TextStyle(
        fontFamily  = Poppins,
        fontWeight  = FontWeight.Medium,
        fontSize    = 14.sp,
        lineHeight  = 20.sp
    ),
    labelMedium = TextStyle(
        fontFamily  = Poppins,
        fontWeight  = FontWeight.Medium,
        fontSize    = 12.sp,
        lineHeight  = 16.sp
    ),
    labelSmall = TextStyle(
        fontFamily  = Poppins,
        fontWeight  = FontWeight.Medium,
        fontSize    = 10.sp,
        lineHeight  = 14.sp,
        letterSpacing = 0.4.sp
    )
)
