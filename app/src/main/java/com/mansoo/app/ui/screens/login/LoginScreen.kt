package com.mansoo.app.ui.screens.login

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.blur
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mansoo.app.ui.theme.*

@Composable
fun LoginScreen(
    onLoginSuccess  : () -> Unit = {},
    onGoogleSignIn  : () -> Unit = {},
    onNavigateSignup: () -> Unit = {}
) {
    var email          by remember { mutableStateOf("") }
    var password       by remember { mutableStateOf("") }
    var showPassword   by remember { mutableStateOf(false) }
    var isLoading      by remember { mutableStateOf(false) }
    var emailError     by remember { mutableStateOf(false) }
    var passwordError  by remember { mutableStateOf(false) }

    // ── Entry fade + slide-up animation ──────────────────────
    val contentAlpha = remember { Animatable(0f) }
    val contentSlide = remember { Animatable(60f) }
    LaunchedEffect(Unit) {
        contentAlpha.animateTo(1f, tween(700, easing = EaseOut))
        contentSlide.animateTo(0f, tween(700, easing = EaseOutBack))
    }

    // ── Background orb pulse ──────────────────────────────────
    val infiniteTransition = rememberInfiniteTransition(label = "orbs")
    val orb1Scale by infiniteTransition.animateFloat(
        initialValue  = 1f, targetValue = 1.15f,
        animationSpec = infiniteRepeatable(tween(3000, easing = EaseInOutSine), RepeatMode.Reverse),
        label = "orb1"
    )
    val orb2Scale by infiniteTransition.animateFloat(
        initialValue  = 1.1f, targetValue = 0.9f,
        animationSpec = infiniteRepeatable(tween(2500, easing = EaseInOutSine), RepeatMode.Reverse),
        label = "orb2"
    )

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.White)
    ) {

        // ── Decorative blurred orbs (background art) ──────────
        Box(
            modifier = Modifier
                .size(280.dp)
                .align(Alignment.TopEnd)
                .offset(x = 80.dp, y = (-40).dp)
                .scale(orb1Scale)
                .blur(60.dp)
                .background(AccentPink.copy(alpha = 0.25f), CircleShape)
        )
        Box(
            modifier = Modifier
                .size(220.dp)
                .align(Alignment.BottomStart)
                .offset(x = (-60).dp, y = 60.dp)
                .scale(orb2Scale)
                .blur(60.dp)
                .background(PrimaryGreen.copy(alpha = 0.20f), CircleShape)
        )

        // ── Main content ──────────────────────────────────────
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .graphicsLayer {
                    alpha           = contentAlpha.value
                    translationY    = contentSlide.value
                }
                .padding(horizontal = 28.dp)
        ) {

            Spacer(Modifier.height(64.dp))

            // Logo
            Box(
                contentAlignment = Alignment.Center,
                modifier = Modifier
                    .size(90.dp)
                    .background(
                        Brush.linearGradient(listOf(PrimaryGreen, PrimaryGreenLight)),
                        CircleShape
                    )
            ) {
                Text(
                    "M",
                    color      = Color.White,
                    fontSize   = 52.sp,
                    fontFamily = FontFamily.Serif,
                    fontWeight = FontWeight.Bold
                )
            }

            Spacer(Modifier.height(16.dp))

            Text(
                "Mansoo",
                fontFamily  = FontFamily.Serif,
                fontWeight  = FontWeight.ExtraBold,
                fontSize    = 34.sp,
                color       = PrimaryGreen,
                letterSpacing = 1.sp
            )
            Text(
                "The Voice of Heart",
                fontFamily  = FontFamily.Serif,
                fontStyle   = FontStyle.Italic,
                fontSize    = 13.sp,
                color       = TextSecondary
            )

            Spacer(Modifier.height(40.dp))

            // ── Card ──
            Surface(
                shape           = RoundedCornerShape(24.dp),
                shadowElevation = 8.dp,
                color           = Color.White,
                modifier        = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier.padding(24.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {

                    Text(
                        "Welcome back 👋",
                        fontWeight = FontWeight.Bold,
                        fontSize   = 22.sp,
                        color      = TextPrimary
                    )
                    Spacer(Modifier.height(4.dp))
                    Text(
                        "Sign in to continue writing your story",
                        fontSize  = 13.sp,
                        color     = TextSecondary,
                        textAlign = TextAlign.Center
                    )

                    Spacer(Modifier.height(24.dp))

                    // Email field
                    OutlinedTextField(
                        value         = email,
                        onValueChange = { email = it; emailError = false },
                        label         = { Text("Email") },
                        leadingIcon   = {
                            Icon(Icons.Outlined.Email, null,
                                tint = if (emailError) ErrorRed else PrimaryGreen)
                        },
                        isError       = emailError,
                        supportingText = if (emailError) {{ Text("Enter a valid email") }} else null,
                        shape         = RoundedCornerShape(14.dp),
                        keyboardOptions = KeyboardOptions(
                            keyboardType = KeyboardType.Email,
                            imeAction    = ImeAction.Next
                        ),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor    = PrimaryGreen,
                            focusedLabelColor     = PrimaryGreen,
                            focusedContainerColor = Color.White,
                            unfocusedContainerColor = Color.White
                        ),
                        modifier = Modifier.fillMaxWidth()
                    )

                    Spacer(Modifier.height(12.dp))

                    // Password field
                    OutlinedTextField(
                        value         = password,
                        onValueChange = { password = it; passwordError = false },
                        label         = { Text("Password") },
                        leadingIcon   = {
                            Icon(Icons.Outlined.Lock, null,
                                tint = if (passwordError) ErrorRed else PrimaryGreen)
                        },
                        trailingIcon  = {
                            IconButton(onClick = { showPassword = !showPassword }) {
                                Icon(
                                    if (showPassword) Icons.Outlined.VisibilityOff
                                    else Icons.Outlined.Visibility,
                                    "Toggle Password",
                                    tint = TextSecondary
                                )
                            }
                        },
                        isError       = passwordError,
                        supportingText = if (passwordError) {{ Text("Password must be 6+ chars") }} else null,
                        visualTransformation = if (showPassword) VisualTransformation.None
                                               else PasswordVisualTransformation(),
                        shape         = RoundedCornerShape(14.dp),
                        keyboardOptions = KeyboardOptions(
                            keyboardType = KeyboardType.Password,
                            imeAction    = ImeAction.Done
                        ),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor    = PrimaryGreen,
                            focusedLabelColor     = PrimaryGreen,
                            focusedContainerColor = Color.White,
                            unfocusedContainerColor = Color.White
                        ),
                        modifier = Modifier.fillMaxWidth()
                    )

                    // Forgot password
                    Text(
                        "Forgot password?",
                        fontSize   = 12.sp,
                        color      = PrimaryGreen,
                        fontWeight = FontWeight.SemiBold,
                        modifier   = Modifier
                            .align(Alignment.End)
                            .padding(top = 4.dp)
                            .clickable { }
                    )

                    Spacer(Modifier.height(20.dp))

                    // Sign In button
                    Button(
                        onClick = {
                            emailError    = email.isBlank() || !email.contains("@")
                            passwordError = password.length < 6
                            if (!emailError && !passwordError) {
                                isLoading = true
                                onLoginSuccess()
                            }
                        },
                        shape   = RoundedCornerShape(16.dp),
                        colors  = ButtonDefaults.buttonColors(containerColor = Color.Transparent),
                        contentPadding = PaddingValues(0.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(54.dp)
                            .background(
                                Brush.horizontalGradient(listOf(PrimaryGreen, PrimaryGreenLight)),
                                RoundedCornerShape(16.dp)
                            )
                    ) {
                        if (isLoading) {
                            CircularProgressIndicator(
                                color    = Color.White,
                                modifier = Modifier.size(22.dp),
                                strokeWidth = 2.dp
                            )
                        } else {
                            Text(
                                "Sign In",
                                fontWeight = FontWeight.Bold,
                                fontSize   = 16.sp,
                                color      = Color.White
                            )
                        }
                    }

                    Spacer(Modifier.height(16.dp))

                    // Divider
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Divider(modifier = Modifier.weight(1f), color = Color(0xFFEEEEEE))
                        Text(
                            "  or continue with  ",
                            fontSize = 12.sp,
                            color    = TextSecondary
                        )
                        Divider(modifier = Modifier.weight(1f), color = Color(0xFFEEEEEE))
                    }

                    Spacer(Modifier.height(16.dp))

                    // Google Sign In
                    OutlinedButton(
                        onClick  = onGoogleSignIn,
                        shape    = RoundedCornerShape(14.dp),
                        border   = ButtonDefaults.outlinedButtonBorder.copy(
                            width = 1.5.dp
                        ),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(50.dp)
                    ) {
                        Text("G", fontWeight = FontWeight.ExtraBold, fontSize = 18.sp,
                            color = Color(0xFF4285F4))
                        Spacer(Modifier.width(10.dp))
                        Text(
                            "Continue with Google",
                            fontWeight = FontWeight.SemiBold,
                            fontSize   = 14.sp,
                            color      = TextPrimary
                        )
                    }
                }
            }

            Spacer(Modifier.height(24.dp))

            // Sign up row
            Row(
                horizontalArrangement = Arrangement.Center,
                verticalAlignment     = Alignment.CenterVertically
            ) {
                Text("New to Mansoo?  ", fontSize = 14.sp, color = TextSecondary)
                Text(
                    "Create Account",
                    fontSize   = 14.sp,
                    fontWeight = FontWeight.Bold,
                    color      = PrimaryGreen,
                    modifier   = Modifier.clickable { onNavigateSignup() }
                )
            }

            Spacer(Modifier.height(32.dp))
        }
    }
}
