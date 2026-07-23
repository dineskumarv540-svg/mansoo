import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';

export default function AdBanner() {
  return (
    <View style={styles.adContainer}>
      <Text style={styles.adBadge}>AD</Text>
      <Text style={styles.adText}>Monetization Banner • Sponsored</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  adContainer: {
    height: 50,
    backgroundColor: '#F5F5F5',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E5E5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  adBadge: {
    backgroundColor: '#CCCCCC',
    color: '#666666',
    fontSize: 9,
    fontWeight: 'bold',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  adText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});
