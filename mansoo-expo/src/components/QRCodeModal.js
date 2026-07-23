import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { generateQRCodeUrl, shareToPlatform } from '../services/shareService';
import { COLORS } from '../theme/colors';

export default function QRCodeModal({ visible, targetItem, type = 'post', onClose }) {
  if (!visible || !targetItem) return null;

  const linkUrl = `https://mansoo.in/${type === 'profile' ? 'u' : 'p'}/${targetItem.id || targetItem.handle || 'qr'}`;
  const qrImageUrl = generateQRCodeUrl(linkUrl);

  const handleDownloadQR = () => {
    Alert.alert('QR Code Saved 📥', 'High-definition QR Code image saved to your phone gallery.');
  };

  const handleShareQR = () => {
    shareToPlatform('link', targetItem, type);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.card}>
              <View style={styles.dragHandle} />

              <View style={styles.header}>
                <Text style={styles.headerTitle}>
                  {type === 'profile' ? 'Profile QR Code 🔲' : 'Post QR Code 🔲'}
                </Text>
                <TouchableOpacity onPress={onClose}>
                  <Ionicons name="close-circle-outline" size={24} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>

              <View style={styles.content}>
                {/* QR Code Container */}
                <View style={styles.qrBox}>
                  <Image source={{ uri: qrImageUrl }} style={styles.qrImage} />
                  <View style={styles.brandBadge}>
                    <Text style={styles.brandText}>Mansoo</Text>
                  </View>
                </View>

                {/* Subtitle */}
                <Text style={styles.targetName}>
                  {type === 'profile' ? (targetItem.name || targetItem.displayName) : `Quote by ${targetItem.authorName}`}
                </Text>

                <Text style={styles.subText}>
                  Scan with any camera app to open directly on Mansoo.
                </Text>

                {/* Action Buttons */}
                <View style={styles.actionsRow}>
                  <TouchableOpacity style={styles.actionBtn} onPress={handleDownloadQR}>
                    <Ionicons name="download-outline" size={18} color={COLORS.primary} />
                    <Text style={styles.actionBtnText}>Download QR</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.actionBtnPrimaryContainer} onPress={handleShareQR}>
                    <LinearGradient colors={COLORS.gradientGreen} style={styles.actionBtnPrimary}>
                      <Ionicons name="share-social" size={18} color="#FFFFFF" />
                      <Text style={styles.actionBtnPrimaryText}>Share QR Link</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
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
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingBottom: 30,
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  qrBox: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#EEEEEE',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
    position: 'relative',
  },
  qrImage: {
    width: 200,
    height: 200,
  },
  brandBadge: {
    position: 'absolute',
    bottom: -10,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 10,
  },
  brandText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
  targetName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: 20,
  },
  subText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 20,
  },
  actionsRow: {
    flexDirection: 'row',
    width: '100%',
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F7F7',
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 12,
    marginRight: 8,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginLeft: 6,
  },
  actionBtnPrimaryContainer: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
    marginLeft: 8,
  },
  actionBtnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  actionBtnPrimaryText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 6,
  },
});
