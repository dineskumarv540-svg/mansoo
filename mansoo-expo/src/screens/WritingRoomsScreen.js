import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import AppButton from '../components/ui/AppButton';
import AppInput from '../components/ui/AppInput';
import AppAvatar from '../components/ui/AppAvatar';
import AppChip from '../components/ui/AppChip';
import AppBadge from '../components/ui/AppBadge';
import AppEmptyState from '../components/ui/AppEmptyState';

import { fetchWritingRooms, createWritingRoom, joinWritingRoom } from '../services/writingRoomService';
import { useAppTheme } from '../theme/ThemeContext';
import { SPACING, RADIUS, SHADOWS } from '../theme/tokens';
import { useAuth } from '../context/AuthContext';

export default function WritingRoomsScreen({ navigation }) {
  const { theme } = useAppTheme();
  const { user } = useAuth();

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'public' | 'private'
  const [searchQuery, setSearchQuery] = useState('');

  // Create Room Modal State
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [roomTitle, setRoomTitle] = useState('');
  const [roomTopic, setRoomTopic] = useState('');
  const [roomPrompt, setRoomPrompt] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [roomPassword, setRoomPassword] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Password Prompt Modal State
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [enteredPassword, setEnteredPassword] = useState('');

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    setLoading(true);
    const data = await fetchWritingRooms();
    setRooms(data);
    setLoading(false);
  };

  const handleJoinRoom = async (room) => {
    if (room.isPrivate) {
      setSelectedRoom(room);
      setPasswordModalVisible(true);
      return;
    }

    const currentUser = user || { uid: 'u1', name: 'Aarav Sharma' };
    const res = await joinWritingRoom(room.id, currentUser);

    if (res.success) {
      navigation.navigate('WritingRoomDetail', { room });
    } else {
      Alert.alert('Unable to Join', res.error);
    }
  };

  const handleConfirmPasswordJoin = async () => {
    if (!enteredPassword.trim()) {
      Alert.alert('Password Required', 'Please enter room password.');
      return;
    }

    const currentUser = user || { uid: 'u1', name: 'Aarav Sharma' };
    const res = await joinWritingRoom(selectedRoom.id, currentUser, enteredPassword.trim());

    setPasswordModalVisible(false);
    setEnteredPassword('');

    if (res.success) {
      navigation.navigate('WritingRoomDetail', { room: selectedRoom });
    } else {
      Alert.alert('Access Denied', res.error);
    }
  };

  const handleCreateRoomSubmit = async () => {
    if (!roomTitle.trim()) {
      Alert.alert('Title Required', 'Please provide a title for your Writing Room.');
      return;
    }

    setIsCreating(true);
    const currentUser = user || { uid: 'u1', name: 'Aarav Sharma' };

    const newRoomPayload = {
      title: roomTitle.trim(),
      topic: roomTopic.trim() || 'Freeform Collaborative Writing',
      prompt: roomPrompt.trim() || 'Write freely with the group...',
      hostName: currentUser.displayName || currentUser.name || 'Writer',
      hostAvatar: currentUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
      hostId: currentUser.uid || 'u1',
      isPrivate,
      password: isPrivate ? roomPassword.trim() : '',
      category: 'General',
      timerSeconds: 900,
    };

    const res = await createWritingRoom(newRoomPayload);
    setIsCreating(false);
    setCreateModalVisible(false);

    // Reset inputs
    setRoomTitle('');
    setRoomTopic('');
    setRoomPrompt('');
    setIsPrivate(false);
    setRoomPassword('');

    if (res.success) {
      setRooms(prev => [res.room, ...prev]);
      navigation.navigate('WritingRoomDetail', { room: res.room });
    } else {
      Alert.alert('Error', 'Failed to create Writing Room.');
    }
  };

  // Filtered rooms
  const filteredRooms = rooms.filter(r => {
    const matchesTab = activeTab === 'all' || (activeTab === 'public' && !r.isPrivate) || (activeTab === 'private' && r.isPrivate);
    const matchesQuery = !searchQuery || r.title.toLowerCase().includes(searchQuery.toLowerCase()) || r.topic.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesQuery;
  });

  const renderRoomItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.roomCard, SHADOWS.sm, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}
      onPress={() => handleJoinRoom(item)}
      activeOpacity={0.85}
    >
      <View style={styles.cardHeader}>
        <View style={styles.hostRow}>
          <AppAvatar uri={item.hostAvatar} size="sm" />
          <View style={{ marginLeft: SPACING.sm }}>
            <Text style={[styles.hostName, { color: theme.textPrimary }]}>{item.hostName}</Text>
            <Text style={[styles.hostLabel, { color: theme.textSecondary }]}>Host</Text>
          </View>
        </View>

        <AppBadge
          label={item.isPrivate ? '🔒 Private' : '🌐 Live Public'}
          variant={item.isPrivate ? 'secondary' : 'success'}
        />
      </View>

      <Text style={[styles.roomTitle, { color: theme.textPrimary }]}>{item.title}</Text>
      <Text style={[styles.roomTopic, { color: theme.textSecondary }]} numberOfLines={2}>
        💬 {item.topic}
      </Text>

      {item.prompt ? (
        <View style={[styles.promptBox, { backgroundColor: theme.surfaceLight }]}>
          <Text style={[styles.promptText, { color: theme.primary }]}>
            ✍️ <Text style={{ fontWeight: 'bold' }}>Prompt:</Text> "{item.prompt}"
          </Text>
        </View>
      ) : null}

      <View style={styles.cardFooter}>
        <View style={styles.liveStat}>
          <View style={[styles.redDot, { backgroundColor: theme.likeRed }]} />
          <Text style={[styles.statText, { color: theme.textPrimary }]}>
            {item.participantsCount} Writing Now
          </Text>
        </View>

        <AppButton
          title="Join Room 🎙️"
          size="sm"
          variant={item.isPrivate ? 'secondary' : 'primary'}
          onPress={() => handleJoinRoom(item)}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Writing Rooms 🎙️</Text>
        <TouchableOpacity onPress={() => setCreateModalVisible(true)} style={styles.addBtn}>
          <Ionicons name="add-circle" size={28} color={theme.primary} />
        </TouchableOpacity>
      </View>

      {/* Subheader banner */}
      <LinearGradient colors={theme.gradientGreen} style={styles.banner}>
        <Ionicons name="people-outline" size={28} color="#FFFFFF" />
        <View style={{ marginLeft: SPACING.md, flex: 1 }}>
          <Text style={styles.bannerTitle}>Live Collaborative Writing</Text>
          <Text style={styles.bannerSub}>Write together, get feedback & publish live stories.</Text>
        </View>
      </LinearGradient>

      {/* Search Input */}
      <View style={{ paddingHorizontal: SPACING.lg, marginTop: SPACING.md }}>
        <AppInput
          placeholder="Search rooms by title or topic..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          icon="search-outline"
        />
      </View>

      {/* Filter Chips */}
      <View style={styles.chipRow}>
        <AppChip label="All Rooms" selected={activeTab === 'all'} onPress={() => setActiveTab('all')} />
        <AppChip label="Public Rooms 🌐" selected={activeTab === 'public'} onPress={() => setActiveTab('public')} />
        <AppChip label="Private Rooms 🔒" selected={activeTab === 'private'} onPress={() => setActiveTab('private')} />
      </View>

      {/* Rooms List */}
      {loading ? (
        <View style={styles.loaderCenter}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredRooms}
          keyExtractor={item => item.id}
          renderItem={renderRoomItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <AppEmptyState
              icon="chatbubbles-outline"
              title="No Active Rooms"
              message="Be the first writer to launch a live Writing Room!"
              buttonTitle="Create Room 🚀"
              onButtonPress={() => setCreateModalVisible(true)}
            />
          }
        />
      )}

      {/* Create Room Modal */}
      <Modal visible={createModalVisible} transparent animationType="slide" onRequestClose={() => setCreateModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: theme.cardBackground }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>Create Writing Room ✍️</Text>
              <TouchableOpacity onPress={() => setCreateModalVisible(false)}>
                <Ionicons name="close-circle-outline" size={24} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <AppInput label="Room Title *" placeholder="e.g. Midnight Poetry Circle" value={roomTitle} onChangeText={setRoomTitle} />
              <AppInput label="Discussion Topic" placeholder="e.g. Exploring unrequited love" value={roomTopic} onChangeText={setRoomTopic} />
              <AppInput label="Writing Prompt" placeholder="e.g. Write 4 lines on autumn rain" value={roomPrompt} onChangeText={setRoomPrompt} multiline />

              <View style={styles.switchRow}>
                <Text style={[styles.switchLabel, { color: theme.textPrimary }]}>Make Room Private (Password Protected)</Text>
                <TouchableOpacity onPress={() => setIsPrivate(!isPrivate)}>
                  <Ionicons name={isPrivate ? "checkbox" : "square-outline"} size={24} color={theme.primary} />
                </TouchableOpacity>
              </View>

              {isPrivate ? (
                <AppInput label="Room Password *" placeholder="Set room password" value={roomPassword} onChangeText={setRoomPassword} secureTextEntry />
              ) : null}

              <AppButton
                title={isCreating ? "Launching..." : "Launch Writing Room 🚀"}
                onPress={handleCreateRoomSubmit}
                loading={isCreating}
                style={{ marginTop: SPACING.md }}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Password Prompt Modal */}
      <Modal visible={passwordModalVisible} transparent animationType="fade" onRequestClose={() => setPasswordModalVisible(false)}>
        <View style={styles.modalOverlayCenter}>
          <View style={[styles.passwordCard, { backgroundColor: theme.cardBackground }]}>
            <Ionicons name="lock-closed-outline" size={32} color={theme.primary} style={{ alignSelf: 'center', marginBottom: SPACING.sm }} />
            <Text style={[styles.modalTitle, { color: theme.textPrimary, textAlign: 'center' }]}>Private Room</Text>
            <Text style={[styles.passwordSub, { color: theme.textSecondary }]}>Enter room password to join.</Text>

            <AppInput placeholder="Password" value={enteredPassword} onChangeText={setEnteredPassword} secureTextEntry />

            <View style={styles.passBtnRow}>
              <AppButton title="Cancel" variant="secondary" onPress={() => setPasswordModalVisible(false)} style={{ flex: 1, marginRight: SPACING.xs }} />
              <AppButton title="Join" onPress={handleConfirmPasswordJoin} style={{ flex: 1, marginLeft: SPACING.xs }} />
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
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addBtn: {
    padding: 2,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bannerSub: {
    color: '#E0F2F1',
    fontSize: 12,
    marginTop: 2,
  },
  chipRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  loaderCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 30,
  },
  roomCard: {
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  hostRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hostName: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  hostLabel: {
    fontSize: 10,
  },
  roomTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  roomTopic: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: SPACING.sm,
  },
  promptBox: {
    padding: SPACING.sm,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.md,
  },
  promptText: {
    fontSize: 12,
    lineHeight: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: SPACING.sm,
  },
  liveStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  redDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statText: {
    fontSize: 12,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalOverlayCenter: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  modalCard: {
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.xl,
    maxHeight: '85%',
  },
  passwordCard: {
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    width: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: SPACING.sm,
  },
  switchLabel: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  passwordSub: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  passBtnRow: {
    flexDirection: 'row',
    marginTop: SPACING.sm,
  },
});
