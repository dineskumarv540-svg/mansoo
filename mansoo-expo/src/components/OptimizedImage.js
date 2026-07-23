import React, { useState } from 'react';
import { Image as RNImage, View, StyleSheet, ActivityIndicator } from 'react-native';

/**
 * High-performance Optimized Image Component with caching fallback & loading spinner
 */
export const OptimizedImage = React.memo(function OptimizedImage({
  source,
  style,
  resizeMode = 'cover',
  ...props
}) {
  const [loading, setLoading] = useState(false);

  return (
    <View style={[styles.container, style]}>
      <RNImage
        source={source}
        style={[StyleSheet.absoluteFillObject, style]}
        resizeMode={resizeMode}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        fadeDuration={300}
        {...props}
      />
      {loading && (
        <View style={[StyleSheet.absoluteFillObject, styles.centerLoader]}>
          <ActivityIndicator size="small" color="rgba(255,255,255,0.7)" />
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: '#E5E7EB',
  },
  centerLoader: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
});
