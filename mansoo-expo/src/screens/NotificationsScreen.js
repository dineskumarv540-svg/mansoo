import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NOTIFICATIONS_DATA } from '../data/dummyData';
import { COLORS } from '../theme/colors';

export default function NotificationsScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity>
          <Text style={styles.markRead}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      {/* Notifications List */}
      <FlatList
        data={NOTIFICATIONS_DATA}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.notificationRow, item.unread && styles.unreadRow]}
            activeOpacity={0.8}
          >
            <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />

            <View style={styles.contentContainer}>
              <Text style={styles.actionText}>
                <Text style={styles.userName}>{item.user} </Text>
                {item.action}
              </Text>
              <Text style={styles.timeText}>{item.time}</Text>
            </View>

            {item.unread && <View style={styles.unreadDot} />}
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={false}
        initialNumToRender={8}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
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
    paddingVertical: 14,
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
  markRead: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F6F6F6',
  },
  unreadRow: {
    backgroundColor: '#F0F7F7',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  actionText: {
    fontSize: 13,
    color: COLORS.textPrimary,
    lineHeight: 18,
  },
  userName: {
    fontWeight: 'bold',
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
