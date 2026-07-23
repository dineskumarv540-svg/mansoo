import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

export default function PostOptionsSheet({ visible, post, onClose, onOptionSelect }) {
  const [notificationsOn, setNotificationsOn] = useState(false);
  const [unfollowed, setUnfollowed] = useState(false);

  if (!visible) return null;

  const handleOption = (key) => {
    if (key === 'notifications') {
      setNotificationsOn(prev => !prev);
      onOptionSelect && onOptionSelect(`Notifications ${!notificationsOn ? 'turned on' : 'turned off'}`);
    } else if (key === 'unfollow') {
      setUnfollowed(prev => !prev);
      onOptionSelect && onOptionSelect(`${!unfollowed ? 'Unfollowed' : 'Followed'} author`);
    } else {
      onOptionSelect && onOptionSelect(key);
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.sheetContainer}>
              {/* Drag Handle */}
              <View style={styles.dragHandle} />

              {/* Header Preview */}
              {post ? (
                <View style={styles.previewHeader}>
                  <Text style={styles.authorName}>{post.authorName}</Text>
                  <Text style={styles.previewText} numberOfLines={1}>
                    "{post.quoteText}"
                  </Text>
                </View>
              ) : null}

              {/* Option List */}
              <TouchableOpacity
                style={styles.optionRow}
                onPress={() => handleOption('Share to Story')}
              >
                <View style={[styles.iconBox, { backgroundColor: '#F3E5F5' }]}>
                  <Ionicons name="sparkles-outline" size={20} color="#9C27B0" />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionLabel}>Share to Story</Text>
                  <Text style={styles.optionSublabel}>Add this post to your story</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionRow}
                onPress={() => handleOption('Copy Link')}
              >
                <View style={[styles.iconBox, { backgroundColor: '#E0F2F1' }]}>
                  <Ionicons name="copy-outline" size={20} color="#009688" />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionLabel}>Copy Link</Text>
                  <Text style={styles.optionSublabel}>Copy post link to clipboard</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionRow}
                onPress={() => handleOption('notifications')}
              >
                <View style={[styles.iconBox, { backgroundColor: '#FFF3E0' }]}>
                  <Ionicons
                    name={notificationsOn ? "notifications-off-outline" : "notifications-outline"}
                    size={20}
                    color="#FF9800"
                  />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionLabel}>
                    {notificationsOn ? "Turn off notifications" : "Turn on notifications"}
                  </Text>
                  <Text style={styles.optionSublabel}>Get updates when people react</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionRow}
                onPress={() => handleOption('unfollow')}
              >
                <View style={[styles.iconBox, { backgroundColor: '#E8F5E9' }]}>
                  <Ionicons
                    name={unfollowed ? "person-add-outline" : "person-remove-outline"}
                    size={20}
                    color="#4CAF50"
                  />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionLabel}>
                    {unfollowed ? `Follow ${post?.authorName || ''}` : `Unfollow ${post?.authorName || ''}`}
                  </Text>
                  <Text style={styles.optionSublabel}>Stop seeing posts from this user</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionRow}
                onPress={() => handleOption('Edit Post')}
              >
                <View style={[styles.iconBox, { backgroundColor: '#E3F2FD' }]}>
                  <Ionicons name="create-outline" size={20} color="#2196F3" />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionLabel}>Edit Post</Text>
                  <Text style={styles.optionSublabel}>Modify quote text, style or background</Text>
                </View>
              </TouchableOpacity>

              {/* Danger Zone Divider */}
              <View style={styles.divider} />

              <TouchableOpacity
                style={styles.optionRow}
                onPress={() => handleOption('Delete Post')}
              >
                <View style={[styles.iconBox, { backgroundColor: '#FFEBEE' }]}>
                  <Ionicons name="trash-outline" size={20} color={COLORS.error} />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={[styles.optionLabel, { color: COLORS.error }]}>Delete Post</Text>
                  <Text style={[styles.optionSublabel, { color: COLORS.error }]}>Permanently remove this post</Text>
                </View>
              </TouchableOpacity>

            </View>
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
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingBottom: 32,
    paddingHorizontal: 20,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#DDDDDD',
    alignSelf: 'center',
    marginBottom: 12,
  },
  previewHeader: {
    paddingBottom: 12,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  authorName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  previewText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  optionSublabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#F5F5F5',
    marginVertical: 6,
  },
});
