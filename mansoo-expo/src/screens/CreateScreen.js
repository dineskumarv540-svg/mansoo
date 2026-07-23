import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import MentionHashtagSuggestions from '../components/MentionHashtagSuggestions';
import { COLORS } from '../theme/colors';
import { moderateText } from '../services/moderationService';
import { createPostInFirestore, updatePostInFirestore } from '../services/firebaseDb';
import { saveDraftLocally, loadDraftLocally } from '../services/draftService';
import { adMobManager } from '../services/admobService';

const BG_IMAGES = [
  'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800',
  'https://images.unsplash.com/photo-1531685250784-756995259377?w=800',
  'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800',
  'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800',
];

const SOLID_COLORS = [
  '#0F3D3E', '#1A1A2E', '#2C3E50', '#8B0000', '#4A0080', '#1B5E20', '#37474F'
];

const TEXT_COLORS = ['#FFFFFF', '#000000', '#FFD54F', '#81D4FA', '#F48FB1', '#A5D6A7'];

import PremiumPostDesigner from '../components/PremiumPostDesigner';

export default function CreateScreen({ navigation, route }) {
  const editingPost = route?.params?.editPost || null;

  const [quoteText, setQuoteText] = useState(editingPost ? editingPost.quoteText : '');
  const [designerModalVisible, setDesignerModalVisible] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(editingPost?.fontStyle === 'Cursive');
  const [fontFamilyStyle, setFontFamilyStyle] = useState(editingPost?.fontStyle || 'Serif');
  const [textAlign, setTextAlign] = useState('center');
  const [bgTab, setBgTab] = useState(0); // 0: Preset Image, 1: Solid Color, 2: Custom Upload
  const [selectedBgUrl, setSelectedBgUrl] = useState(editingPost?.backgroundImageUrl || BG_IMAGES[0]);
  const [customImageUri, setCustomImageUri] = useState(null);
  const [selectedBgColor, setSelectedBgColor] = useState(SOLID_COLORS[0]);
  const [selectedTextColor, setSelectedTextColor] = useState(editingPost?.textColor || '#FFFFFF');
  const [selectedCategory, setSelectedCategory] = useState(editingPost?.category || 'Quotes');

  const [autosaveTime, setAutosaveTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = ['Poem', 'Shayari', 'Quotes', 'Story', 'Life', 'Meme', 'Jokes'];
  const fontOptions = ['Serif', 'Sans', 'Monospace', 'Cursive'];

  // Load existing draft if creating a new post
  useEffect(() => {
    if (!editingPost) {
      const savedDraft = loadDraftLocally();
      if (savedDraft && savedDraft.quoteText) {
        setQuoteText(savedDraft.quoteText);
        if (savedDraft.selectedCategory) setSelectedCategory(savedDraft.selectedCategory);
      }
    }
  }, []);

  // Autosave timer (saves every 5 seconds if text changes)
  useEffect(() => {
    if (!quoteText.trim() || editingPost) return;

    const timer = setTimeout(() => {
      const res = saveDraftLocally({
        quoteText,
        selectedCategory,
        selectedBgUrl,
        selectedTextColor,
      });
      setAutosaveTime(res.savedAt);
    }, 5000);

    return () => clearTimeout(timer);
  }, [quoteText, selectedCategory, selectedBgUrl, selectedTextColor]);

  const cycleAlign = () => {
    if (textAlign === 'center') setTextAlign('left');
    else if (textAlign === 'left') setTextAlign('right');
    else setTextAlign('center');
  };

  // Image Upload Handler
  const handlePickCustomImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setCustomImageUri(result.assets[0].uri);
        setSelectedBgUrl(result.assets[0].uri);
        setBgTab(2);
      }
    } catch (error) {
      Alert.alert('Image Picker', 'Could not select image from gallery.');
    }
  };

  // Autocomplete Insertion Handler
  const handleSelectAutocomplete = (selectedItem) => {
    const words = quoteText.split(/\s+/);
    words.pop();
    const updatedText = [...words, selectedItem].join(' ') + ' ';
    setQuoteText(updatedText);
  };

  const handlePublish = async () => {
    if (!quoteText.trim()) {
      Alert.alert('Empty Post', 'Please write your quote before publishing.');
      return;
    }

    // 1. Content Moderation Check
    const modResult = moderateText(quoteText);
    if (!modResult.isValid) {
      Alert.alert('Content Warning', `Your post cannot be published: ${modResult.reason}`);
      return;
    }

    setIsSubmitting(true);

    const postPayload = {
      authorId: 'u1',
      authorName: 'Aarav Sharma',
      authorHandle: '@aarav_writes',
      authorAvatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
      isVerified: true,
      quoteText: quoteText.trim(),
      category: selectedCategory,
      backgroundImageUrl: bgTab === 1 ? '' : (customImageUri || selectedBgUrl),
      backgroundColor: bgTab === 1 ? selectedBgColor : '',
      fontStyle: fontFamilyStyle,
      textColor: selectedTextColor,
    };

    if (editingPost) {
      await updatePostInFirestore(editingPost.id, postPayload);
      Alert.alert('Post Updated! ✨', 'Your changes have been saved.');
    } else {
      await createPostInFirestore(postPayload);
      adMobManager.showInterstitialOnPost();
      Alert.alert('Post Published! ✨', 'Your quote has been published to the Mansoo feed.');
    }

    setIsSubmitting(false);
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>{editingPost ? 'Edit Post' : 'Create Post'}</Text>
          {autosaveTime ? (
            <Text style={styles.autosaveText}>Autosaved {autosaveTime}</Text>
          ) : null}
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            style={{ marginRight: 8, padding: 4 }}
            onPress={() => setDesignerModalVisible(true)}
          >
            <Ionicons name="sparkles-outline" size={22} color={COLORS.accent} />
          </TouchableOpacity>

          <TouchableOpacity
            style={{ marginRight: 8, padding: 4 }}
            onPress={() => navigation.navigate('Drafts')}
          >
            <Ionicons name="folder-open-outline" size={22} color={COLORS.primary} />
          </TouchableOpacity>

          <TouchableOpacity onPress={handlePublish} disabled={isSubmitting} style={styles.postBtnContainer}>
            <LinearGradient colors={COLORS.gradientPink} style={styles.postBtn}>
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Ionicons name={editingPost ? "checkmark" : "send"} size={14} color="#FFFFFF" />
                  <Text style={styles.postBtnText}>{editingPost ? 'Save' : 'Post'}</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 1. Live Canvas Preview */}
        <View style={styles.canvasCard}>
          {bgTab === 1 ? (
            <View style={[styles.canvasBgColor, { backgroundColor: selectedBgColor }]} />
          ) : (
            <Image source={{ uri: customImageUri || selectedBgUrl }} style={styles.canvasBgImage} />
          )}

          <LinearGradient
            colors={bgTab === 1 ? ['transparent', 'transparent'] : ['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.65)']}
            style={styles.canvasOverlay}
          >
            <Text
              style={[
                styles.previewText,
                {
                  color: selectedTextColor,
                  fontWeight: isBold ? 'bold' : '600',
                  fontStyle: isItalic ? 'italic' : 'normal',
                  textAlign: textAlign,
                }
              ]}
            >
              {quoteText.trim() ? quoteText : 'Your words appear here...'}
            </Text>

            <Text style={styles.watermark}>Mansoo.in</Text>
          </LinearGradient>
        </View>

        {/* 2. Text Formatting Toolbar */}
        <View style={styles.editorCard}>
          <Text style={styles.cardSectionTitle}>✍️ Rich Text & Typography</Text>

          <View style={styles.toolbar}>
            <TouchableOpacity
              style={[styles.toolBtn, isBold && styles.toolBtnActive]}
              onPress={() => setIsBold(!isBold)}
            >
              <Ionicons name="text-sharp" size={18} color={isBold ? COLORS.accent : COLORS.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.toolBtn, isItalic && styles.toolBtnActive]}
              onPress={() => setIsItalic(!isItalic)}
            >
              <Ionicons name="text-outline" size={18} color={isItalic ? COLORS.accent : COLORS.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.toolBtn} onPress={cycleAlign}>
              <Ionicons
                name={
                  textAlign === 'left' ? 'format-align-left' :
                  textAlign === 'right' ? 'format-align-right' : 'reorder-two-outline'
                }
                size={18}
                color={COLORS.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {/* Font Family Selector */}
          <Text style={styles.subLabel}>Font Style:</Text>
          <View style={styles.fontFamilyRow}>
            {fontOptions.map(font => (
              <TouchableOpacity
                key={font}
                style={[styles.fontChip, fontFamilyStyle === font && styles.fontChipActive]}
                onPress={() => setFontFamilyStyle(font)}
              >
                <Text style={[styles.fontChipText, fontFamilyStyle === font && styles.fontChipTextActive]}>
                  {font}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Text Input */}
          <TextInput
            style={styles.textInput}
            placeholder="Write your Shayari, Poem, Quote... Use #tags and @mentions"
            placeholderTextColor="#AAAAAA"
            multiline
            value={quoteText}
            onChangeText={setQuoteText}
          />

          {/* Hashtag & Mention Autocomplete Popup */}
          <MentionHashtagSuggestions text={quoteText} onSelect={handleSelectAutocomplete} />

          {/* Text Color Picker */}
          <Text style={styles.subLabel}>Text Color:</Text>
          <View style={styles.colorRow}>
            {TEXT_COLORS.map(color => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorDot,
                  { backgroundColor: color },
                  selectedTextColor === color && styles.colorDotSelected
                ]}
                onPress={() => setSelectedTextColor(color)}
              />
            ))}
          </View>
        </View>

        {/* 3. Background Theme & Image Upload */}
        <View style={styles.editorCard}>
          <Text style={styles.cardSectionTitle}>🖼️ Background & Gallery Upload</Text>

          {/* Tabs */}
          <View style={styles.bgTabRow}>
            <TouchableOpacity
              style={[styles.bgTab, bgTab === 0 && styles.bgTabActive]}
              onPress={() => setBgTab(0)}
            >
              <Text style={[styles.bgTabText, bgTab === 0 && styles.bgTabTextActive]}>🌅 Presets</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.bgTab, bgTab === 1 && styles.bgTabActive]}
              onPress={() => setBgTab(1)}
            >
              <Text style={[styles.bgTabText, bgTab === 1 && styles.bgTabTextActive]}>🎨 Color</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.bgTab, bgTab === 2 && styles.bgTabActive]}
              onPress={handlePickCustomImage}
            >
              <Text style={[styles.bgTabText, bgTab === 2 && styles.bgTabTextActive]}>📸 Upload</Text>
            </TouchableOpacity>
          </View>

          {bgTab === 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bgOptionScroll}>
              {BG_IMAGES.map((url, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[styles.bgThumbnail, selectedBgUrl === url && styles.bgThumbnailSelected]}
                  onPress={() => { setSelectedBgUrl(url); setCustomImageUri(null); }}
                >
                  <Image source={{ uri: url }} style={styles.bgThumbImage} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {bgTab === 1 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bgOptionScroll}>
              {SOLID_COLORS.map((color, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.colorCircle,
                    { backgroundColor: color },
                    selectedBgColor === color && styles.colorCircleSelected
                  ]}
                  onPress={() => setSelectedBgColor(color)}
                />
              ))}
            </ScrollView>
          )}

          {bgTab === 2 && (
            <TouchableOpacity style={styles.uploadBox} onPress={handlePickCustomImage}>
              <Ionicons name="cloud-upload-outline" size={26} color={COLORS.primary} />
              <Text style={styles.uploadText}>
                {customImageUri ? 'Change Gallery Image' : 'Select Image from Phone Gallery'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* 4. Category Selector */}
        <View style={styles.editorCard}>
          <Text style={styles.cardSectionTitle}>🏷️ Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {categories.map(cat => {
              const isSelected = cat === selectedCategory;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[styles.catChip, isSelected && styles.catChipSelected]}
                  onPress={() => setSelectedCategory(cat)}
                >
                  <Text style={[styles.catChipText, isSelected && styles.catChipTextSelected]}>{cat}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Bottom Actions */}
        <View style={styles.bottomButtonsRow}>
          <TouchableOpacity
            style={styles.draftBtn}
            onPress={() => {
              saveDraftLocally({ quoteText, selectedCategory, selectedBgUrl, selectedTextColor });
              Alert.alert('Draft Saved 💾', 'Your post draft has been saved.');
            }}
          >
            <Ionicons name="save-outline" size={18} color={COLORS.textSecondary} />
            <Text style={styles.draftBtnText}>Save Draft</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>

      <PremiumPostDesigner
        visible={designerModalVisible}
        initialText={quoteText}
        onClose={() => setDesignerModalVisible(false)}
        onApply={(designedConfig) => {
          if (designedConfig.quoteText) setQuoteText(designedConfig.quoteText);
          if (designedConfig.backgroundImageUrl) setSelectedBgUrl(designedConfig.backgroundImageUrl);
          if (designedConfig.textColor) setSelectedTextColor(designedConfig.textColor);
          if (designedConfig.fontStyle) setFontFamilyStyle(designedConfig.fontStyle);
        }}
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
  titleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    fontFamily: 'serif',
  },
  autosaveText: {
    fontSize: 10,
    color: COLORS.primaryLight,
    fontWeight: '600',
  },
  postBtnContainer: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  postBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  postBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
    marginLeft: 4,
  },
  scrollContent: {
    padding: 14,
  },
  canvasCard: {
    width: '100%',
    height: 250,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#0F3D3E',
    marginBottom: 14,
    position: 'relative',
  },
  canvasBgImage: {
    ...StyleSheet.absoluteFillObject,
  },
  canvasBgColor: {
    ...StyleSheet.absoluteFillObject,
  },
  canvasOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  previewText: {
    fontSize: 18,
    lineHeight: 26,
  },
  watermark: {
    position: 'absolute',
    bottom: 10,
    right: 14,
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
    fontWeight: 'bold',
  },
  editorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  cardSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  toolbar: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 4,
    marginBottom: 10,
  },
  toolBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  toolBtnActive: {
    backgroundColor: '#FFFFFF',
  },
  fontFamilyRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  fontChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
    marginRight: 8,
  },
  fontChipActive: {
    backgroundColor: COLORS.primary,
  },
  fontChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  fontChipTextActive: {
    color: '#FFFFFF',
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
    padding: 12,
    minHeight: 90,
    fontSize: 15,
    color: COLORS.textPrimary,
    textAlignVertical: 'top',
  },
  subLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 10,
    marginBottom: 6,
  },
  colorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },
  colorDotSelected: {
    borderWidth: 2,
    borderColor: COLORS.accent,
  },
  bgTabRow: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    padding: 2,
    marginBottom: 10,
  },
  bgTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  bgTabActive: {
    backgroundColor: COLORS.primary,
  },
  bgTabText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: 'bold',
  },
  bgTabTextActive: {
    color: '#FFFFFF',
  },
  bgOptionScroll: {
    marginTop: 4,
  },
  bgThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  bgThumbnailSelected: {
    borderColor: COLORS.accent,
  },
  bgThumbImage: {
    width: '100%',
    height: '100%',
  },
  colorCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorCircleSelected: {
    borderColor: COLORS.accent,
  },
  uploadBox: {
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    borderRadius: 14,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F7F7',
    marginTop: 4,
  },
  uploadText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 6,
  },
  categoryScroll: {
    marginTop: 4,
  },
  catChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    marginRight: 8,
  },
  catChipSelected: {
    backgroundColor: COLORS.primary,
  },
  catChipText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: 'bold',
  },
  catChipTextSelected: {
    color: '#FFFFFF',
  },
  bottomButtonsRow: {
    flexDirection: 'row',
    marginTop: 6,
    marginBottom: 20,
  },
  draftBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#DDDDDD',
    borderRadius: 14,
    paddingVertical: 14,
    marginRight: 10,
  },
  draftBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    marginLeft: 6,
  },
  publishBtnContainer: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
  },
  publishBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  publishBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 6,
  },
});
