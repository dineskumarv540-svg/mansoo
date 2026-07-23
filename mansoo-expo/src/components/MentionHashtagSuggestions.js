import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS } from '../theme/colors';
import { HASHTAGS, DUMMY_USERS } from '../data/dummyData';

export default function MentionHashtagSuggestions({ text, onSelect }) {
  if (!text) return null;

  const lastWord = text.split(/\s+/).pop() || '';

  const isHashtagSearch = lastWord.startsWith('#');
  const isMentionSearch = lastWord.startsWith('@');

  if (!isHashtagSearch && !isMentionSearch) return null;

  const searchTerm = lastWord.slice(1).toLowerCase();

  const matchingTags = HASHTAGS.filter(tag =>
    tag.toLowerCase().includes(searchTerm)
  );

  const matchingUsers = DUMMY_USERS.filter(user =>
    user.handle.toLowerCase().includes(searchTerm) ||
    user.name.toLowerCase().includes(searchTerm)
  );

  if (isHashtagSearch && matchingTags.length === 0) return null;
  if (isMentionSearch && matchingUsers.length === 0) return null;

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {isHashtagSearch
          ? matchingTags.map(tag => (
              <TouchableOpacity key={tag} style={styles.chip} onPress={() => onSelect(tag)}>
                <Text style={styles.chipText}>{tag}</Text>
              </TouchableOpacity>
            ))
          : matchingUsers.map(user => (
              <TouchableOpacity key={user.id} style={styles.chip} onPress={() => onSelect(user.handle)}>
                <Text style={styles.chipText}>{user.handle}</Text>
              </TouchableOpacity>
            ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    marginVertical: 6,
    paddingVertical: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  scroll: {
    paddingHorizontal: 8,
  },
  chip: {
    backgroundColor: '#F0F7F7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#D1E7E7',
  },
  chipText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
});
