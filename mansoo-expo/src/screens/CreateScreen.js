import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

const BG_IMAGES = [
  'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800',
  'https://images.unsplash.com/photo-1531685250784-756995259377?w=800',
];

const SOLID_COLORS = [
  '#0F3D3E', '#1A1A2E', '#2C3E50', '#8B0000', '#4A0080', '#1B5E20', '#37474F'
];

const TEXT_COLORS = ['#FFFFFF', '#000000', '#FFD54F', '#81D4FA', '#F48FB1', '#A5D6A7'];

export default function CreateScreen({ navigation }) {
  const [quoteText, setQuoteText] = useState('');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [textAlign, setTextAlign] = useState('center');
  const [bgTab, setBgTab] = useState(0); // 0: Image, 1: Color
  const [selectedBgUrl, setSelectedBgUrl] = useState(BG_IMAGES[0]);
  const [selectedBgColor, setSelectedBgColor] = useState(SOLID_COLORS[0]);
  const [selectedTextColor, setSelectedTextColor] = useState('#FFFFFF');
  const [selectedCategory, setSelectedCategory] = useState('Quotes');

  const categories = ['Poem', 'Shayari', 'Quotes', 'Story', 'Life', 'Meme'];

  const cycleAlign = () => {
    if (textAlign === 'center') setTextAlign('left');
    else if (textAlign === 'left') setTextAlign('right');
    else setTextAlign('center');
  };

  const handlePublish = () => {
    if (!quoteText.trim()) {
      Alert.alert('Empty Post', 'Please write your quote before publishing.');
      return;
    }
    Alert.alert('Post Published! ✨', 'Your quote has been published to the Mansoo feed.');
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Post</Text>
        <TouchableOpacity onPress={handlePublish} style={styles.postBtnContainer}>
          <LinearGradient colors={COLORS.gradientPink} style={styles.postBtn}>
            <Ionicons name="send" size={14} color="#FFFFFF" />
            <Text style={styles.postBtnText}>Post</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 1. Live Canvas Preview */}
        <View style={styles.canvasCard}>
          {bgTab === 0 ? (
            <Image source={{ uri: selectedBgUrl }} style={styles.canvasBgImage} />
          ) : (
            <View style={[styles.canvasBgColor, { backgroundColor: selectedBgColor }]} />
          )}

          <LinearGradient
            colors={bgTab === 0 ? ['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.65)'] : ['transparent', 'transparent']}
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
          <Text style={styles.cardSectionTitle}>✍️ Write & Format</Text>

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

          {/* Text Input */}
          <TextInput
            style={styles.textInput}
            placeholder="Write your Shayari, Poem, Quote or Story..."
            placeholderTextColor="#AAAAAA"
            multiline
            value={quoteText}
            onChangeText={setQuoteText}
          />

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

        {/* 3. Background Theme Picker */}
        <View style={styles.editorCard}>
          <Text style={styles.cardSectionTitle}>🖼️ Background Theme</Text>

          {/* Image / Color Tabs */}
          <View style={styles.bgTabRow}>
            <TouchableOpacity
              style={[styles.bgTab, bgTab === 0 && styles.bgTabActive]}
              onPress={() => setBgTab(0)}
            >
              <Text style={[styles.bgTabText, bgTab === 0 && styles.bgTabTextActive]}>🌅 Image</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.bgTab, bgTab === 1 && styles.bgTabActive]}
              onPress={() => setBgTab(1)}
            >
              <Text style={[styles.bgTabText, bgTab === 1 && styles.bgTabTextActive]}>🎨 Color</Text>
            </TouchableOpacity>
          </View>

          {bgTab === 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bgOptionScroll}>
              {BG_IMAGES.map((url, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[styles.bgThumbnail, selectedBgUrl === url && styles.bgThumbnailSelected]}
                  onPress={() => setSelectedBgUrl(url)}
                >
                  <Image source={{ uri: url }} style={styles.bgThumbImage} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
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

        {/* Bottom Buttons */}
        <View style={styles.bottomButtonsRow}>
          <TouchableOpacity
            style={styles.draftBtn}
            onPress={() => Alert.alert('Saved to Drafts', 'Your draft has been saved locally.')}
          >
            <Ionicons name="save-outline" size={18} color={COLORS.textSecondary} />
            <Text style={styles.draftBtnText}>Save Draft</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.publishBtnContainer} onPress={handlePublish}>
            <LinearGradient colors={COLORS.gradientGreen} style={styles.publishBtn}>
              <Ionicons name="paper-plane" size={18} color="#FFFFFF" />
              <Text style={styles.publishBtnText}>Post Now</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
