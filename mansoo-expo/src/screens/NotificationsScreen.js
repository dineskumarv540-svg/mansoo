import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import NotificationSettingsModal from '../components/NotificationSettingsModal';
import { NOTIFICATIONS_DATA } from '../data/dummyData';
import { COLORS } from '../theme/colors';

const FULL_NOTIFICATIONS = [
  ...NOTIFICATIONS_DATA,
  {
    id: 'n5',
    user: 'Kavya Sharma',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    action: 'mentioned you in a quote: "@aarav_writes true wisdom!"',
    time: '4h ago',
    unread: true,
    type: 'mention',
  },
  {
    id: 'n6',
    user: 'Devansh Gupta',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    action: 'replied to your comment on "Poetry of Rain"',
    time: '5h ago',
    unread: false,
    type: 'reply',
  },
];

export default function NotificationsScreen({ navigation }) {
  const [notifications, setNotifications] = useState(FULL_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'likes', 'comments', 'follows', 'mentions'
  const [settingsVisible, setSettingsVisible] = useState(false);

  const filterNotifications = () => {
    return notifications.filter(item => {
      if (activeTab === 'all') return true;
      if (activeTab === 'likes') return item.action.includes('liked');
      if (activeTab === 'comments') return item.action.includes('commented') || item.type === 'reply';
      if (activeTab === 'follows') return item.action.includes('following');
      if (activeTab === 'mentions') return item.type === 'mention' || item.action.includes('@');
      return true;
    });
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    Alert.alert('Notifications Read', 'All notifications marked as read.');
  };

  const toggleSingleRead = (id) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, unread: false } : n)));
  };

  const getNotificationIcon = (item) => {
    if (item.action.includes('liked')) return { name: 'heart', color: '#E91E63', bg: '#FCE4EC' };
    if (item.action.includes('commented')) return { name: 'chatbubble', color: '#2196F3', bg: '#E3F2FD' };
    if (item.type === 'reply' || item.action.includes('replied')) return { name: 'arrow-undo', color: '#009688', bg: '#E0F2F1' };
    if (item.type === 'mention' || item.action.includes('@')) return { name: 'at', color: '#9C27B0', bg: '#F3E5F5' };
    return { name: 'person-add', color: '#4CAF50', bg: '#E8F5E9' };
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Activity Feed</Text>

        <View style={styles.headerRight}>
          <TouchableOpacity onPress={handleMarkAllRead} style={{ marginRight: 12 }}>
            <Text style={styles.markRead}>Mark Read</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSettingsVisible(true)}>
            <Ionicons name="options-outline" size={22} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabRowContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabRow}>
          {[
            { id: 'all', label: 'All' },
            { id: 'likes', label: 'Likes ❤️' },
            { id: 'comments', label: 'Comments 💬' },
            { id: 'follows', label: 'Follows 👥' },
            { id: 'mentions', label: 'Mentions 🏷️' },
          ].map(tab => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tabChip, activeTab === tab.id && styles.tabChipActive]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text style={[styles.tabChipText, activeTab === tab.id && styles.tabChipTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Notifications List */}
      <FlatList
        data={filterNotifications()}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          const iconMeta = getNotificationIcon(item);
          return (
            <TouchableOpacity
              style={[styles.notificationRow, item.unread && styles.unreadRow]}
              onPress={() => toggleSingleRead(item.id)}
              activeOpacity={0.85}
            >
              {/* Avatar + Badge Overlay */}
              <View style={styles.avatarContainer}>
                <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
                <View style={[styles.typeBadge, { backgroundColor: iconMeta.bg }]}>
                  <Ionicons name={iconMeta.name} size={10} color={iconMeta.color} />
                </View>
              </View>

              <View style={styles.contentContainer}>
                <Text style={styles.actionText}>
                  <Text style={styles.userName}>{item.user} </Text>
                  {item.action}
                </Text>
                <Text style={styles.timeText}>{item.time}</Text>
              </View>

              {item.unread && <View style={styles.unreadDot} />}
            </TouchableOpacity>
          );
        }}
        showsVerticalScrollIndicator={false}
        initialNumToRender={8}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
      />

      <NotificationSettingsModal
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    fontFamily: 'serif',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  markRead: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.accent,
  },
  tabRowContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  tabRow: {
    paddingHorizontal: 12,
  },
  tabChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: '#F5F5F5',
    marginRight: 8,
  },
  tabChipActive: {
    backgroundColor: COLORS.primary,
  },
  tabChipText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
  },
  tabChipTextActive: {
    color: '#FFFFFF',
  },
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  unreadRow: {
    backgroundColor: '#F0F7F7',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  typeBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  contentContainer: {
    flex: 1,
  },
  userName: {
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  actionText: {
    fontSize: 13,
    color: COLORS.textPrimary,
    lineHeight: 18,
  },
  timeText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.accent,
    marginLeft: 8,
  },
});
