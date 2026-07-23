package com.mansoo.app.ui.components

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mansoo.app.data.model.Post
import com.mansoo.app.ui.theme.TextPrimary

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PostOptionsMenu(
    post: Post,
    onDismiss: () -> Unit,
    onActionSelected: (String) -> Unit
) {
    ModalBottomSheet(
        onDismissRequest = onDismiss,
        shape = RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp),
        containerColor = MaterialTheme.colorScheme.surface
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 32.dp, top = 8.dp)
        ) {
            Text(
                text = "Post Options",
                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                modifier = Modifier.padding(horizontal = 24.dp, vertical = 12.dp)
            )
            Divider(color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.1f))

            OptionMenuItem(
                icon = Icons.Outlined.AutoAwesome,
                label = "Share to Story",
                onClick = { onActionSelected("Share to Story"); onDismiss() }
            )
            OptionMenuItem(
                icon = Icons.Outlined.ContentCopy,
                label = "Copy link",
                onClick = { onActionSelected("Copy link"); onDismiss() }
            )
            OptionMenuItem(
                icon = Icons.Outlined.NotificationsActive,
                label = "Turn on post notifications",
                onClick = { onActionSelected("Turn on post notifications"); onDismiss() }
            )
            OptionMenuItem(
                icon = Icons.Outlined.PersonRemove,
                label = "Unfollow ${post.authorName}",
                onClick = { onActionSelected("Unfollow"); onDismiss() }
            )
            OptionMenuItem(
                icon = Icons.Outlined.Report,
                label = "Report Post",
                textColor = MaterialTheme.colorScheme.error,
                onClick = { onActionSelected("Report"); onDismiss() }
            )
        }
    }
}

@Composable
private fun OptionMenuItem(
    icon: ImageVector,
    label: String,
    textColor: androidx.compose.ui.graphics.Color = TextPrimary,
    onClick: () -> Unit
) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick)
            .padding(horizontal = 24.dp, vertical = 14.dp)
    ) {
        Icon(
            imageVector = icon,
            contentDescription = label,
            tint = textColor,
            modifier = Modifier.size(22.dp)
        )
        Spacer(modifier = Modifier.width(16.dp))
        Text(
            text = label,
            color = textColor,
            fontSize = 15.sp,
            fontWeight = FontWeight.Medium
        )
    }
}
