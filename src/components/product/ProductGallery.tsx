import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { Colors } from '@/constants/theme';

const { width } = Dimensions.get('window');

interface ProductGalleryProps {
  images: string[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    if (roundIndex !== activeIndex) {
      setActiveIndex(roundIndex);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {images.map((img, index) => (
          <View key={index} style={styles.imageContainer}>
            <Image
              source={{ uri: img }}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
              cachePolicy="disk"
              recyclingKey={`gallery-${index}`}
              transition={300}
            />
          </View>
        ))}
      </ScrollView>
      
      {images.length > 1 && (
        <View style={styles.pagination}>
          {images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                { backgroundColor: index === activeIndex ? Colors.light.primary : '#d1d1d1' },
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width,
    height: width * 1.1, // Aspect ratio slightly taller than square
    backgroundColor: '#f5f5f5',
    position: 'relative',
  },
  imageContainer: {
    width: width,
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  pagination: {
    position: 'absolute',
    bottom: 16,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
