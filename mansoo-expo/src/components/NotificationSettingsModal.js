import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Switch,
  ScrollView,
  TouchableWithoutFeedback
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

export default function NotificationSettingsModal({ visible, onClose }) {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [likesEnabled, setLikesEnabled] = useState(true);
  const [commentsEnabled, setCommentsEnabled] = useState(true);
  const [repliesEnabled, setRepliesEnabled] = useState(true);
  const [mentionsEnabled, setMentionsEnabled] = useState(true);
  const [followersEnabled, setFollowersEnabled] = useState(true);

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.card}>
              <View style={styles.dragHandle} />

              <View style={styles.header}>
                <Text style={styles.headerTitle}>Notification Settings</Text>
                <TouchableOpacity onPress={onClose}>
                  <Ionicons name="close-circle-outline" size={24} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                {/* Global Push */}
                <View style={styles.row}>
                  <View style={styles.rowLeft}>
                    <Ionicons name="notifications" size={20} color={COLORS.primary} style={styles.rowIcon} />
                    <View>
                      <Text style={styles.rowTitle}>Allow Push Notifications</Text>
                      <Text style={styles.rowSub}>Receive instant alerts on your device</Text>
                    </View>
                  </View>
                  <Switch
                    value={pushEnabled}
                    onValueChange={setPushEnabled}
                    trackColor={{ false: '#DDDDDD', true: COLORS.primaryLight }}
                    thumbColor={COLORS.primary}
                  />
                </View>

                <View style={styles.divider} />

                {/* Likes */}
                <View style={styles.row}>
                  <View style={styles.rowLeft}>
                    <Ionicons name="heart" size={18} color="#E91E63" style={styles.rowIcon} />
                    <Text style={styles.rowTitle}>Likes & Reactions</Text>
                  </View>
                  <Switch
                    value={likesEnabled}
                    onValueChange={setLikesEnabled}
                    disabled={!pushEnabled}
                    trackColor={{ false: '#DDDDDD', true: COLORS.primaryLight }}
                    thumbColor={COLORS.primary}
                  />
                </View>

                {/* Comments */}
                <View style={styles.row}>
                  <View style={styles.rowLeft}>
                    <Ionicons name="chatbubble" size={18} color="#2196F3" style={styles.rowIcon} />
                    <Text style={styles.rowTitle}>Comments</Text>
                  </View>
                  <Switch
                    value={commentsEnabled}
                    onValueChange={setCommentsEnabled}
                    disabled={!pushEnabled}
                    trackColor={{ false: '#DDDDDD', true: COLORS.primaryLight }}
                    thumbColor={COLORS.primary}
                  />
                </View>

                {/* Replies */}
                <View style={styles.row}>
                  <View style={styles.rowLeft}>
                    <Ionicons name="arrow-undo" size={18} color="#009688" style={styles.rowIcon} />
                    <Text style={styles.rowTitle}>Nested Replies</Text>
                  </View>
                  <Switch
                    value={repliesEnabled}
                    onValueChange={setRepliesEnabled}
                    disabled={!pushEnabled}
                    trackColor={{ false: '#DDDDDD', true: COLORS.primaryLight }}
                    thumbColor={COLORS.primary}
                  />
                </View>

                {/* Mentions */}
                <View style={styles.row}>
                  <View style={styles.rowLeft}>
                    <Ionicons name="at" size={18} color="#9C27B0" style={styles.rowIcon} />
                    <Text style={styles.rowTitle}>Mentions & Tags</Text>
                  </View>
                  <Switch
                    value={mentionsEnabled}
                    onValueChange={setMentionsEnabled}
                    disabled={!pushEnabled}
                    trackColor={{ false: '#DDDDDD', true: COLORS.primaryLight }}
                    thumbColor={COLORS.primary}
                  />
                </View>

                {/* Followers */}
                <View style={styles.row}>
                  <View style={styles.rowLeft}>
                    <Ionicons name="person-add" size={18} color="#4CAF50" style={styles.rowIcon} />
                    <Text style={styles.rowTitle}>New Followers</Text>
                  </View>
                  <Switch
                    value={followersEnabled}
                    onValueChange={setFollowersEnabled}
                    disabled={!pushEnabled}
                    trackColor={{ false: '#DDDDDD', true: COLORS.primaryLight }}
                    thumbColor={COLORS.primary}
                  />
                </View>
              </ScrollView>
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingBottom: 24,
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
  content: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rowIcon: {
    marginRight: 12,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  rowSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 6,
  },
});
