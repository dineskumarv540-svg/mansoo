package com.mansoo.app.ui.components

import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mansoo.app.data.model.Post
import com.mansoo.app.ui.theme.*

// ── Option types ──────────────────────────────────────────────
private enum class OptionStyle { NORMAL, DANGER }

private data class SheetOption(
    val icon       : ImageVector,
    val label      : String,
    val sublabel   : String? = null,
    val actionKey  : String,
    val style      : OptionStyle = OptionStyle.NORMAL,
    val iconBgBrush: Brush? = null
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PostOptionsMenu(
    post            : Post,
    onDismiss       : () -> Unit,
    onActionSelected: (String) -> Unit
) {
    var notifOn         by remember { mutableStateOf(false) }
    var unfollowed      by remember { mutableStateOf(false) }
    var showReportSheet by remember { mutableStateOf(false) }

    val options = listOf(
        SheetOption(
            icon        = Icons.Outlined.AutoAwesome,
            label       = "Share to Story",
            sublabel    = "Add this post to your story",
            actionKey   = "Share to Story",
            iconBgBrush = Brush.linearGradient(listOf(Color(0xFFDA22FF), Color(0xFF9733EE)))
        ),
        SheetOption(
            icon        = Icons.Outlined.ContentCopy,
            label       = "Copy Link",
            sublabel    = "Copy post link to clipboard",
            actionKey   = "Copy Link",
            iconBgBrush = Brush.linearGradient(listOf(GradientStart, GradientEnd))
        ),
        SheetOption(
            icon        = if (notifOn) Icons.Outlined.NotificationsOff else Icons.Outlined.NotificationsActive,
            label       = if (notifOn) "Turn off notifications" else "Turn on notifications",
            sublabel    = if (notifOn) "Stop updates from this post" else "Get updates when someone likes or comments",
            actionKey   = "Toggle Notifications",
            iconBgBrush = Brush.linearGradient(listOf(Color(0xFFF7971E), Color(0xFFFFD200)))
        ),
        SheetOption(
            icon        = if (unfollowed) Icons.Outlined.PersonAdd else Icons.Outlined.PersonRemove,
            label       = if (unfollowed) "Follow ${post.authorName}" else "Unfollow ${post.authorName}",
            sublabel    = if (unfollowed) "Follow to see their posts" else "Stop seeing posts from this account",
            actionKey   = "Toggle Follow",
            iconBgBrush = Brush.linearGradient(listOf(Color(0xFF11998E), Color(0xFF38EF7D)))
        ),
        SheetOption(
            icon      = Icons.Outlined.Report,
            label     = "Report Post",
            sublabel  = "We'll review this and take action",
            actionKey = "Report",
            style     = OptionStyle.DANGER
        )
    )

    ModalBottomSheet(
        onDismissRequest = onDismiss,
        shape            = RoundedCornerShape(topStart = 28.dp, topEnd = 28.dp),
        containerColor   = Color.White,
        dragHandle       = null
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 36.dp)
        ) {

            // ── Drag handle ──────────────────────────────────
            Box(
                modifier = Modifier
                    .padding(top = 14.dp, bottom = 6.dp)
                    .width(40.dp)
                    .height(4.dp)
                    .clip(CircleShape)
                    .background(Color(0xFFDDDDDD))
                    .align(Alignment.CenterHorizontally)
            )

            // ── Post mini-preview header ─────────────────────
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp, vertical = 14.dp)
            ) {
                // Author avatar
                Box(
                    modifier = Modifier
                        .size(44.dp)
                        .clip(CircleShape)
                        .background(Color(0xFFEEEEEE))
                )

                Spacer(Modifier.width(12.dp))

                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        post.authorName,
                        fontWeight = FontWeight.Bold,
                        fontSize   = 14.sp,
                        color      = TextPrimary
                    )
                    Text(
                        post.quoteText.take(50) + if (post.quoteText.length > 50) "…" else "",
                        fontSize = 12.sp,
                        color    = TextSecondary,
                        maxLines = 1
                    )
                }

                // Gradient quote icon badge
                Box(
                    contentAlignment = Alignment.Center,
                    modifier = Modifier
                        .size(36.dp)
                        .clip(RoundedCornerShape(10.dp))
                        .background(
                            Brush.linearGradient(listOf(GradientStart, GradientEnd))
                        )
                ) {
                    Icon(
                        Icons.Outlined.FormatQuote,
                        null,
                        tint     = Color.White,
                        modifier = Modifier.size(20.dp)
                    )
                }
            }

            Divider(color = Color(0xFFF2F2F2), thickness = 1.dp)

            Spacer(Modifier.height(6.dp))

            // ── Menu items ───────────────────────────────────
            options.forEachIndexed { index, option ->
                val isDanger = option.style == OptionStyle.DANGER

                // Animate each item in with a stagger
                var visible by remember { mutableStateOf(false) }
                LaunchedEffect(Unit) {
                    kotlinx.coroutines.delay(index * 40L)
                    visible = true
                }

                AnimatedVisibility(
                    visible = visible,
                    enter   = fadeIn(tween(200)) + slideInVertically(
                        initialOffsetY = { 20 },
                        animationSpec  = tween(200)
                    )
                ) {
                    OptionsRow(
                        icon        = option.icon,
                        label       = option.label,
                        sublabel    = option.sublabel,
                        isDanger    = isDanger,
                        iconBgBrush = option.iconBgBrush,
                        onClick     = {
                            when (option.actionKey) {
                                "Toggle Notifications" -> notifOn = !notifOn
                                "Toggle Follow"        -> unfollowed = !unfollowed
                                "Report"               -> showReportSheet = true
                                else -> {
                                    onActionSelected(option.actionKey)
                                    onDismiss()
                                }
                            }
                            if (option.actionKey !in listOf("Toggle Notifications", "Toggle Follow", "Report")) return@OptionsRow
                            if (option.actionKey != "Report") {
                                onActionSelected(option.actionKey)
                            }
                        }
                    )
                }

                // Divider before Report (danger zone separator)
                if (index == options.size - 2) {
                    Divider(
                        color = Color(0xFFF5F5F5),
                        thickness = 6.dp,
                        modifier  = Modifier.padding(vertical = 4.dp)
                    )
                }
            }
        }
    }

    // ── Report Reason Sub-sheet ──────────────────────────────
    if (showReportSheet) {
        ReportSheet(
            onDismiss = { showReportSheet = false },
            onReport  = { reason ->
                onActionSelected("Report: $reason")
                showReportSheet = false
                onDismiss()
            }
        )
    }
}

