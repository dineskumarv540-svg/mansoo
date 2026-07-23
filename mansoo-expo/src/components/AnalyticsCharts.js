import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../theme/colors';

/**
 * Weekly Visitors Bar Chart & Engagement Funnel Components
 */
export function WeeklyVisitorsChart({ data = [] }) {
  const maxCount = Math.max(...data.map(d => d.count), 2500);

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>📊 Weekly Visitors Trend</Text>

      <View style={styles.barRow}>
        {data.map((item, idx) => {
          const heightPercent = (item.count / maxCount) * 100;
          return (
            <View key={idx} style={styles.barColumn}>
              <Text style={styles.barValText}>{(item.count / 1000).toFixed(1)}k</Text>

              <View style={styles.barTrack}>
                <LinearGradient
                  colors={COLORS.gradientPink}
                  style={[styles.barFill, { height: `${heightPercent}%` }]}
                />
              </View>

              <Text style={styles.barLabel}>{item.day}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

export function EngagementFunnelChart({ views, reads, likes, shares }) {
  const funnels = [
    { label: 'Total Views', value: views, formatted: '45.8K', color: '#0F3D3E', percent: 100 },
    { label: 'Reads', value: reads, formatted: '32.1K', color: '#1A237E', percent: 70 },
    { label: 'Likes & Saves', value: likes, formatted: '22.5K', color: '#F26B8A', percent: 49 },
    { label: 'Shares', value: shares, formatted: '1.8K', color: '#009688', percent: 18 },
  ];

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>🎯 Content Engagement Funnel</Text>

      {funnels.map(item => (
        <View key={item.label} style={styles.funnelRow}>
          <View style={styles.funnelMeta}>
            <Text style={styles.funnelLabel}>{item.label}</Text>
            <Text style={styles.funnelVal}>{item.formatted}</Text>
          </View>

          <View style={styles.funnelTrack}>
            <View style={[styles.funnelFill, { width: `${item.percent}%`, backgroundColor: item.color }]} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  chartTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 14,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 140,
    paddingTop: 20,
  },
  barColumn: {
    alignItems: 'center',
    flex: 1,
  },
  barValText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginBottom: 4,
    fontWeight: '600',
  },
  barTrack: {
    width: 14,
    height: 90,
    backgroundColor: '#F0F0F0',
    borderRadius: 7,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 7,
  },
  barLabel: {
    fontSize: 11,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
    marginTop: 6,
  },
  funnelRow: {
    marginBottom: 12,
  },
  funnelMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  funnelLabel: {
    fontSize: 12,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  funnelVal: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  funnelTrack: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  funnelFill: {
    height: '100%',
    borderRadius: 4,
  },
});
