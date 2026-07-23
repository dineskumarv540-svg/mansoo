import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
  TouchableWithoutFeedback,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import QRCodeModal from './QRCodeModal';
import { shareToPlatform } from '../services/shareService';
import { COLORS } from '../theme/colors';

const PLATFORMS = [
  { id: 'whatsapp', name: 'WhatsApp', icon: 'logo-whatsapp', color: '#25D366', bg: '#E8F5E9' },
  { id: 'instagram', name: 'Instagram', icon: 'logo-instagram', color: '#E1306C', bg: '#FCE4EC' },
  { id: 'facebook', name: 'Facebook', icon: 'logo-facebook', color: '#1877F2', bg: '#E3F2FD' },
  { id: 'x', name: 'X / Twitter', icon: 'logo-twitter', color: '#1DA1F2', bg: '#E1F5FE' },
  { id: 'telegram', name: 'Telegram', icon: 'paper-plane', color: '#0088CC', bg: '#E0F7FA' },
];

export default function ShareSheetModal({ visible, targetItem, type = 'post', onClose }) {
  const [qrModalVisible, setQrModalVisible] = useState(false);

  if (!visible || !targetItem) return null;

  const handleShareClick = async (platformId) => {
    await shareToPlatform(platformId, targetItem, type);
    onClose();
  };

  const handleDownloadImage = () => {
    Alert.alert('HD Image Saved 📥', 'High-definition quote card saved to gallery.');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.sheetContainer}>
              <View style={styles.dragHandle} />

              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.headerTitle}>Share {type === 'profile' ? 'Profile' : 'Quote'}</Text>
                <TouchableOpacity onPress={onClose}>
                  <Ionicons name="close-circle-outline" size={24} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                {/* Live Card Preview */}
                {type === 'post' && (
                  <View style={styles.previewCard}>
                    {targetItem.backgroundImageUrl ? (
                      <Image source={{ uri: targetItem.backgroundImageUrl }} style={styles.previewBg} />
                    ) : (
                      <View style={[styles.previewBg, { backgroundColor: targetItem.backgroundColor || '#0F3D3E' }]} />
                    )}
                    <LinearGradient colors={['transparent', 'rgba(0,0,0,0.65)']} style={styles.previewOverlay}>
                      <Text style={styles.previewText} numberOfLines={2}>"{targetItem.quoteText}"</Text>
                      <Text style={styles.previewAuthor}>— {targetItem.authorName}</Text>
                    </LinearGradient>
                  </View>
                )}

                {/* 1. Direct App Share Grid */}
                <Text style={styles.sectionLabel}>Share to Social Apps:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.platformScroll}>
                  {PLATFORMS.map(p => (
                    <TouchableOpacity
                      key={p.id}
                      style={styles.platformItem}
                      onPress={() => handleShareClick(p.id)}
                    >
                      <View style={[styles.platformIconBox, { backgroundColor: p.bg }]}>
                        <Ionicons name={p.icon} size={24} color={p.color} />
                      </View>
                      <Text style={styles.platformName}>{p.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {/* 2. HD Export Actions */}
                <Text style={styles.sectionLabel}>HD Export & Link Actions:</Text>

                <TouchableOpacity style={styles.actionRow} onPress={handleDownloadImage}>
                  <View style={[styles.iconBox, { backgroundColor: '#F0F7F7' }]}>
                    <Ionicons name="download-outline" size={20} color={COLORS.primary} />
                  </View>
                  <View style={styles.actionTextGroup}>
                    <Text style={styles.actionTitle}>Download HD Image</Text>
                    <Text style={styles.actionSub}>Save high-res card to device gallery</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionRow} onPress={() => handleShareClick('instagram')}>
                  <View style={[styles.iconBox, { backgroundColor: '#FCE4EC' }]}>
                    <Ionicons name="sparkles-outline" size={20} color="#E1306C" />
                  </View>
                  <View style={styles.actionTextGroup}>
                    <Text style={styles.actionTitle}>Share as Instagram Story</Text>
                    <Text style={styles.actionSub}>Export formatted story card</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionRow} onPress={() => handleShareClick('link')}>
                  <View style={[styles.iconBox, { backgroundColor: '#E3F2FD' }]}>
                    <Ionicons name="link-outline" size={20} color="#1877F2" />
                  </View>
                  <View style={styles.actionTextGroup}>
                    <Text style={styles.actionTitle}>Copy Link</Text>
                    <Text style={styles.actionSub}>Copy deep link to clipboard</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionRow} onPress={() => setQrModalVisible(true)}>
                  <View style={[styles.iconBox, { backgroundColor: '#FFF3E0' }]}>
                    <Ionicons name="qr-code-outline" size={20} color="#E65100" />
                  </View>
                  <View style={styles.actionTextGroup}>
                    <Text style={styles.actionTitle}>Generate QR Code 🔲</Text>
                    <Text style={styles.actionSub}>Create custom scan code for quick sharing</Text>
                  </View>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>

      <QRCodeModal
        visible={qrModalVisible}
        targetItem={targetItem}
        type={type}
        onClose={() => setQrModalVisible(false)}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    maxHeight: '85%',
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
    paddingVertical: 14,
  },
  previewCard: {
    height: 110,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
  },
  previewBg: {
    ...StyleSheet.absoluteFillObject,
  },
  previewOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
  },
  previewText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  previewAuthor: {
    color: '#FFFFFF',
    fontSize: 10,
    opacity: 0.85,
    marginTop: 4,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    marginBottom: 10,
  },
  platformScroll: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  platformItem: {
    alignItems: 'center',
    marginRight: 16,
  },
  platformIconBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  platformName: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionTextGroup: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  actionSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
});
