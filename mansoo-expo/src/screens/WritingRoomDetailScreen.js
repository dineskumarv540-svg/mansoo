import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import AppButton from '../components/ui/AppButton';
import AppInput from '../components/ui/AppInput';
import AppAvatar from '../components/ui/AppAvatar';
import AppBadge from '../components/ui/AppBadge';

import {
  subscribeToWritingRoom,
  pinRoomTopic,
  muteRoomUser,
  removeRoomUser
} from '../services/writingRoomService';
import { useAppTheme } from '../theme/ThemeContext';
import { SPACING, RADIUS, SHADOWS } from '../theme/tokens';
import { useAuth } from '../context/AuthContext';

export default function WritingRoomDetailScreen({ navigation, route }) {
  const initialRoom = route.params?.room || {};
  const { theme } = useAppTheme();
  const { user } = useAuth();

  const currentUser = user || { uid: 'u1', name: 'Aarav Sharma', displayName: 'Aarav Sharma' };
  const isHost = initialRoom.hostId === currentUser.uid || currentUser.uid === 'u1';

  const [room, setRoom] = useState(initialRoom);
  const [activeTab, setActiveTab] = useState('canvas'); // 'canvas' | 'chat'
  const [writingText, setWritingText] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: 'm1', sender: 'Aarav Sharma', text: 'Welcome everyone! Let us begin our 15-min writing sprint ✍️', isHost: true },
    { id: 'm2', sender: 'Ananya Verma', text: 'Loved the prompt! Writing my second stanza now.', isHost: false },
  ]);

  const [typingUsers, setTypingUsers] = useState(['Ananya Verma']);
  const [timerSeconds, setTimerSeconds] = useState(initialRoom.timerSeconds || 900);

  // Moderator Control Sheet State
  const [modSheetVisible, setModSheetVisible] = useState(false);
  const [editTopicText, setEditTopicText] = useState(initialRoom.topic || '');

  // Realtime subscription & countdown timer
  useEffect(() => {
    const unsubscribe = subscribeToWritingRoom(room.id, (updatedRoom) => {
      setRoom(updatedRoom);
    });

    const timer = setInterval(() => {
      setTimerSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      unsubscribe();
      clearInterval(timer);
    };
  }, [room.id]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendChat = () => {
    if (!chatMessage.trim()) return;
    const newMsg = {
      id: 'm_' + Date.now(),
      sender: currentUser.displayName || currentUser.name || 'Writer',
      text: chatMessage.trim(),
      isHost,
    };
    setChatMessages(prev => [...prev, newMsg]);
    setChatMessage('');
  };

  const handlePublishRoomWritingToFeed = () => {
    if (!writingText.trim()) {
      Alert.alert('Empty Writing', 'Please write something on your canvas before publishing.');
      return;
    }
    navigation.navigate('Create', {
      editPost: {
        quoteText: writingText.trim(),
        category: room.category || 'Quotes',
      },
    });
  };

  const handlePinTopic = async () => {
    if (!editTopicText.trim()) return;
    await pinRoomTopic(room.id, editTopicText.trim());
    setModSheetVisible(false);
    Alert.alert('Topic Updated 📌', 'New room discussion topic pinned.');
  };

  const handleMuteUser = async (targetId, name) => {
    await muteRoomUser(room.id, targetId);
    Alert.alert('User Muted', `${name} has been muted in this room.`);
  };

  const handleRemoveUser = async (targetId, name) => {
    await removeRoomUser(room.id, targetId);
    Alert.alert('User Removed', `${name} has been removed from this room.`);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Room Header */}
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>

        <View style={{ flex: 1, marginHorizontal: SPACING.md }}>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]} numberOfLines={1}>{room.title}</Text>
          <View style={styles.headerSubRow}>
            <View style={[styles.liveDot, { backgroundColor: theme.likeRed }]} />
            <Text style={[styles.headerSub, { color: theme.textSecondary }]}>
              {room.participantsCount || 1} Live • {formatTimer(timerSeconds)}
            </Text>
          </View>
        </View>

        {isHost ? (
          <TouchableOpacity onPress={() => setModSheetVisible(true)} style={styles.modBtn}>
            <Ionicons name="shield-checkmark" size={22} color={theme.primary} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Pinned Discussion Topic */}
      <LinearGradient colors={theme.gradientGreen} style={styles.pinnedTopic}>
        <Ionicons name="pin" size={18} color="#FFFFFF" style={{ marginRight: SPACING.xs }} />
        <Text style={styles.pinnedText} numberOfLines={2}>
          <Text style={{ fontWeight: 'bold' }}>Topic & Prompt:</Text> {room.topic} — "{room.prompt || 'Write freely...'}"
        </Text>
      </LinearGradient>

      {/* Top Writer Leaderboard Banner */}
      <View style={[styles.leaderboardBar, { backgroundColor: theme.surfaceLight }]}>
        <Ionicons name="trophy" size={18} color={theme.proGold} />
        <Text style={[styles.leaderText, { color: theme.textPrimary }]}>
          Top Writer of the Room: <Text style={{ fontWeight: 'bold', color: theme.primary }}>{room.topWriter || 'Aarav Sharma'}</Text>
        </Text>
        <AppBadge label="142 WPM" variant="pro" />
      </View>

      {/* Mode Switcher Tabs */}
      <View style={[styles.tabRow, { borderBottomColor: theme.border }]}>
        <TouchableOpacity style={[styles.tab, activeTab === 'canvas' && { borderBottomColor: theme.primary }]} onPress={() => setActiveTab('canvas')}>
          <Ionicons name="create-outline" size={18} color={activeTab === 'canvas' ? theme.primary : theme.textSecondary} />
          <Text style={[styles.tabText, { color: activeTab === 'canvas' ? theme.primary : theme.textSecondary }]}>Writing Canvas</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.tab, activeTab === 'chat' && { borderBottomColor: theme.primary }]} onPress={() => setActiveTab('chat')}>
          <Ionicons name="chatbubbles-outline" size={18} color={activeTab === 'chat' ? theme.primary : theme.textSecondary} />
          <Text style={[styles.tabText, { color: activeTab === 'chat' ? theme.primary : theme.textSecondary }]}>Room Chat ({chatMessages.length})</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content Area */}
      {activeTab === 'canvas' ? (
        <ScrollView contentContainerStyle={styles.canvasContent}>
          {/* Live Typing Indicator */}
          {typingUsers.length > 0 ? (
            <Text style={[styles.typingText, { color: theme.primary }]}>
              ✍️ {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} writing right now...
            </Text>
          ) : null}

          {/* Collaborative Text Input */}
          <TextInput
            style={[styles.canvasInput, { color: theme.textPrimary, backgroundColor: theme.surfaceLight, borderColor: theme.border }]}
            placeholder="Write your poem, story, or thoughts here live with the room..."
            placeholderTextColor={theme.textMuted}
            multiline
            value={writingText}
            onChangeText={setWritingText}
          />

          <AppButton
            title="Publish Writing to Mansoo Feed 🚀"
            onPress={handlePublishRoomWritingToFeed}
            style={{ marginTop: SPACING.md }}
          />
        </ScrollView>
      ) : (
        <View style={{ flex: 1 }}>
          <FlatList
            data={chatMessages}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.chatList}
            renderItem={({ item }) => (
              <View style={[styles.chatBubble, { backgroundColor: item.isHost ? theme.surfaceLight : theme.cardBackground, borderColor: theme.border }]}>
                <Text style={[styles.chatSender, { color: item.isHost ? theme.primary : theme.textPrimary }]}>
                  {item.sender} {item.isHost ? '👑 Host' : ''}
                </Text>
                <Text style={[styles.chatText, { color: theme.textPrimary }]}>{item.text}</Text>
              </View>
            )}
          />

          {/* Chat Input Bar */}
          <View style={[styles.chatInputBar, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
            <TextInput
              style={[styles.chatInput, { color: theme.textPrimary, backgroundColor: theme.surfaceLight }]}
              placeholder="Send message to room..."
              placeholderTextColor={theme.textMuted}
              value={chatMessage}
              onChangeText={setChatMessage}
            />
            <TouchableOpacity onPress={handleSendChat} style={[styles.sendBtn, { backgroundColor: theme.primary }]}>
              <Ionicons name="send" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Moderator Control Sheet Modal */}
      <Modal visible={modSheetVisible} transparent animationType="slide" onRequestClose={() => setModSheetVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modCard, { backgroundColor: theme.cardBackground }]}>
            <View style={styles.modHeader}>
              <Text style={[styles.modTitle, { color: theme.textPrimary }]}>Shield Moderator Controls 🛡️</Text>
              <TouchableOpacity onPress={() => setModSheetVisible(false)}>
                <Ionicons name="close-circle-outline" size={24} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>

            <AppInput label="Edit Pinned Topic" value={editTopicText} onChangeText={setEditTopicText} multiline />
            <AppButton title="Update & Pin Topic 📌" onPress={handlePinTopic} style={{ marginBottom: SPACING.md }} />

            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Participant Controls:</Text>
            <View style={styles.participantRow}>
              <Text style={[styles.pName, { color: theme.textPrimary }]}>Ananya Verma</Text>
              <View style={{ flexDirection: 'row' }}>
                <AppButton title="Mute" variant="secondary" size="sm" onPress={() => handleMuteUser('u2', 'Ananya Verma')} style={{ marginRight: SPACING.xs }} />
                <AppButton title="Remove" variant="secondary" size="sm" onPress={() => handleRemoveUser('u2', 'Ananya Verma')} textStyle={{ color: theme.error }} />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  headerSub: {
    fontSize: 11,
  },
  modBtn: {
    padding: 4,
  },
  pinnedTopic: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm + 2,
  },
  pinnedText: {
    color: '#FFFFFF',
    fontSize: 12,
    flex: 1,
  },
  leaderboardBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  leaderText: {
    fontSize: 12,
  },
  tabRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: SPACING.xs,
  },
  canvasContent: {
    padding: SPACING.lg,
  },
  typingText: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  canvasInput: {
    minHeight: 240,
    borderWidth: 1,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    fontSize: 15,
    textAlignVertical: 'top',
    lineHeight: 22,
  },
  chatList: {
    padding: SPACING.lg,
  },
  chatBubble: {
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    marginBottom: SPACING.sm,
  },
  chatSender: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  chatText: {
    fontSize: 13,
    lineHeight: 18,
  },
  chatInputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderTopWidth: 1,
  },
  chatInput: {
    flex: 1,
    height: 40,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    fontSize: 13,
    marginRight: SPACING.xs,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modCard: {
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.xl,
  },
  modHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  modTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: SPACING.sm,
  },
  participantRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
  },
  pName: {
    fontSize: 14,
    fontWeight: '600',
  },
});
