import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { COLORS } from '../theme/colors';

export default function EditProfileModal({ visible, user, onClose, onSave }) {
  const [name, setName] = useState(user?.displayName || user?.name || '');
  const [bio, setBio] = useState(user?.bio || 'Writing the language of the soul ✨');
  const [website, setWebsite] = useState(user?.website || 'mansoo.in/aarav');
  const [avatarUrl, setAvatarUrl] = useState(user?.photoURL || user?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400');
  const [coverUrl, setCoverUrl] = useState(user?.coverImageUrl || 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1200');

  if (!visible) return null;

  const handlePickAvatar = async () => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!res.canceled && res.assets && res.assets[0]) {
        setAvatarUrl(res.assets[0].uri);
      }
    } catch (e) {}
  };

  const handlePickCover = async () => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });
      if (!res.canceled && res.assets && res.assets[0]) {
        setCoverUrl(res.assets[0].uri);
      }
    } catch (e) {}
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Validation', 'Name cannot be empty.');
      return;
    }

    onSave({
      displayName: name.trim(),
      name: name.trim(),
      bio: bio.trim(),
      website: website.trim(),
      avatarUrl,
      photoURL: avatarUrl,
      coverImageUrl: coverUrl,
    });
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.card}
            >
              {/* Drag Handle */}
              <View style={styles.dragHandle} />

              {/* Header */}
              <View style={styles.header}>
                <TouchableOpacity onPress={onClose}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
                <TouchableOpacity onPress={handleSave}>
                  <Text style={styles.saveText}>Done</Text>
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Cover & Avatar Edit Area */}
                <View style={styles.mediaContainer}>
                  <Image source={{ uri: coverUrl }} style={styles.coverPreview} />
                  <TouchableOpacity style={styles.changeCoverBtn} onPress={handlePickCover}>
                    <Ionicons name="camera" size={16} color="#FFFFFF" />
                    <Text style={styles.changeMediaText}>Cover</Text>
                  </TouchableOpacity>

                  {/* Avatar Overlay */}
                  <View style={styles.avatarWrapper}>
                    <Image source={{ uri: avatarUrl }} style={styles.avatarPreview} />
                    <TouchableOpacity style={styles.changeAvatarBtn} onPress={handlePickAvatar}>
                      <Ionicons name="camera" size={14} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Form Fields */}
                <Text style={styles.fieldLabel}>Name</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Full Name"
                />

                <Text style={styles.fieldLabel}>Bio</Text>
                <TextInput
                  style={[styles.input, styles.bioInput]}
                  value={bio}
                  onChangeText={setBio}
                  multiline
                  placeholder="Write your bio..."
                />

                <Text style={styles.fieldLabel}>Website Link</Text>
                <TextInput
                  style={styles.input}
                  value={website}
                  onChangeText={setWebsite}
                  placeholder="mansoo.in/username"
                />
              </ScrollView>
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '80%',
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
  cancelText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  saveText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  scrollContent: {
    padding: 20,
  },
  mediaContainer: {
    height: 140,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 50,
    position: 'relative',
    backgroundColor: '#EEEEEE',
  },
  coverPreview: {
    width: '100%',
    height: '100%',
  },
  changeCoverBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  changeMediaText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  avatarWrapper: {
    position: 'absolute',
    bottom: -35,
    left: 20,
    width: 74,
    height: 74,
    borderRadius: 37,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  avatarPreview: {
    width: '100%',
    height: '100%',
    borderRadius: 37,
  },
  changeAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    marginTop: 10,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  bioInput: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
});
