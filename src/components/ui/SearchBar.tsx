import React, { useRef } from 'react';
import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export function SearchBar({ value, onChangeText, placeholder = "Rechercher...", autoFocus = false }: SearchBarProps) {
  const inputRef = useRef<TextInput>(null);

  const handleClear = () => {
    onChangeText('');
    inputRef.current?.focus();
  };

  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color={Colors.light.textSecondary} style={styles.icon} />
      <TextInput
        ref={inputRef}
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.light.textSecondary}
        autoFocus={autoFocus}
        autoCorrect={false}
        returnKeyType="search"
      />
      {value.length > 0 && (
        <Pressable onPress={handleClear} style={styles.clearBtn}>
          <Ionicons name="close-circle" size={20} color={Colors.light.textSecondary} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 12,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: Colors.light.text,
  },
  clearBtn: {
    padding: 4,
  },
});
