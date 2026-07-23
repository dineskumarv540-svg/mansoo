package com.mansoo.app.ui.components

import androidx.compose.animation.core.*
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Box
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import kotlinx.coroutines.launch

/**
 * Like button scale + bounce animation.
 *
 * Usage:
 *   var liked by remember { mutableStateOf(false) }
 *   val likeAnim = rememberLikeAnimation()
 *   Icon(
 *       ...,
 *       tint     = if (liked) LikeRed else Color.Gray,
 *       modifier = Modifier
 *           .likeAnimatable(likeAnim)
 *           .clickable { liked = !liked; likeAnim.trigger() }
 *   )
 */

class LikeAnimationState {
    val scale  = Animatable(1f)
    private var isAnimating = false

    suspend fun trigger() {
        if (isAnimating) return
        isAnimating = true
        // Bounce sequence: grow → overshoot → settle
        scale.animateTo(
            targetValue   = 1.35f,
            animationSpec = spring(
                dampingRatio = Spring.DampingRatioLowBouncy,
                stiffness    = Spring.StiffnessMedium
            )
        )
        scale.animateTo(
            targetValue   = 0.88f,
            animationSpec = tween(80)
        )
        scale.animateTo(
            targetValue   = 1.0f,
            animationSpec = spring(
                dampingRatio = Spring.DampingRatioMediumBouncy,
                stiffness    = Spring.StiffnessMediumLow
            )
        )
        isAnimating = false
    }
}

@Composable
fun rememberLikeAnimation(): LikeAnimationState {
    return remember { LikeAnimationState() }
}

/** Applies the scale from a [LikeAnimationState] to any modifier chain. */
fun Modifier.likeAnimatable(state: LikeAnimationState): Modifier =
    this.scale(state.scale.value)

/**
 * Ready-to-use animated like icon wrapper.
 * Wraps any content (icon/button) with scale+bounce on click.
 */
@Composable
fun AnimatedLikeButton(
    isLiked   : Boolean,
    onToggle  : () -> Unit,
    modifier  : Modifier = Modifier,
    content   : @Composable (isLiked: Boolean) -> Unit
) {
    val animState   = rememberLikeAnimation()
    val scope       = rememberCoroutineScope()
    val interSource = remember { MutableInteractionSource() }

    Box(
        modifier = modifier
            .scale(animState.scale.value)
            .clickable(
                interactionSource = interSource,
                indication        = null
            ) {
                onToggle()
                scope.launch { animState.trigger() }
            }
    ) {
        content(isLiked)
    }
}