// ─────────────────────────────────────────────────────────────
// SINGLE OPTION ROW
// ─────────────────────────────────────────────────────────────
@Composable
private fun OptionsRow(
    icon        : ImageVector,
    label       : String,
    sublabel    : String?,
    isDanger    : Boolean,
    iconBgBrush : Brush?,
    onClick     : () -> Unit
) {
    val iconColor    = if (isDanger) Color(0xFFE53935) else Color.White
    val labelColor   = if (isDanger) Color(0xFFE53935) else TextPrimary
    val subColor     = if (isDanger) Color(0xFFE53935).copy(0.7f) else TextSecondary

    // Press scale animation
    val interactionSource = remember { androidx.compose.foundation.interaction.MutableInteractionSource() }
    val isPressed by interactionSource.collectIsPressedAsState()
    val scale by animateFloatAsState(
        targetValue    = if (isPressed) 0.97f else 1f,
        animationSpec  = spring(stiffness = Spring.StiffnessHigh),
        label          = "rowScale"
    )

    Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = Modifier
            .fillMaxWidth()
            .scale(scale)
            .clickable(
                interactionSource = interactionSource,
                indication        = null,
                onClick           = onClick
            )
            .padding(horizontal = 20.dp, vertical = 10.dp)
    ) {
        // Icon container
        Box(
            contentAlignment = Alignment.Center,
            modifier = Modifier
                .size(44.dp)
                .clip(RoundedCornerShape(14.dp))
                .background(
                    brush = iconBgBrush
                        ?: Brush.linearGradient(
                            listOf(Color(0xFFFFEBEE), Color(0xFFFFCDD2))
                        )
                )
        ) {
            Icon(
                imageVector        = icon,
                contentDescription = label,
                tint               = iconColor,
                modifier           = Modifier.size(22.dp)
            )
        }

        Spacer(Modifier.width(14.dp))

        // Labels
        Column(modifier = Modifier.weight(1f)) {
            Text(
                label,
                fontWeight = FontWeight.SemiBold,
                fontSize   = 15.sp,
                color      = labelColor
            )
            if (sublabel != null) {
                Text(
                    sublabel,
                    fontSize = 12.sp,
                    color    = subColor
                )
            }
        }

        // Chevron (not for danger)
        if (!isDanger) {
            Icon(
                Icons.Outlined.ChevronRight,
                null,
                tint     = Color(0xFFCCCCCC),
                modifier = Modifier.size(18.dp)
            )
        }
    }
}

