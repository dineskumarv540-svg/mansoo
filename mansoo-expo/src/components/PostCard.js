import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AnimatedHeart from './AnimatedHeart';
import { COLORS } from '../theme/colors';
import { togglePostLikeInFirestore } from '../services/firebaseDb';

const PostCard = React.memo(function PostCard({ post, onLikeClick, onOptionsPress, onCommentPress, onSharePress }) {
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [isSaved, setIsSaved] = useState(post.isSaved || false);

  const toggleLike = () => {
    const nextState = !isLiked;
    setIsLiked(nextState);
    setLikesCount(prev => (isLiked ? prev - 1 : prev + 1));
    if (onLikeClick) {
      onLikeClick(post);
    } else {
      togglePostLikeInFirestore(post.id, 'u1', nextState);
    }
  };

  const toggleSave = () => {
    setIsSaved(prev => !prev);
  };

  return (
    <View style={styles.card}>
      {/* 1. Header: Avatar + Username + 3-dot Menu */}
      <View style={styles.header}>
        <Image source={{ uri: post.authorAvatarUrl }} style={styles.avatar} />
        <View style={styles.headerTextContainer}>
          <View style={styles.nameRow}>
            <Text style={styles.authorName}>{post.authorName}</Text>
            {post.isVerified && (
              <Ionicons name="checkmark-circle" size={14} color={COLORS.verified} style={{ marginLeft: 4 }} />
            )}
          </View>
          <Text style={styles.authorHandle}>{post.authorHandle} • {post.timeAgo || 'Just now'}</Text>
        </View>

        <TouchableOpacity onPress={() => onOptionsPress && onOptionsPress(post)} style={styles.menuButton}>
          <Ionicons name="ellipsis-horizontal" size={20} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* 2. Main Post Canvas */}
      <View style={styles.canvasContainer}>
        {post.backgroundImageUrl ? (
          <Image source={{ uri: post.backgroundImageUrl }} style={styles.canvasBgImage} />
        ) : null}

        <LinearGradient
          colors={post.backgroundImageUrl ? ['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.65)'] : COLORS.gradientGreen}
          style={styles.canvasGradient}
        >
          <Text style={styles.quoteText}>
            "{post.quoteText}"
          </Text>

          <Text style={styles.watermark}>Mansoo.in</Text>
        </LinearGradient>
      </View>

      {/* 3. Action Buttons Row: ❤️ 💬 🔗 🔖 */}
      <View style={styles.actionsRow}>
        <View style={styles.leftActions}>
          <AnimatedHeart isLiked={isLiked} onToggle={toggleLike} size={24} />

          <TouchableOpacity onPress={() => onCommentPress && onCommentPress(post)} style={styles.iconButton}>
            <Ionicons name="chatbubble-outline" size={22} color={COLORS.textPrimary} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => onSharePress && onSharePress(post)} style={styles.iconButton}>
            <Ionicons name="paper-plane-outline" size={22} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={toggleSave} style={styles.iconButton}>
          <Ionicons
            name={isSaved ? "bookmark" : "bookmark-outline"}
            size={22}
            color={isSaved ? COLORS.primary : COLORS.textPrimary}
          />
        </TouchableOpacity>
      </View>

      {/* 4. Likes & Comments Summary */}
      <View style={styles.footer}>
        <Text style={styles.likesCountText}>
          Liked by <Text style={styles.boldText}>Story_of_love</Text> and <Text style={styles.boldText}>{likesCount} others</Text>
        </Text>

        <TouchableOpacity onPress={() => onCommentPress && onCommentPress(post)}>
          <Text style={styles.viewCommentsText}>View all {post.commentsCount || 12} comments</Text>
        </TouchableOpacity>

        {post.commentPreview ? (
          <Text style={styles.commentPreviewText} numberOfLines={1}>
            <Text style={styles.boldText}>Username: </Text>{post.commentPreview}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 12,
    marginVertical: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  authorHandle: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  menuButton: {
    padding: 4,
  },
  canvasContainer: {
    width: '100%',
    height: 250,
    position: 'relative',
    backgroundColor: '#0F3D3E',
  },
  canvasBgImage: {
    ...StyleSheet.absoluteFillObject,
  },
  canvasGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  quoteText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontStyle: 'italic',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 26,
  },
  watermark: {
    position: 'absolute',
    bottom: 10,
    right: 14,
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
    fontWeight: 'bold',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 6,
    marginLeft: 8,
  },
  footer: {
    paddingHorizontal: 14,
    paddingBottom: 12,
  },
  likesCountText: {
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  boldText: {
    fontWeight: 'bold',
  },
  viewCommentsText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
});

export default PostCard;
