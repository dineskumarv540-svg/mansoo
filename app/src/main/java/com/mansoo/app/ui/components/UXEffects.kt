package com.mansoo.app.ui.components

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.composed
import androidx.compose.ui.draw.blur
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

// ─────────────────────────────────────────────────────────────
// TAP FEEDBACK — spring scale micro-interaction
// ─────────────────────────────────────────────────────────────

/**
 * Adds a spring-bounce scale press feedback to any composable.
 *
 * Usage:
 *   Box(modifier = Modifier.tapFeedback { doSomething() }) { ... }
 */
fun Modifier.tapFeedback(
    scaleDown : Float  = 0.94f,
    stiffness : Float  = Spring.StiffnessHigh,
    damping   : Float  = Spring.DampingRatioMediumBouncy,
    onClick   : () -> Unit
): Modifier = composed {
    val interactionSource = remember { MutableInteractionSource() }
    val isPressed by interactionSource.collectIsPressedAsState()

    val scale by animateFloatAsState(
        targetValue   = if (isPressed) scaleDown else 1f,
        animationSpec = spring(damping, stiffness),
        label         = "tapScale"
    )

    this
        .scale(scale)
        .clickable(
            interactionSource = interactionSource,
            indication        = null,
            onClick           = onClick
        )
}

// ─────────────────────────────────────────────────────────────
// BLUR MODAL OVERLAY — frosted glass scrim behind bottom sheets
// ─────────────────────────────────────────────────────────────

/**
 * Renders a blurred frosted-glass scrim behind any modal content.
 * Place this before your modal composable in a Box layout.
 *
 * Usage:
 *   Box(Modifier.fillMaxSize()) {
 *       // main content
 *       if (showModal) {
 *           BlurScrim(onDismiss = { showModal = false })
 *           YourModalContent(...)
 *       }
 *   }
 */
@Composable
fun BlurScrim(
    onDismiss : () -> Unit  = {},
    blurRadius: Dp          = 16.dp,
    tintAlpha : Float       = 0.45f
) {
    val alphaAnim = remember { Animatable(0f) }
    LaunchedEffect(Unit) {
        alphaAnim.animateTo(1f, tween(220, easing = EaseOut))
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .blur(blurRadius)
            .background(Color.Black.copy(alpha = tintAlpha * alphaAnim.value))
            .clickable(
                interactionSource = remember { MutableInteractionSource() },
                indication        = null,
                onClick           = onDismiss
            )
    )
}

// ─────────────────────────────────────────────────────────────
// SMOOTH SCROLL PHYSICS — helper Modifier alias
// ─────────────────────────────────────────────────────────────

/**
 * Compose's default fling already uses AndroidFlingDecay which
 * gives smooth momentum. This helper documents the recommended
 * scroll configuration for lists in this project.
 *
 * For LazyColumn / LazyRow:
 *   Use default `rememberLazyListState()` — no extra config needed.
 *
 * For custom scrollable containers that need snapping:
 *   val flingBehavior = rememberSnapFlingBehavior(lazyListState)
 *
 * Example:
 *   LazyRow(
 *       state         = rememberLazyListState(),
 *       flingBehavior = rememberSnapFlingBehavior(lazyListState)
 *   ) { ... }
 */
object SmoothScrollDefaults {
    /** Standard horizontal snap fling spec for featured/category rows */
    val SnapFlingSpec = spring<Float>(
        dampingRatio = Spring.DampingRatioMediumBouncy,
        stiffness    = Spring.StiffnessMedium
    )
}