// ─────────────────────────────────────────────────────────────
// REPORT REASON SUB-SHEET
// ─────────────────────────────────────────────────────────────
@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun ReportSheet(
    onDismiss: () -> Unit,
    onReport : (String) -> Unit
) {
    val reasons = listOf(
        "Spam or misleading"          to Icons.Outlined.Block,
        "Hate speech or harassment"   to Icons.Outlined.VolunteerActivism,
        "Nudity or sexual content"    to Icons.Outlined.VisibilityOff,
        "Violence or dangerous acts"  to Icons.Outlined.Warning,
        "Intellectual property issue" to Icons.Outlined.Copyright,
        "I just don't like it"        to Icons.Outlined.ThumbDown
    )

    ModalBottomSheet(
        onDismissRequest = onDismiss,
        shape            = RoundedCornerShape(topStart = 28.dp, topEnd = 28.dp),
        containerColor   = Color.White,
        dragHandle       = null
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 36.dp)
        ) {
            // Handle
            Box(
                modifier = Modifier
                    .padding(top = 14.dp, bottom = 6.dp)
                    .width(40.dp)
                    .height(4.dp)
                    .clip(CircleShape)
                    .background(Color(0xFFDDDDDD))
                    .align(Alignment.CenterHorizontally)
            )

            // Header
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.padding(horizontal = 20.dp, vertical = 14.dp)
            ) {
                Box(
                    contentAlignment = Alignment.Center,
                    modifier = Modifier
                        .size(36.dp)
                        .clip(RoundedCornerShape(10.dp))
                        .background(Color(0xFFFFEBEE))
                ) {
                    Icon(
                        Icons.Outlined.Report,
                        null,
                        tint     = Color(0xFFE53935),
                        modifier = Modifier.size(20.dp)
                    )
                }
                Spacer(Modifier.width(12.dp))
                Column {
                    Text(
                        "Report Post",
                        fontWeight = FontWeight.Bold,
                        fontSize   = 16.sp,
                        color      = TextPrimary
                    )
                    Text(
                        "Why are you reporting this?",
                        fontSize = 12.sp,
                        color    = TextSecondary
                    )
                }
            }

            Divider(color = Color(0xFFF2F2F2))

            // Reason list
            reasons.forEach { (reason, icon) ->
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { onReport(reason) }
                        .padding(horizontal = 20.dp, vertical = 14.dp)
                ) {
                    Icon(
                        icon,
                        null,
                        tint     = Color(0xFFE53935).copy(alpha = 0.7f),
                        modifier = Modifier.size(20.dp)
                    )
                    Spacer(Modifier.width(14.dp))
                    Text(
                        reason,
                        fontSize   = 14.sp,
                        fontWeight = FontWeight.Medium,
                        color      = TextPrimary,
                        modifier   = Modifier.weight(1f)
                    )
                    Icon(
                        Icons.Outlined.ChevronRight,
                        null,
                        tint     = Color(0xFFCCCCCC),
                        modifier = Modifier.size(18.dp)
                    )
                }
                Divider(color = Color(0xFFF9F9F9), modifier = Modifier.padding(start = 54.dp))
            }
        }
    }
}
