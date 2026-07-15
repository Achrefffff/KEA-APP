import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface SearchSuggestionsProps {
  suggestions: string[];
  onSelect: (term: string) => void;
}

export function SearchSuggestions({ suggestions, onSelect }: SearchSuggestionsProps) {
  if (suggestions.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recherches populaires</Text>
      <View style={styles.list}>
        {suggestions.map((term, index) => (
          <Pressable 
            key={index} 
            style={styles.item}
            onPress={() => onSelect(term)}
          >
            <Ionicons name="trending-up" size={18} color={Colors.light.primary} />
            <Text style={styles.itemText}>{term}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 16,
  },
  list: {
    gap: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemText: {
    fontSize: 16,
    color: Colors.light.text,
  },
});
