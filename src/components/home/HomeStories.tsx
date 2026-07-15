import React from 'react';
import { StyleSheet, ScrollView, View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';

interface StoryCategory {
  id: string;
  name: string;
  handle: string;
  image: any;
}

interface HomeStoriesProps {
  categories: StoryCategory[];
}

export function HomeStories({ categories }: HomeStoriesProps) {
  const router = useRouter();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map((cat) => (
        <Pressable 
          key={cat.id} 
          style={styles.storyItem}
          onPress={() => router.push({ pathname: '/collection/[handle]', params: { handle: cat.handle } })}
        >
          <View style={styles.storyImageRing}>
            <Image source={cat.image} style={styles.storyImage} contentFit="cover" />
          </View>
          <Text style={styles.storyLabel} numberOfLines={1}>
            {cat.name}
          </Text>
        </Pressable>
      ))}


    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'flex-start',
    gap: 16,
  },
  storyItem: {
    alignItems: 'center',
    gap: 8,
    width: 76,
  },
  storyImageRing: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 2,
    borderColor: '#ffffff', // Anneau blanc autour de la story
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyImage: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: '#f5f5f5',
  },
  storyLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff', // Texte en blanc car sur fond sombre
    textAlign: 'center',
  },
  moreButtonWrapper: {
    height: 76,
    justifyContent: 'center',
    marginLeft: -8,
  },
  moreButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
