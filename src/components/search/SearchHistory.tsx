import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface SearchHistoryProps {
  searches: string[];
  onSelect: (term: string) => void;
  onClear: () => void;
}

export function SearchHistory({ searches, onSelect, onClear }: SearchHistoryProps) {
  if (searches.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recherches récentes</Text>
        <Pressable onPress={onClear}>
          <Text style={styles.clearText}>Effacer</Text>
        </Pressable>
      </View>
      <View style={styles.tagsContainer}>
        {searches.map((term, index) => (
          <Pressable 
            key={index} 
            style={styles.tag}
            onPress={() => onSelect(term)}
          >
            <Ionicons name="time-outline" size={16} color={Colors.light.textSecondary} />
            <Text style={styles.tagText}>{term}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
  },
  clearText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  tagText: {
    fontSize: 14,
    color: Colors.light.text,
  },
});
