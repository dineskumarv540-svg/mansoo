import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

const SAMPLE_COMMENTS = [
  {
    id: 'c1',
    userName: 'Priya Verma',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    text: 'These words touch the deepest corner of my heart! ✨',
    time: '25m ago',
    likesCount: 14,
    isLiked: true,
  },
  {
    id: 'c2',
    userName: 'Rohan Mehta',
    userAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200',
    text: 'Incredible writing brother! Keep inspiring us. 🔥',
    time: '1h ago',
    likesCount: 8,
    isLiked: false,
  },
  {
    id: 'c3',
    userName: 'Ananya Roy',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    text: 'So relatable and beautifully composed ❤️',
    time: '3h ago',
    likesCount: 22,
    isLiked: true,
  },
];

export default function CommentsModal({ visible, post, onClose }) {
  const [comments, setComments] = useState(SAMPLE_COMMENTS);
  const [newCommentText, setNewCommentText] = useState('');

  if (!visible) return null;

  const handleAddComment = () => {
    if (!newCommentText.trim()) return;

    const newComment = {
      id: 'c_' + Date.now(),
      userName: 'Aarav Sharma',
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
      text: newCommentText.trim(),
      time: 'Just now',
      likesCount: 0,
      isLiked: false,
    };

    setComments(prev => [newComment, ...prev]);
    setNewCommentText('');
  };

  const toggleCommentLike = (id) => {
    setComments(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          isLiked: !c.isLiked,
          likesCount: c.isLiked ? c.likesCount - 1 : c.likesCount + 1,
        };
      }
      return c;
    }));
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.container}
            >
              {/* Drag Handle */}
              <View style={styles.dragHandle} />

              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.headerTitle}>Comments ({comments.length})</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <Ionicons name="close-circle-outline" size={24} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>

              {/* Comments List */}
              <FlatList
                data={comments}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <View style={styles.commentItem}>
                    <Image source={{ uri: item.userAvatar }} style={styles.avatar} />
                    <View style={styles.commentContent}>
                      <View style={styles.nameTimeRow}>
                        <Text style={styles.userName}>{item.userName}</Text>
                        <Text style={styles.timeText}>{item.time}</Text>
                      </View>
                      <Text style={styles.commentText}>{item.text}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.likeBtn}
                      onPress={() => toggleCommentLike(item.id)}
                    >
                      <Ionicons
                        name={item.isLiked ? "heart" : "heart-outline"}
                        size={16}
                        color={item.isLiked ? COLORS.likeRed : COLORS.textSecondary}
                      />
                      <Text style={styles.commentLikesCount}>{item.likesCount}</Text>
                    </TouchableOpacity>
                  </View>
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listPadding}
              />

              {/* Comment Input */}
              <View style={styles.inputRow}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200' }}
                  style={styles.inputAvatar}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Add a comment as Aarav..."
                  placeholderTextColor="#AAAAAA"
                  value={newCommentText}
                  onChangeText={setNewCommentText}
                />
                <TouchableOpacity
                  style={[styles.sendBtn, !newCommentText.trim() && styles.sendBtnDisabled]}
                  onPress={handleAddComment}
                  disabled={!newCommentText.trim()}
                >
                  <Ionicons name="send" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '65%',
    paddingTop: 12,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#DDDDDD',
    alignSelf: 'center',
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  closeBtn: {
    padding: 2,
  },
  listPadding: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  commentContent: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 14,
    padding: 10,
  },
  nameTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  userName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  timeText: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  commentText: {
    fontSize: 13,
    color: COLORS.textPrimary,
    lineHeight: 18,
  },
  likeBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 10,
  },
  commentLikesCount: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
  },
  inputAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 13,
    color: COLORS.textPrimary,
    marginRight: 10,
  },
  sendBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: '#CCCCCC',
  },
});
