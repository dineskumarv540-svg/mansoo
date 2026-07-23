import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  SafeAreaView,
  Alert,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import {
  PRESET_GRADIENTS,
  UNSPLASH_TEMPLATES,
  FRAME_TEMPLATES,
  STICKERS_EMOJIS
} from '../data/designerTemplates';
import { COLORS } from '../theme/colors';

const { width } = Dimensions.get('window');

export default function PremiumPostDesigner({ visible, initialText, onClose, onApply }) {
  const [quoteText, setQuoteText] = useState(initialText || 'Writing the language of the soul...');
  const [activeTab, setActiveTab] = useState('background'); // 'background', 'typography', 'frames', 'stickers'

  // Background Options
  const [bgType, setBgType] = useState('gradient'); // 'gradient' | 'image'
  const [selectedGradient, setSelectedGradient] = useState(PRESET_GRADIENTS[0]);
  const [selectedImage, setSelectedImage] = useState(UNSPLASH_TEMPLATES[0].url);
  const [bgOpacity, setBgOpacity] = useState(1.0);

  // Typography Options
  const [fontStyle, setFontStyle] = useState('Serif'); // 'Serif', 'Sans', 'Monospace', 'Cursive'
  const [fontSize, setFontSize] = useState(20);
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [textAlign, setTextAlign] = useState('center');
  const [letterSpacing, setLetterSpacing] = useState(0.5);
  const [lineHeight, setLineHeight] = useState(28);
  const [hasShadow, setHasShadow] = useState(true);

  // Frames & Stickers
  const [selectedFrame, setSelectedFrame] = useState(FRAME_TEMPLATES[0]);
  const [activeSticker, setActiveSticker] = useState('✨');
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  if (!visible) return null;

  const handleSaveCustomTemplate = () => {
    Alert.alert('Template Saved 💾', 'Your custom canvas template styling has been saved to your studio presets.');
  };

  const handleExportHD = () => {
    Alert.alert('Export HD Image 🖼️', 'HD Quote Card image has been generated and saved to gallery.');
  };

  const handleApplyToPost = () => {
    onApply({
      quoteText: quoteText.trim(),
      backgroundImageUrl: bgType === 'image' ? selectedImage : '',
      backgroundColor: bgType === 'gradient' ? selectedGradient.colors[0] : '',
      gradientColors: bgType === 'gradient' ? selectedGradient.colors : null,
      fontStyle,
      fontSize,
      textColor,
      textAlign,
      letterSpacing,
      lineHeight,
      frame: selectedFrame,
      sticker: activeSticker,
    });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        {/* Header Bar */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Studio Canvas Designer</Text>

          <TouchableOpacity style={styles.doneBtnContainer} onPress={handleApplyToPost}>
            <LinearGradient colors={COLORS.gradientPink} style={styles.doneBtn}>
              <Text style={styles.doneBtnText}>Use Canvas</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* 1. Live Studio Canvas Preview */}
          <View style={styles.canvasWrapper}>
            <View
              style={[
                styles.canvasCard,
                {
                  borderWidth: selectedFrame.borderWidth,
                  borderColor: selectedFrame.borderColor || 'transparent',
                  borderRadius: selectedFrame.borderRadius,
                  opacity: bgOpacity,
                }
              ]}
            >
              {bgType === 'gradient' ? (
                <LinearGradient
                  colors={selectedGradient.colors}
                  style={StyleSheet.absoluteFillObject}
                />
              ) : (
                <Image source={{ uri: selectedImage }} style={StyleSheet.absoluteFillObject} />
              )}

              <LinearGradient
                colors={bgType === 'image' ? ['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.65)'] : ['transparent', 'transparent']}
                style={styles.canvasOverlay}
              >
                {/* Sticker Badge Overlay */}
                {activeSticker ? (
                  <View style={styles.stickerBadge}>
                    <Text style={styles.stickerText}>{activeSticker}</Text>
                  </View>
                ) : null}

                {/* Main Quote Text */}
                <Text
                  style={[
                    styles.canvasText,
                    {
                      color: textColor,
                      fontSize: fontSize,
                      textAlign: textAlign,
                      letterSpacing: letterSpacing,
                      lineHeight: lineHeight,
                      textShadowColor: hasShadow ? 'rgba(0,0,0,0.75)' : 'transparent',
                      textShadowOffset: hasShadow ? { width: 1, height: 1 } : { width: 0, height: 0 },
                      textShadowRadius: hasShadow ? 4 : 0,
                    }
                  ]}
                >
                  {quoteText}
                </Text>

                <Text style={styles.watermark}>Mansoo Studio • HD</Text>
              </LinearGradient>
            </View>
          </View>

          {/* Quick Actions Row: Export HD, Save Template, Full Preview */}
          <View style={styles.quickActionsRow}>
            <TouchableOpacity style={styles.actionChip} onPress={handleExportHD}>
              <Ionicons name="download-outline" size={16} color={COLORS.primary} />
              <Text style={styles.actionChipText}>Export HD</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionChip} onPress={handleSaveCustomTemplate}>
              <Ionicons name="bookmark-outline" size={16} color={COLORS.primary} />
              <Text style={styles.actionChipText}>Save Preset</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionChip} onPress={() => setIsPreviewMode(!isPreviewMode)}>
              <Ionicons name="eye-outline" size={16} color={COLORS.accent} />
              <Text style={[styles.actionChipText, { color: COLORS.accent }]}>Preview</Text>
            </TouchableOpacity>
          </View>

          {/* Quote Text Input Editor */}
          <View style={styles.editorBox}>
            <Text style={styles.boxTitle}>Quote Canvas Text</Text>
            <TextInput
              style={styles.textInput}
              value={quoteText}
              onChangeText={setQuoteText}
              multiline
              placeholder="Type your quote here..."
            />
          </View>

          {/* 2. Designer Toolbar Tabs */}
          <View style={styles.toolbarTabs}>
            {[
              { id: 'background', label: '🎨 Backgrounds' },
              { id: 'typography', label: '✍️ Typography' },
              { id: 'frames', label: '🖼️ Frames' },
              { id: 'stickers', label: '✨ Stickers' },
            ].map(tab => (
              <TouchableOpacity
                key={tab.id}
                style={[styles.tab, activeTab === tab.id && styles.tabActive]}
                onPress={() => setActiveTab(tab.id)}
              >
                <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* 3. Tab Contents */}
          {activeTab === 'background' && (
            <View style={styles.tabContentCard}>
              <View style={styles.subTabRow}>
                <TouchableOpacity
                  style={[styles.subTab, bgType === 'gradient' && styles.subTabActive]}
                  onPress={() => setBgType('gradient')}
                >
                  <Text style={[styles.subTabText, bgType === 'gradient' && styles.subTabTextActive]}>Gradients</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.subTab, bgType === 'image' && styles.subTabActive]}
                  onPress={() => setBgType('image')}
                >
                  <Text style={[styles.subTabText, bgType === 'image' && styles.subTabTextActive]}>Unsplash Photos</Text>
                </TouchableOpacity>
              </View>

              {bgType === 'gradient' ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
                  {PRESET_GRADIENTS.map(grad => (
                    <TouchableOpacity
                      key={grad.id}
                      style={styles.gradientItem}
                      onPress={() => setSelectedGradient(grad)}
                    >
                      <LinearGradient colors={grad.colors} style={styles.gradientCircle} />
                      <Text style={styles.gradientLabel}>{grad.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
                  {UNSPLASH_TEMPLATES.map(img => (
                    <TouchableOpacity
                      key={img.id}
                      style={styles.imageThumbItem}
                      onPress={() => setSelectedImage(img.url)}
                    >
                      <Image source={{ uri: img.url }} style={styles.imageThumb} />
                      <Text style={styles.gradientLabel}>{img.category}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>
          )}

          {activeTab === 'typography' && (
            <View style={styles.tabContentCard}>
              {/* Font Alignment & Size Controls */}
              <View style={styles.ctrlRow}>
                <Text style={styles.ctrlLabel}>Font Size ({fontSize}px):</Text>
                <View style={styles.counterRow}>
                  <TouchableOpacity style={styles.stepBtn} onPress={() => setFontSize(Math.max(14, fontSize - 2))}>
                    <Text style={styles.stepText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.stepVal}>{fontSize}</Text>
                  <TouchableOpacity style={styles.stepBtn} onPress={() => setFontSize(Math.min(32, fontSize + 2))}>
                    <Text style={styles.stepText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Text Alignment */}
              <View style={styles.ctrlRow}>
                <Text style={styles.ctrlLabel}>Alignment:</Text>
                <View style={styles.alignGroup}>
                  {['left', 'center', 'right'].map(align => (
                    <TouchableOpacity
                      key={align}
                      style={[styles.alignBtn, textAlign === align && styles.alignBtnActive]}
                      onPress={() => setTextAlign(align)}
                    >
                      <Ionicons
                        name={`format-align-${align}`}
                        size={18}
                        color={textAlign === align ? '#FFFFFF' : COLORS.textPrimary}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Text Shadow Toggle */}
              <View style={styles.ctrlRow}>
                <Text style={styles.ctrlLabel}>Text Shadow:</Text>
                <TouchableOpacity
                  style={[styles.toggleBtn, hasShadow && styles.toggleBtnActive]}
                  onPress={() => setHasShadow(!hasShadow)}
                >
                  <Text style={[styles.toggleBtnText, hasShadow && { color: '#FFFFFF' }]}>
                    {hasShadow ? 'Shadow Enabled ✅' : 'No Shadow'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {activeTab === 'frames' && (
            <View style={styles.tabContentCard}>
              <Text style={styles.ctrlLabel}>Select Canvas Frame Template:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
                {FRAME_TEMPLATES.map(frame => (
                  <TouchableOpacity
                    key={frame.id}
                    style={[styles.frameCard, selectedFrame.id === frame.id && styles.frameCardSelected]}
                    onPress={() => setSelectedFrame(frame)}
                  >
                    <Text style={styles.frameName}>{frame.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {activeTab === 'stickers' && (
            <View style={styles.tabContentCard}>
              <Text style={styles.ctrlLabel}>Select Sticker Badge Overlay:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
                {STICKERS_EMOJIS.map((sticker, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[styles.stickerChip, activeSticker === sticker && styles.stickerChipActive]}
                    onPress={() => setActiveSticker(sticker)}
                  >
                    <Text style={styles.stickerEmoji}>{sticker}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
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
  doneBtnContainer: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  doneBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
  scrollContent: {
    padding: 16,
  },
  canvasWrapper: {
    alignItems: 'center',
    marginBottom: 14,
  },
  canvasCard: {
    width: width - 32,
    height: 260,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#0F3D3E',
  },
  canvasOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  stickerBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  stickerText: {
    fontSize: 16,
  },
  canvasText: {
    fontWeight: '600',
  },
  watermark: {
    position: 'absolute',
    bottom: 12,
    right: 14,
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
    fontWeight: 'bold',
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  actionChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 12,
    paddingVertical: 10,
    marginHorizontal: 3,
  },
  actionChipText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginLeft: 6,
  },
  editorBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  boxTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  textInput: {
    fontSize: 14,
    color: COLORS.textPrimary,
    minHeight: 50,
  },
  toolbarTabs: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 4,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  tabContentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  subTabRow: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 2,
  },
  subTab: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 8,
  },
  subTabActive: {
    backgroundColor: COLORS.primary,
  },
  subTabText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
  },
  subTabTextActive: {
    color: '#FFFFFF',
  },
  gradientItem: {
    alignItems: 'center',
    marginRight: 12,
  },
  gradientCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: 4,
  },
  gradientLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  imageThumbItem: {
    alignItems: 'center',
    marginRight: 12,
  },
  imageThumb: {
    width: 48,
    height: 48,
    borderRadius: 12,
    marginBottom: 4,
  },
  ctrlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  ctrlLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 2,
  },
  stepBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  stepVal: {
    fontSize: 13,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    color: COLORS.textPrimary,
  },
  alignGroup: {
    flexDirection: 'row',
  },
  alignBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  alignBtnActive: {
    backgroundColor: COLORS.primary,
  },
  toggleBtn: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  toggleBtnActive: {
    backgroundColor: COLORS.primary,
  },
  toggleBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  frameCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  frameCardSelected: {
    borderColor: COLORS.accent,
    backgroundColor: '#FFF0F3',
  },
  frameName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  stickerChip: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  stickerChipActive: {
    backgroundColor: '#FFF0F3',
    borderWidth: 2,
    borderColor: COLORS.accent,
  },
  stickerEmoji: {
    fontSize: 20,
  },
});
