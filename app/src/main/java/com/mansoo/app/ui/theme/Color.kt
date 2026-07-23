package com.mansoo.app.ui.theme

import androidx.compose.ui.graphics.Color

// ── Primary palette (spec) ─────────────────────────────────
val PrimaryGreen      = Color(0xFF0F3D3E)   // primary dark green
val PrimaryGreenLight = Color(0xFF11998E)   // lighter green tint
val AccentPink        = Color(0xFFF26B8A)   // accent pink highlight
val AccentPinkDark    = Color(0xFFD94F6E)   // deeper pink for pressed/active

// Backward-compat aliases used across the codebase
val PrimaryPink       = AccentPink
val PrimaryPinkDark   = AccentPinkDark
val AccentOrange      = Color(0xFFFF8C00)

// ── Gradient pairs ─────────────────────────────────────────
// Main brand gradient (dark-green → teal)
val GradientStart     = Color(0xFF0F3D3E)
val GradientEnd       = Color(0xFF11998E)

// Warm accent gradient (pink → coral) — used for FAB / CTAs
val GradientPinkStart = Color(0xFFF26B8A)
val GradientPinkEnd   = Color(0xFFFF8C69)

// ── Surfaces & Backgrounds ─────────────────────────────────
val CardBackground    = Color(0xFFFFFFFF)
val SurfaceLight      = Color(0xFFFAFAFA)
val BackgroundLight   = Color(0xFFF6F7F9)   // very subtle warm-white

// ── Text ──────────────────────────────────────────────────
val TextPrimary       = Color(0xFF222222)   // spec: #222222
val TextSecondary     = Color(0xFF888888)   // spec: #888888
val TextMuted         = Color(0xFFBBBBBB)

// ── Status / Badges ───────────────────────────────────────
val VerifiedBlue      = Color(0xFF1DA1F2)
val GoldPremium       = Color(0xFFFFB300)
val LikeRed           = Color(0xFFE53935)
val SuccessGreen      = Color(0xFF4CAF50)
val ErrorRed          = Color(0xFFE53935)
