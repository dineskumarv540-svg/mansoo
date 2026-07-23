package com.mansoo.app.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

// ── Light scheme (spec colors) ─────────────────────────────
private val LightColorScheme = lightColorScheme(
    primary          = PrimaryGreen,       // #0F3D3E
    onPrimary        = Color.White,
    primaryContainer = PrimaryGreenLight,
    onPrimaryContainer = Color.White,

    secondary        = AccentPink,         // #F26B8A
    onSecondary      = Color.White,
    secondaryContainer = AccentPink.copy(alpha = 0.12f),
    onSecondaryContainer = AccentPinkDark,

    background       = Color(0xFFFFFFFF),  // spec: #FFFFFF
    onBackground     = TextPrimary,        // spec: #222222
    surface          = CardBackground,
    onSurface        = TextPrimary,
    surfaceVariant   = SurfaceLight,
    onSurfaceVariant = TextSecondary,      // spec: #888888

    error            = ErrorRed,
    onError          = Color.White,

    outline          = Color(0xFFE0E0E0)
)

// ── Dark scheme ────────────────────────────────────────────
private val DarkColorScheme = darkColorScheme(
    primary          = PrimaryGreenLight,
    onPrimary        = Color.White,
    primaryContainer = PrimaryGreen,
    onPrimaryContainer = Color.White,

    secondary        = AccentPink,
    onSecondary      = Color.White,

    background       = Color(0xFF0D1B1C),  // very dark green-black
    onBackground     = Color(0xFFF0F0F0),
    surface          = Color(0xFF1A2C2D),
    onSurface        = Color(0xFFF0F0F0),
    surfaceVariant   = Color(0xFF243435),
    onSurfaceVariant = Color(0xFFAAAAAA),

    error            = Color(0xFFFF6B6B),
    onError          = Color.White,

    outline          = Color(0xFF2E4445)
)

@Composable
fun MansooTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content  : @Composable () -> Unit
) {
    val colors = if (darkTheme) DarkColorScheme else LightColorScheme

    MaterialTheme(
        colorScheme = colors,
        typography  = Typography,
        content     = content
    )
}
