package com.mansoo.app.ui.screens.splash

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mansoo.app.ui.theme.*
import kotlinx.coroutines.delay

@Composable
fun SplashScreen(onSplashFinished: () -> Unit) {

    // ── Animation animatables ─────────────────────────────────
    val logoScale    = remember { Animatable(0f) }
    val logoAlpha    = remember { Animatable(0f) }
    val titleAlpha   = remember { Animatable(0f) }
    val titleSlide   = remember { Animatable(30f) }
    val taglineAlpha = remember { Animatable(0f) }
    val bottomAlpha  = remember { Animatable(0f) }

    // ── Loading dot pulse ──────────────────────────────────────
    val infiniteTransition = rememberInfiniteTransition(label = "dots")
    val dot1Alpha by infiniteTransition.animateFloat(
        initialValue  = 0.3f, targetValue = 1f,
        animationSpec = infiniteRepeatable(tween(500), RepeatMode.Reverse),
        label = "d1"
    )
    val dot2Alpha by infiniteTransition.animateFloat(
        initialValue  = 0.3f, targetValue = 1f,
        animationSpec = infiniteRepeatable(tween(500, delayMillis = 166), RepeatMode.Reverse),
        label = "d2"
    )
    val dot3Alpha by infiniteTransition.animateFloat(
        initialValue  = 0.3f, targetValue = 1f,
        animationSpec = infiniteRepeatable(tween(500, delayMillis = 332), RepeatMode.Reverse),
        label = "d3"
    )

    LaunchedEffect(Unit) {
        // Logo pop-in
        logoScale.animateTo(1.0f, spring(Spring.DampingRatioLowBouncy, Spring.StiffnessMediumLow))
        logoAlpha.animateTo(1f, tween(300))
        delay(100)
        // Title slide up
        titleAlpha.animateTo(1f, tween(400))
        titleSlide.animateTo(0f, tween(400, easing = EaseOutCubic))
        delay(100)
        // Tagline + bottom fade
        taglineAlpha.animateTo(1f, tween(500))
        bottomAlpha.animateTo(1f, tween(600))
        // Hold then navigate
        delay(1400)
        onSplashFinished()
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.White)
    ) {

        // ── Decorative top-right arc ──────────────────────────
        Box(
            modifier = Modifier
                .size(300.dp)
                .align(Alignment.TopEnd)
                .offset(x = 100.dp, y = (-80).dp)
                .alpha(0.08f)
                .background(PrimaryGreen, CircleShape)
        )

        // ── Centre branding ───────────────────────────────────
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center,
            modifier = Modifier
                .align(Alignment.Center)
                .padding(horizontal = 32.dp)
        ) {
            // Logo circle — scale pop
            Box(
                contentAlignment = Alignment.Center,
                modifier = Modifier
                    .scale(logoScale.value)
                    .alpha(logoAlpha.value)
                    .size(110.dp)
                    .background(
                        Brush.linearGradient(listOf(PrimaryGreen, PrimaryGreenLight)),
                        CircleShape
                    )
            ) {
                Text(
                    "M",
                    color      = Color.White,
                    fontSize   = 66.sp,
                    fontFamily = FontFamily.Serif,
                    fontWeight = FontWeight.Bold,
                    textAlign  = TextAlign.Center
                )
            }

            Spacer(Modifier.height(22.dp))

            // App name — slide up
            Text(
                "Mansoo",
                fontFamily    = FontFamily.Serif,
                fontWeight    = FontWeight.ExtraBold,
                fontSize      = 42.sp,
                color         = PrimaryGreen,
                letterSpacing = 1.5.sp,
                modifier      = Modifier.graphicsLayer {
                    alpha        = titleAlpha.value
                    translationY = titleSlide.value
                }
            )

            Spacer(Modifier.height(6.dp))

            // Tagline — fade
            Text(
                "The Voice of Heart",
                fontFamily  = FontFamily.Serif,
                fontStyle   = FontStyle.Italic,
                fontSize    = 15.sp,
                color       = TextSecondary,
                letterSpacing = 0.5.sp,
                modifier    = Modifier.alpha(taglineAlpha.value)
            )

            Spacer(Modifier.height(40.dp))

            // Loading dots
            Row(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier.alpha(bottomAlpha.value)
            ) {
                listOf(dot1Alpha, dot2Alpha, dot3Alpha).forEach { dotAlpha ->
                    Box(
                        modifier = Modifier
                            .size(8.dp)
                            .alpha(dotAlpha)
                            .background(PrimaryGreen, CircleShape)
                    )
                }
            }
        }

        // ── Bottom banner ─────────────────────────────────────
        Box(
            contentAlignment = Alignment.Center,
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .fillMaxWidth()
                .height(90.dp)
                .clip(RoundedCornerShape(topStart = 40.dp, topEnd = 40.dp))
                .background(
                    Brush.horizontalGradient(listOf(PrimaryGreen, PrimaryGreenLight))
                )
                .alpha(bottomAlpha.value)
                .padding(bottom = 12.dp)
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.Center
            ) {
                Text(
                    "Made with pride in India",
                    fontSize   = 13.sp,
                    fontWeight = FontWeight.SemiBold,
                    color      = Color.White
                )
                Spacer(Modifier.width(6.dp))
                Text("🇮🇳", fontSize = 16.sp)
            }
        }
    }
}
